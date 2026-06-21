"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Lightweight "logistics network" hero backdrop: drifting nodes connected by
 * faint routes, in the brand palette. Perf-budgeted (DPR cap, low node count on
 * mobile, paused offscreen / when the tab is hidden) and disabled under
 * prefers-reduced-motion (renders a single static frame). Renders into the
 * nearest positioned ancestor; mount inside a `relative` container.
 */
export default function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    const COUNT = isMobile ? 40 : 90;
    const MAX_DIST = isMobile ? 1.0 : 1.15;
    const RANGE_X = 4.4;
    const RANGE_Y = 2.4;
    const RANGE_Z = 1.2;

    let width = el.clientWidth || 1;
    let height = el.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;

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

    const palette = [0x4f46e5, 0x14b8a6, 0xf59e0b];
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * RANGE_X;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * RANGE_Y;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * RANGE_Z;
      velocities[i * 3] = (Math.random() * 2 - 1) * 0.07;
      velocities[i * 3 + 1] = (Math.random() * 2 - 1) * 0.07;
      velocities[i * 3 + 2] = (Math.random() * 2 - 1) * 0.04;
      tmpColor.setHex(palette[i % palette.length]);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pointMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointGeo, pointMat);

    const linePositions = new Float32Array(COUNT * COUNT * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);

    const group = new THREE.Group();
    group.add(points);
    group.add(lines);
    scene.add(group);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;

    const renderFrame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);

      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] += velocities[i * 3] * dt;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
        if (positions[i * 3] > RANGE_X || positions[i * 3] < -RANGE_X)
          velocities[i * 3] *= -1;
        if (positions[i * 3 + 1] > RANGE_Y || positions[i * 3 + 1] < -RANGE_Y)
          velocities[i * 3 + 1] *= -1;
        if (positions[i * 3 + 2] > RANGE_Z || positions[i * 3 + 2] < -RANGE_Z)
          velocities[i * 3 + 2] *= -1;
      }
      pointGeo.attributes.position.needsUpdate = true;

      let v = 0;
      const maxDistSq = MAX_DIST * MAX_DIST;
      for (let i = 0; i < COUNT; i++) {
        const ax = positions[i * 3];
        const ay = positions[i * 3 + 1];
        const az = positions[i * 3 + 2];
        for (let j = i + 1; j < COUNT; j++) {
          const dx = ax - positions[j * 3];
          const dy = ay - positions[j * 3 + 1];
          const dz = az - positions[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < maxDistSq) {
            linePositions[v++] = ax;
            linePositions[v++] = ay;
            linePositions[v++] = az;
            linePositions[v++] = positions[j * 3];
            linePositions[v++] = positions[j * 3 + 1];
            linePositions[v++] = positions[j * 3 + 2];
          }
        }
      }
      lineGeo.setDrawRange(0, v / 3);
      lineGeo.attributes.position.needsUpdate = true;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      group.rotation.y = pointer.x * 0.25;
      group.rotation.x = pointer.y * 0.15;

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
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
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
