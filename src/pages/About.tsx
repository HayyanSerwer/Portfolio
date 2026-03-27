import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

useGLTF.preload('/src/assets/setup.glb');

function setOpacity(obj: THREE.Object3D, opacity: number) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material)
      ? (mesh.material as THREE.Material[])
      : [mesh.material as THREE.Material];
    mats.forEach((m) => {
      if (!m) return;
      m.transparent = true;
      (m as THREE.MeshStandardMaterial).opacity = opacity;
      m.needsUpdate = true;
    });
  });
}

function SetupModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene }      = useGLTF('/src/assets/setup.glb');
  const { camera, gl } = useThree();
  const groupRef       = useRef<THREE.Group>(null!);
  const opRef          = useRef(0);
  const initialized    = useRef(false);

  const isDragging   = useRef(false);
  const lastMouse    = useRef({ x: 0, y: 0 });
  const targetAngles = useRef({ x: 0, y: 0 });
  const orbitAngles  = useRef({ x: 0, y: 0 });
  const MAX          = Math.PI / 4;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const box = new THREE.Box3().setFromObject(scene);
    scene.position.sub(box.getCenter(new THREE.Vector3()));
    scene.rotation.set(0, THREE.MathUtils.degToRad(300), 0);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, 0, 20);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [scene, camera]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = (e: MouseEvent) => { isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      targetAngles.current.y = Math.max(-MAX, Math.min(MAX, targetAngles.current.y + dx * 0.007));
      targetAngles.current.x = Math.max(-MAX, Math.min(MAX, targetAngles.current.x + dy * 0.007));
    };
    const onUp = () => { isDragging.current = false; };
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [gl]);

  useFrame((_s, delta) => {
    const g   = groupRef.current;
    const cam = camera as THREE.PerspectiveCamera;
    if (!g) return;

    opRef.current = Math.min(opRef.current + delta * 1.5, 1);
    setOpacity(g, opRef.current);
    easing.damp3(g.scale, [1, 1, 1], 0.08, delta);

    const t = scrollProgress;
    easing.damp3(g.position, [t * -3.5, 0, 0], 0.08, delta);
    orbitAngles.current.x += (targetAngles.current.x - orbitAngles.current.x) * Math.min(1, delta * 8);
    orbitAngles.current.y += (targetAngles.current.y - orbitAngles.current.y) * Math.min(1, delta * 8);

    easing.dampE(g.rotation, [orbitAngles.current.x, t * 0.4 + orbitAngles.current.y, 0], 0.08, delta);

    easing.damp3(cam.position, [0, 0, 20], 0.055, delta);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  });

  return (
    <group ref={groupRef} scale={0.001}>
      <primitive object={scene} />
    </group>
  );
}

export default function About() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      setScrollProgress(prog);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={sectionRef} style={{ background: '#080808', minHeight: '100vh' }}>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 55% 60% at 50% 55%, rgba(80,60,220,0.18) 0%, transparent 70%)',
        }} />
        <Canvas
          camera={{ position: [0, 0, 20], fov: 42 }}
          gl={{ alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'auto' }}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[5,  8,  5]} intensity={1.0} />
          <directionalLight position={[-5, 2, -5]} intensity={0.4} />
          <pointLight position={[0, 3, 4]} intensity={0.8} color="#6040ff" />
          <Environment preset="city" />
          <React.Suspense fallback={null}>
            <SetupModel scrollProgress={scrollProgress} />
          </React.Suspense>
        </Canvas>
      </div>

      <section style={{
        position: 'relative', zIndex: 2, height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div className="text-center select-none" style={{ marginBottom: '55vh' }}>
          <h1 style={{
            fontFamily: '"Georgia","Times New Roman",serif',
            fontSize: 'clamp(2.8rem,6vw,5rem)',
            fontWeight: 400, letterSpacing: '-0.02em',
            color: '#fff', margin: 0, lineHeight: 1.1,
          }}>
            Let's make it{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>work.</em>
          </h1>
          <p style={{
            fontFamily: '"Georgia",serif',
            fontSize: 'clamp(0.85rem,1.5vw,1.05rem)',
            color: 'rgba(255,255,255,0.4)', lineHeight: 1.8,
            margin: '16px 0 0',
          }}>
            Full-stack developer. Clean code, sharp interfaces.
            <br />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>
              Based in Aschaffenburg, Germany · Available for work.
            </span>
          </p>
        </div>

        <div style={{
          position: 'absolute', bottom: '6%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 9, letterSpacing: '5px', color: 'rgba(255,255,255,0.25)', margin: 0, whiteSpace: 'nowrap', fontFamily: '"Share Tech Mono",monospace' }}>
            SCROLL TO EXPLORE
          </p>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)' }} />
        </div>

        {/* Drag hint */}
        <div style={{
          position: 'absolute', bottom: '6%', right: '5%',
          display: 'flex', alignItems: 'center', gap: 8,
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 9, letterSpacing: '3px', color: 'rgba(255,255,255,0.2)', margin: 0, fontFamily: '"Share Tech Mono",monospace' }}>
            DRAG TO ROTATE
          </p>
        </div>
      </section>

    </div>
  );
}