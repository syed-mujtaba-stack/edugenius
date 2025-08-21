"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHeroBg() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 60);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Responsive resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Create particle field
    const particles = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    const color1 = new THREE.Color("hsl(260, 80%, 70%)"); // primary-ish
    const color2 = new THREE.Color("hsl(320, 80%, 70%)"); // pink/purple

    for (let i = 0; i < particles; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      const t = Math.random();
      const c = color1.clone().lerp(color2, t);
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle gradient plane behind
    const planeGeo = new THREE.PlaneGeometry(200, 200);
    const planeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#000000"),
      transparent: true,
      opacity: 0.15,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.z = -30;
    scene.add(plane);

    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      points.rotation.y = elapsed * 0.03;
      points.rotation.x = Math.sin(elapsed * 0.2) * 0.05;
      material.size = 0.06 + Math.sin(elapsed * 0.8) * 0.01;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (reduceMotion) {
      // Render a single static frame respecting reduced motion
      points.rotation.y = 0.2;
      points.rotation.x = 0.05;
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // Cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
      aria-hidden
    />
  );
}
