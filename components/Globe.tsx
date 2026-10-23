"use client"

import createGlobe from "cobe"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export type GlobePlace = {
  city: string
  lat: number
  lng: number
  kind: "home" | "visited" | "transit"
}

type Vec3 = [number, number, number]

const DEG = Math.PI / 180
const THETA_MIN = -0.15
const THETA_MAX = 0.65
const LEG_MS = 2600
const INDIGO = "79, 70, 229"
const AMBER = "245, 158, 11"

// Same lat/lng -> sphere mapping cobe uses for its markers, so the overlay
// lines up with the WebGL globe exactly.
function toVec(lat: number, lng: number): Vec3 {
  const c = lat * DEG
  const a = lng * DEG - Math.PI
  const t = Math.cos(c)
  return [-t * Math.cos(a), Math.sin(c), t * Math.sin(a)]
}

// Inverse of the rotation cobe applies in its fragment shader.
function rotate(p: Vec3, phi: number, theta: number): Vec3 {
  const c = Math.cos(theta), e = Math.sin(theta), d = Math.cos(phi), f = Math.sin(phi)
  return [
    d * p[0] + f * p[2],
    f * e * p[0] + c * p[1] - d * e * p[2],
    -f * c * p[0] + e * p[1] + d * c * p[2],
  ]
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const omega = Math.acos(dot)
  if (omega < 1e-4) return a
  const s = Math.sin(omega)
  const wa = Math.sin((1 - t) * omega) / s
  const wb = Math.sin(t * omega) / s
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb]
}

function vecToAngles(v: Vec3): [number, number] {
  const lat = Math.asin(v[1])
  const lng = Math.atan2(v[2], -v[0]) + Math.PI
  return [Math.PI - (lng - Math.PI / 2), lat]
}

function shortestAngle(from: number, to: number) {
  const twoPi = Math.PI * 2
  return ((((to - from) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI
}

// Deterministic shuffle: the loop order is deliberately not chronological.
function shuffled<T>(items: T[], seed = 7): T[] {
  const out = [...items]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * cobe globe with a 2D overlay that flies a single plane from marker to
 * marker in a continuous, non-chronological loop. The globe eases to follow
 * the plane; dragging takes over until released. Reduced motion renders a
 * still globe with markers only.
 */
export function Globe({ places, className }: { places: GlobePlace[]; className?: string }) {
  const globeRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const phi = useRef(vecToAngles(toVec(55.6, 13))[0])
  const theta = useRef(0.35)
  const drag = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = globeRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let size = canvas.offsetWidth

    const markers = places.map((p) => ({
      location: [p.lat, p.lng] as [number, number],
      size: p.kind === "home" ? 0.09 : p.kind === "transit" ? 0.025 : 0.05,
      color: (p.kind === "transit" ? [0.6, 0.6, 0.66] : p.kind === "home" ? [251 / 255, 100 / 255, 21 / 255] : [79 / 255, 70 / 255, 229 / 255]) as [number, number, number],
    }))

    const route = shuffled(places.filter((p) => p.kind !== "transit")).map((p) => toVec(p.lat, p.lng))
    let leg = 0
    let legStart = performance.now()

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi: phi.current,
      theta: theta.current,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [79 / 255, 70 / 255, 229 / 255],
      glowColor: [1, 1, 1],
      markers,
      onRender: (state) => {
        state.phi = phi.current
        state.theta = theta.current
        state.width = size * dpr
        state.height = size * dpr
      },
    })

    const ctx = overlay.getContext("2d")
    const resize = () => {
      size = canvas.offsetWidth
      overlay.width = size * dpr
      overlay.height = size * dpr
    }
    resize()
    window.addEventListener("resize", resize)

    const toScreen = (v: Vec3, lift = 1) => {
      const r = rotate(v, phi.current, theta.current)
      const half = (size * dpr) / 2
      return { x: half + r[0] * 0.8 * lift * half, y: half - r[1] * 0.8 * lift * half, front: r[2] > -0.05 }
    }

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(now - last, 250)
      last = now
      if (!ctx || route.length < 2) return

      let t = (now - legStart) / LEG_MS
      if (t >= 1) {
        leg = (leg + 1) % route.length
        legStart = now
        t = 0
      }
      const from = route[leg]
      const to = route[(leg + 1) % route.length]
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      const plane = slerp(from, to, eased)

      // Follow the plane unless the visitor is dragging.
      if (!drag.current) {
        const [targetPhi, targetTheta] = vecToAngles(plane)
        const follow = 1 - Math.exp(-dt / 320)
        phi.current += shortestAngle(phi.current, targetPhi) * follow
        theta.current += (Math.min(THETA_MAX, Math.max(THETA_MIN, targetTheta * 0.6)) - theta.current) * follow
      }

      ctx.clearRect(0, 0, overlay.width, overlay.height)
      const lw = 1.6 * dpr

      // Contrail from the last stop to the plane, arcing above the surface.
      ctx.lineWidth = lw
      ctx.lineCap = "round"
      const steps = 36
      let prev = toScreen(from)
      for (let i = 1; i <= steps; i++) {
        const k = (i / steps) * eased
        const p = toScreen(slerp(from, to, k), 1 + 0.12 * Math.sin(Math.PI * k))
        if (p.front && prev.front) {
          ctx.strokeStyle = `rgba(${AMBER}, ${0.15 + 0.75 * (i / steps)})`
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }
        prev = p
      }

      // Destination ping.
      const dest = toScreen(to)
      if (dest.front) {
        const pulse = (now % 1400) / 1400
        ctx.strokeStyle = `rgba(${INDIGO}, ${0.5 * (1 - pulse)})`
        ctx.lineWidth = lw
        ctx.beginPath()
        ctx.arc(dest.x, dest.y, (4 + 10 * pulse) * dpr, 0, Math.PI * 2)
        ctx.stroke()
      }

      // The plane itself.
      const head = toScreen(plane, 1 + 0.12 * Math.sin(Math.PI * eased))
      if (head.front) {
        ctx.fillStyle = `rgba(${AMBER}, 0.25)`
        ctx.beginPath()
        ctx.arc(head.x, head.y, 7 * dpr, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgb(${AMBER})`
        ctx.beginPath()
        ctx.arc(head.x, head.y, 3 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    if (!reduce) raf = requestAnimationFrame(frame)

    requestAnimationFrame(() => {
      canvas.style.opacity = "1"
      overlay.style.opacity = "1"
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      globe.destroy()
    }
  }, [places])

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    phi.current += (e.clientX - drag.current.x) / 180
    theta.current = Math.min(THETA_MAX, Math.max(THETA_MIN, theta.current + (e.clientY - drag.current.y) / 300))
    drag.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => {
    drag.current = null
  }

  return (
    <div
      className={cn("relative mx-auto aspect-square w-full max-w-[600px] cursor-grab touch-pan-y active:cursor-grabbing", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={globeRef} className="absolute inset-0 size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]" />
      <canvas ref={overlayRef} aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-500" />
    </div>
  )
}

export default Globe
