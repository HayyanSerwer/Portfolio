import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { createScreenTexture } from './Screentexture';

function easeIn(t: number): number {
  return t * t * t;
}

export interface CRTMonitorProps {
  scrollProgress: number;
  onScreenClick:  () => void;
  zoomed:         boolean;
  xOffset:        number; 
  orbitEnabled:   boolean;
}

export default function CRTMonitor({ scrollProgress, onScreenClick, zoomed, xOffset, orbitEnabled }: CRTMonitorProps) {
  const { scene }      = useGLTF('/assets/crt_monitor.glb') as any;
  const { camera, gl } = useThree();
  const groupRef       = useRef<THREE.Group>(null!);
  const scaled         = useRef(false);
  const screenTex      = useMemo(() => createScreenTexture(), []);

  const isDragging   = useRef(false);
  const lastMouse    = useRef({ x: 0, y: 0 });
  const orbitAngles  = useRef({ x: 0, y: 0 });
  const targetAngles = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const n = mesh.name.toLowerCase();
      if (n.includes('glass') || n.includes('screen') || n.includes('monitor_glass')) {
        mesh.material = new THREE.MeshStandardMaterial({
          map:               screenTex,
          emissiveMap:       screenTex,
          emissive:          new THREE.Color(0x88bbff),
          emissiveIntensity: 0.5,
          roughness:         0.1,
          metalness:         0.0,
        });
      }
    });
  }, [scene, screenTex]);

  useEffect(() => {
    if (scaled.current || !groupRef.current) return;
    scaled.current = true;
    const box    = new THREE.Box3().setFromObject(scene);
    const size   = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    scene.position.sub(centre);
    const TARGET = 4.0;
    const maxDim = Math.max(size.x, size.y, size.z);
    const s      = maxDim > 0 ? TARGET / maxDim : 1;
    groupRef.current.scale.setScalar(s);
    console.log('[CRT] bounding size:', size, 'scale:', s.toFixed(4));
  }, [scene]);

  useEffect(() => {
    const canvas = gl.domElement;
    const MAX    = Math.PI / 4;

    const onDown = (e: MouseEvent) => {
      if (!orbitEnabled) return;
      isDragging.current = true;
      lastMouse.current  = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !orbitEnabled) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      targetAngles.current.y = targetAngles.current.y + dx * 0.008;
      targetAngles.current.x = Math.max(-MAX, Math.min(MAX, targetAngles.current.x + dy * 0.008));
    };
    const onUp = () => { isDragging.current = false; };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [gl, orbitEnabled]);

  useEffect(() => {
    if (!orbitEnabled) targetAngles.current = { x: 0, y: 0 };
  }, [orbitEnabled]);

  useFrame((_s, delta) => {
    const g   = groupRef.current;
    const cam = camera as THREE.PerspectiveCamera;
    if (!g) return;

    const t   = easeIn(Math.max(0, Math.min(1, scrollProgress)));
    const rot = THREE.MathUtils.lerp(-Math.PI / 2, 0, t);

    orbitAngles.current.x += (targetAngles.current.x - orbitAngles.current.x) * Math.min(1, delta * 8);
    orbitAngles.current.y += (targetAngles.current.y - orbitAngles.current.y) * Math.min(1, delta * 8);

    if (orbitEnabled && !isDragging.current) {
      targetAngles.current.y += delta * 0.3;
      if (targetAngles.current.y > Math.PI * 10) targetAngles.current.y -= Math.PI * 20;
    }

    easing.dampE(g.rotation, [rot + orbitAngles.current.x, orbitAngles.current.y, 0], 0.06, delta);

    const targetX = THREE.MathUtils.lerp(0.5, -2.5, xOffset);
    const camZ    = zoomed ? 7 : 20;
    easing.damp3(cam.position, [targetX, 0.3, camZ], 0.07, delta);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <mesh
        position={[0, 0, 0.55]}
        onPointerDown={(e) => { e.stopPropagation(); onScreenClick(); }}
      >
        <planeGeometry args={[2.6, 2.0]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/crt_monitor.glb');