import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  {
    id: 0,
    name: 'youtube-comment-analyzer',
    year: '2026',
    desc: 'Sentiment analysis pipeline for YouTube comments. Scrapes, classifies, and visualizes comment tone across videos.',
    tech: ['React', 'TypeScript', 'FastAPI', 'NLTK'],
    href: 'https://github.com/HayyanSerwer/YouTube-Comment-Analyzer',
    model: '/assets/floppy_black.glb',
    screenshot: '/assets/screenshot_0.png',
  },
  {
    id: 1,
    name: 'reinforcement-learning-sim',
    year: '2025',
    desc: 'Agent learns to navigate environments using policy gradients. Visualizes reward curves and training in real time.',
    tech: ['Python', 'PyTorch', 'NumPy', 'Matplotlib'],
    href: 'https://github.com/HayyanSerwer',
    model: '/assets/floppy_red.glb',
    screenshot: '/assets/screenshot_1.png',
  },
  {
    id: 2,
    name: 'resume-classifier',
    year: '2025',
    desc: 'ML model that classifies resumes into job categories. Upload a PDF and get instant role predictions.',
    tech: ['React', 'FastAPI', 'NumPy', 'Joblib'],
    href: 'https://github.com/HayyanSerwer',
    model: '/assets/floppy_purple.glb',
    screenshot: '/assets/screenshot_2.png',
  },
  {
    id: 3,
    name: 'indeed-scraper',
    year: '2025',
    desc: 'Desktop tool that scrapes Indeed job listings with filters, exports to CSV, and displays results in a GUI.',
    tech: ['Python', 'Selenium', 'BeautifulSoup', 'Tkinter'],
    href: 'https://github.com/HayyanSerwer',
    model: '/assets/floppy_blue.glb',
    screenshot: '/assets/screenshot_3.png',
  },
];

const FAN: [number, number, number][] = [
  [-4.5,  0.0, 0.0],
  [-1.5,  0.4, 0.1],
  [ 1.5,  0.4, 0.2],
  [ 4.5,  0.0, 0.3],
];

const FAN_ROT: [number, number, number][] = [
  [0, 0,  0.25],
  [0, 0,  0.08],
  [0, 0, -0.08],
  [0, 0, -0.25],
];

// When active: floppy moves to left side of canvas
const ACTIVE_POS: [number, number, number] = [-3.5, 0, 1.5];
const TARGET_SIZE = 2.5;
const LERP = 0.07;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function FloppyDisk({ project, index, activeId, hoveredId, onHover, onClick }: {
  project:   typeof PROJECTS[0];
  index:     number;
  activeId:  number | null;
  hoveredId: number | null;
  onHover:   (id: number | null) => void;
  onClick:   (id: number) => void;
}) {
  const { scene } = useGLTF(project.model) as any;
  const groupRef  = useRef<THREE.Group>(null!);
  const opRef     = useRef<THREE.Group>(null!);
  const rotY      = useRef(0);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.needsUpdate = true;
        if (child.material.map) {
          child.material.map.anisotropy  = 16;
          child.material.map.minFilter   = THREE.LinearMipmapLinearFilter;
          child.material.map.magFilter   = THREE.LinearFilter;
          child.material.map.needsUpdate = true;
        }
      }
    });
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    const box  = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const span = Math.max(size.x, size.y, size.z);
    const s    = span > 0 ? TARGET_SIZE / span : 1;
    clone.scale.setScalar(s);
    const box2   = new THREE.Box3().setFromObject(clone);
    const centre = box2.getCenter(new THREE.Vector3());
    clone.position.sub(centre);
    return clone;
  }, [scene]);

  const isActive    = activeId === project.id;
  const isHovered   = hoveredId === project.id;
  const isInactive  = activeId !== null && !isActive; // another disk is active

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g || delta > 0.1) return;

    // Fade out inactive disks
    g.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        const targetOpacity = isInactive ? 0 : 1;
        child.material.opacity = lerp(child.material.opacity ?? 1, targetOpacity, 0.08);
      }
    });

    // Position
    let [tx, ty, tz] = FAN[index];
    if (isActive)       { [tx, ty, tz] = ACTIVE_POS; }
    else if (isHovered) { ty = FAN[index][1] + 0.35; }

    // Rotation
    let [rx, ry, rz] = FAN_ROT[index];
    if (isActive) {
      rotY.current += delta * 1.0;
      rx = 0.1; ry = rotY.current; rz = 0;
    } else {
      rotY.current = lerp(rotY.current, 0, 0.05);
      ry = rotY.current;
    }

    g.position.x = lerp(g.position.x, tx, LERP);
    g.position.y = lerp(g.position.y, ty, LERP);
    g.position.z = lerp(g.position.z, tz, LERP);
    g.rotation.x = lerp(g.rotation.x, rx, LERP);
    g.rotation.y = lerp(g.rotation.y, ry, LERP);
    g.rotation.z = lerp(g.rotation.z, rz, LERP);

    const ts = isActive ? 1.15 : isHovered ? 1.06 : 1.0;
    g.scale.x = lerp(g.scale.x, ts, LERP);
    g.scale.y = lerp(g.scale.y, ts, LERP);
    g.scale.z = lerp(g.scale.z, ts, LERP);
  });

  return (
    <group
      ref={groupRef}
      position={FAN[index]}
      rotation={FAN_ROT[index]}
      onPointerEnter={(e) => { e.stopPropagation(); if (!isInactive) { onHover(project.id); document.body.style.cursor = 'pointer'; } }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = 'default'; }}
      onClick={(e)        => { e.stopPropagation(); onClick(project.id); }}
    >
      <primitive object={cloned} ref={opRef} />
    </group>
  );
}

useGLTF.preload('/assets/floppy_black.glb');
useGLTF.preload('/assets/floppy_red.glb');
useGLTF.preload('/assets/floppy_purple.glb');
useGLTF.preload('/assets/floppy_blue.glb');

function Particles() {
  const ref   = useRef<THREE.Points>(null!);
  const count = 120;
  const pos   = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (delta > 0.1) return;
    ref.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.018} transparent opacity={0.1} />
    </points>
  );
}

// Cinema screen — CSS 3D overlay on the right half
function CinemaScreen({ project, visible }: { project: typeof PROJECTS[0] | null; visible: boolean }) {
  const rows = project ? [
    { label: null,       value: project.name,              size: 32, opacity: 1.0,  mono: false, serif: true  },
    { label: 'YEAR',     value: project.year,              size: 16, opacity: 0.7,  mono: true,  serif: false },
    { label: null,       value: '───────────────',         size: 12, opacity: 0.15, mono: true,  serif: false },
    { label: null,       value: project.desc,              size: 16, opacity: 0.9,  mono: false, serif: false },
    { label: null,       value: '───────────────',         size: 12, opacity: 0.15, mono: true,  serif: false },
    { label: 'STACK',    value: project.tech.join(' · '),  size: 15, opacity: 0.85, mono: true,  serif: false },
  ] : [];

  return (
    <div style={{
      position: 'absolute',
      left: '40%', top: 0, right: 0, bottom: 0,
      zIndex: 10,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4%',
    }}>
      {project && (
        <>
          {/* Cinema screen — the "back" */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 780,
          }}>

            {/* The screen itself */}
            <div style={{
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 60px rgba(255,255,255,0.04)',
              position: 'relative',
              marginBottom: 32,
            }}>
              {/* Screenshot */}
              <img
                src={project.screenshot}
                alt={project.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.55) saturate(0.8)',
                }}
              />
              {/* Screen overlay vignette */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(3,3,3,0.1), rgba(3,3,3,0.5))',
              }} />
              {/* Scanline effect on screen */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)',
              }} />
            </div>

            {/* Cinema rows — perspective text in front of screen */}
            <div style={{
              perspective: '600px',
              perspectiveOrigin: '50% 0%',
            }}>
              <div style={{
                transformStyle: 'preserve-3d',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}>
                {rows.map((row, i) => {
                  // Each row is progressively less rotated (closer to viewer = flatter)
                  const totalRows = rows.length;
                  const t = i / (totalRows - 1); // 0 = back row, 1 = front row
                  const rotX = lerp(28, 4, t);   // back rows more tilted
                  const scale = lerp(0.82, 1.0, t);
                  const translateZ = lerp(-30, 20, t);

                  return (
                    <div
                      key={i}
                      style={{
                        transform: `rotateX(${rotX}deg) translateZ(${translateZ}px) scale(${scale})`,
                        transformOrigin: 'center top',
                        padding: '5px 0',
                        borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 10,
                        transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
                        opacity: visible ? row.opacity : 0,
                      }}
                    >
                      {row.label && (
                        <span style={{
                          fontSize: 8,
                          letterSpacing: '3px',
                          color: 'rgba(255,255,255,0.3)',
                          fontFamily: '"Share Tech Mono",monospace',
                          flexShrink: 0,
                          width: 42,
                        }}>{row.label}</span>
                      )}
                      <span style={{
                        fontSize: row.size,
                        color: `rgba(255,255,255,${row.opacity})`,
                        fontFamily: row.serif
                          ? '"Georgia","Times New Roman",serif'
                          : row.mono
                          ? '"Share Tech Mono",monospace'
                          : 'system-ui, sans-serif',
                        fontWeight: row.serif ? 400 : 300,
                        fontStyle: row.serif ? 'italic' : 'normal',
                        letterSpacing: row.mono ? '1px' : '-0.01em',
                        lineHeight: 1.5,
                      }}>{row.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ESC hint */}
          <p style={{
            marginTop: 28,
            fontSize: 9, letterSpacing: '4px',
            color: 'rgba(255,255,255,0.12)',
            fontFamily: '"Share Tech Mono",monospace',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.4s',
          }}>
            ESC / CLICK TO GO BACK
          </p>
        </>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const [activeId,  setActiveId]  = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleClick = useCallback((id: number) => {
    setActiveId(prev => prev === id ? null : id);
  }, []);

  const handleClose = useCallback(() => {
    setActiveId(null);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleClose]);

  const activeProject = PROJECTS.find(p => p.id === activeId) ?? null;

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#030303',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes crt-scan-projects {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        .projects-sweep {
          position: absolute; left: 0; right: 0; height: 140px;
          background: linear-gradient(to bottom, transparent, rgba(100,180,255,0.015), transparent);
          animation: crt-scan-projects 6s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Sweep */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="projects-sweep" />
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Left label — fades out when a disk is active */}
      <div style={{
        position: 'absolute', top: '50%', left: '5%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none', zIndex: 10,
        opacity: activeId === null ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        <p style={{ margin: '0 0 10px', fontSize: 9, letterSpacing: '5px', color: 'rgba(255,255,255,0.25)', fontFamily: '"Share Tech Mono",monospace' }}>
          SELECTED WORKS
        </p>
        <h2 style={{
          margin: '0 0 18px', fontWeight: 400,
          fontSize: 'clamp(1.6rem,3vw,2.4rem)',
          color: 'rgba(255,255,255,0.88)',
          fontFamily: '"Georgia","Times New Roman",serif',
          lineHeight: 1.2, letterSpacing: '-0.02em',
        }}>
          Things I've<br /><em style={{ fontWeight: 300 }}>built.</em>
        </h2>
        <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 14 }} />
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: '"Share Tech Mono",monospace', lineHeight: 1.7 }}>
          Click a disk<br />to explore.
        </p>
      </div>

      {/* Canvas — click background to close */}
      <Canvas
        camera={{ position: [0, 0, 11], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5,  10,  8]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-4,  2, -4]} intensity={0.5} color="#8090ff" />
        <pointLight       position={[0,   4,  6]} intensity={1.6} color="#ffffff" />

        <Particles />

        {/* Invisible background plane — catches clicks that miss disks */}
        <mesh position={[0, 0, -2]} onClick={(e) => { e.stopPropagation(); handleClose(); }}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {PROJECTS.map((p, i) => (
          <FloppyDisk
            key={p.id}
            project={p}
            index={i}
            activeId={activeId}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onClick={handleClick}
          />
        ))}
      </Canvas>

      {/* Cinema screen overlay */}
      <CinemaScreen project={activeProject} visible={activeId !== null} />
    </div>
  );
}