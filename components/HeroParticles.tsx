"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Logistics-network hero backdrop, weighted to the right of the card so it
 * doesn't fight the headline. Reads clearly as a supply-chain network:
 *   - hubs (distribution centres) with soft halos
 *   - curved routes between hubs
 *   - shipments (bright packets) travelling along the routes
 *   - faint ambient demand points drifting behind it
 * Perf-budgeted (DPR cap, fewer elements on mobile, paused offscreen / hidden);
 * reduced-motion renders a single static frame.
 */
export default function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    let width = el.clientWidth || 1;
    let height = el.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = isMobile ? 5.8 : 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(canvas);

    const group = new THREE.Group();
    // Push the network to the right on desktop; centre it on mobile.
    group.position.x = isMobile ? 0 : 1.4;
    scene.add(group);

    // Soft edge mask so the network melts into the card — and clears the
    // headline on the left on desktop.
    const mask = isMobile
      ? "radial-gradient(120% 85% at 50% 42%, #000 50%, transparent 100%)"
      : "linear-gradient(to right, transparent 0%, #000 44%)";
    el.style.setProperty("mask-image", mask);
    el.style.setProperty("-webkit-mask-image", mask);

    const INDIGO = 0x4f46e5;
    const TEAL = 0x14b8a6;
    const AMBER = 0xf59e0b;
    const S = isMobile ? 0.5 : 1;

    // ---- Hubs (distribution centres) ----
    const hubBase = [
      [0.2, 1.2, 0.2],
      [1.6, 0.4, -0.3],
      [2.9, 1.3, 0.1],
      [3.4, -0.5, -0.2],
      [1.9, -1.3, 0.2],
      [0.6, -0.5, -0.1],
    ].map(([x, y, z]) => new THREE.Vector3(x * S, y * S, z * S));

    const hubPos = new Float32Array(hubBase.length * 3);
    const hubCol = new Float32Array(hubBase.length * 3);
    const col = new THREE.Color();
    hubBase.forEach((v, i) => {
      hubPos[i * 3] = v.x;
      hubPos[i * 3 + 1] = v.y;
      hubPos[i * 3 + 2] = v.z;
      col.setHex(i % 2 === 0 ? INDIGO : TEAL);
      hubCol[i * 3] = col.r;
      hubCol[i * 3 + 1] = col.g;
      hubCol[i * 3 + 2] = col.b;
    });
    const hubGeo = new THREE.BufferGeometry();
    hubGeo.setAttribute("position", new THREE.BufferAttribute(hubPos, 3));
    hubGeo.setAttribute("color", new THREE.BufferAttribute(hubCol, 3));
    const hubMat = new THREE.PointsMaterial({
      size: 0.18 * (isMobile ? 0.8 : 1),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    });
    const hubs = new THREE.Points(hubGeo, hubMat);
    const haloMat = new THREE.PointsMaterial({
      size: 0.5 * (isMobile ? 0.8 : 1),
      vertexColors: true,
      transparent: true,
      opacity: 0.16,
      sizeAttenuation: true,
    });
    const halos = new THREE.Points(hubGeo, haloMat);
    group.add(halos);
    group.add(hubs);

    // ---- Routes (curved arcs between hubs) ----
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [4, 5],
      [5, 0],
      [1, 3],
    ];
    const curves: THREE.QuadraticBezierCurve3[] = [];
    const routeMat = new THREE.LineBasicMaterial({
      color: INDIGO,
      transparent: true,
      opacity: 0.42,
    });
    edges.forEach(([a, b]) => {
      const start = hubBase[a];
      const end = hubBase[b];
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.z += 0.7 * S;
      mid.y += 0.25 * S;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      curves.push(curve);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(36));
      group.add(new THREE.Line(geo, routeMat));
    });

    // ---- Packets (shipments moving along routes) ----
    const packetPos = new Float32Array(curves.length * 3);
    const packetT = curves.map(() => Math.random());
    const packetSpeed = curves.map(() => 0.12 + Math.random() * 0.16);
    const packetGeo = new THREE.BufferGeometry();
    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    const basePacketSize = 0.17 * (isMobile ? 0.9 : 1);
    const packetMat = new THREE.PointsMaterial({
      color: AMBER,
      size: basePacketSize,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
    });
    const packets = new THREE.Points(packetGeo, packetMat);
    group.add(packets);

    // ---- Ambient demand points ----
    const AMBIENT = isMobile ? 26 : 54;
    const ambPos = new Float32Array(AMBIENT * 3);
    const ambVel = new Float32Array(AMBIENT * 3);
    const AX = 4.0 * S;
    const AY = 1.7 * S;
    const AZ = 0.5 * S;
    for (let i = 0; i < AMBIENT; i++) {
      ambPos[i * 3] = (Math.random() * 1.4 - 0.3) * AX;
      ambPos[i * 3 + 1] = (Math.random() * 2 - 1) * AY;
      ambPos[i * 3 + 2] = (Math.random() * 2 - 1) * AZ;
      ambVel[i * 3] = (Math.random() * 2 - 1) * 0.05;
      ambVel[i * 3 + 1] = (Math.random() * 2 - 1) * 0.05;
      ambVel[i * 3 + 2] = (Math.random() * 2 - 1) * 0.03;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({
      color: TEAL,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const ambient = new THREE.Points(ambGeo, ambMat);
    group.add(ambient);

    const ambLinePos = new Float32Array(AMBIENT * AMBIENT * 3);
    const ambLineGeo = new THREE.BufferGeometry();
    ambLineGeo.setAttribute("position", new THREE.BufferAttribute(ambLinePos, 3));
    const ambLineMat = new THREE.LineBasicMaterial({
      color: INDIGO,
      transparent: true,
      opacity: 0.08,
    });
    const ambLines = new THREE.LineSegments(ambLineGeo, ambLineMat);
    group.add(ambLines);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    let raf = 0;
    let running = false;

    const renderFrame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // packets travel along their route
      for (let i = 0; i < curves.length; i++) {
        packetT[i] = (packetT[i] + packetSpeed[i] * dt) % 1;
        curves[i].getPoint(packetT[i], tmp);
        packetPos[i * 3] = tmp.x;
        packetPos[i * 3 + 1] = tmp.y;
        packetPos[i * 3 + 2] = tmp.z;
      }
      packetGeo.attributes.position.needsUpdate = true;
      packetMat.size = basePacketSize * (1 + 0.18 * Math.sin(t * 3));

      // hub halo pulse
      haloMat.opacity = 0.12 + 0.06 * (0.5 + 0.5 * Math.sin(t * 1.5));

      // ambient drift + faint links
      for (let i = 0; i < AMBIENT; i++) {
        ambPos[i * 3] += ambVel[i * 3] * dt;
        ambPos[i * 3 + 1] += ambVel[i * 3 + 1] * dt;
        ambPos[i * 3 + 2] += ambVel[i * 3 + 2] * dt;
        if (ambPos[i * 3] > 1.1 * AX || ambPos[i * 3] < -0.4 * AX) ambVel[i * 3] *= -1;
        if (ambPos[i * 3 + 1] > AY || ambPos[i * 3 + 1] < -AY) ambVel[i * 3 + 1] *= -1;
        if (ambPos[i * 3 + 2] > AZ || ambPos[i * 3 + 2] < -AZ) ambVel[i * 3 + 2] *= -1;
      }
      ambGeo.attributes.position.needsUpdate = true;

      let v = 0;
      const maxD = (0.85 * S) * (0.85 * S);
      for (let i = 0; i < AMBIENT; i++) {
        const ax = ambPos[i * 3];
        const ay = ambPos[i * 3 + 1];
        const az = ambPos[i * 3 + 2];
        for (let j = i + 1; j < AMBIENT; j++) {
          const dx = ax - ambPos[j * 3];
          const dy = ay - ambPos[j * 3 + 1];
          const dz = az - ambPos[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < maxD) {
            ambLinePos[v++] = ax;
            ambLinePos[v++] = ay;
            ambLinePos[v++] = az;
            ambLinePos[v++] = ambPos[j * 3];
            ambLinePos[v++] = ambPos[j * 3 + 1];
            ambLinePos[v++] = ambPos[j * 3 + 2];
          }
        }
      }
      ambLineGeo.setDrawRange(0, v / 3);
      ambLineGeo.attributes.position.needsUpdate = true;

      // pointer parallax
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      group.rotation.y = pointer.x * 0.2;
      group.rotation.x = pointer.y * 0.12;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      clock.start();
      raf = requestAnimationFrame(renderFrame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) {
      for (let i = 0; i < curves.length; i++) {
        curves[i].getPoint(packetT[i], tmp);
        packetPos[i * 3] = tmp.x;
        packetPos[i * 3 + 1] = tmp.y;
        packetPos[i * 3 + 2] = tmp.z;
      }
      packetGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    } else {
      start();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      width = el.clientWidth || 1;
      height = el.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (reduce) renderer.render(scene, camera);
    });
    ro.observe(el);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((obj) => {
        const any = obj as unknown as {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material;
        };
        any.geometry?.dispose?.();
        any.material?.dispose?.();
      });
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
