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
  },
  {
    id: 1,
    name: 'reinforcement-learning-sim',
    year: '2025',
    desc: 'Agent learns to navigate environments using policy gradients. Visualizes reward curves and training in real time.',
    tech: ['Python', 'PyTorch', 'NumPy', 'Matplotlib'],
    href: 'https://github.com/HayyanSerwer',
    model: '/assets/floppy_red.glb',
  },
  {
    id: 2,
    name: 'resume-classifier',
    year: '2025',
    desc: 'ML model that classifies resumes into job categories. Upload a PDF and get instant role predictions.',
    tech: ['React', 'FastAPI', 'NumPy', 'Joblib'],
    href: 'https://github.com/HayyanSerwer',
    model: '/assets/floppy_purple.glb',
  },
  {
    id: 3,
    name: 'indeed-scraper',
    year: '2025',
    desc: 'Desktop tool that scrapes Indeed job listings with filters, exports to CSV, and displays results in a GUI.',
    tech: ['Python', 'Selenium', 'BeautifulSoup', 'Tkinter'],
    href: 'https://github.com/HayyanSerwer',
    model: '/assets/floppy_blue.glb',
  },
];

const FAN: [number, number, number][] = [
  [-2.2,  0.3, 0.0],
  [-0.5,  0.6, 0.1],
  [ 1.5,  0.6, 0.2],
  [ 3.5,  0.1, 0.3],
];

const FAN_ROT: [number, number, number][] = [
  [0, 0,  0.21],
  [0, 0,  0.08],
  [0, 0, -0.08],
  [0, 0, -0.33],
];

const SCATTER_UP = 3.0;
const ACTIVE_POS: [number, number, number] = [-1.5, -0.8, 2.0];
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
  const otherActive = activeId !== null && !isActive;

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g || delta > 0.1) return;

    let [tx, ty, tz] = FAN[index];
    if (isActive)         { [tx, ty, tz] = ACTIVE_POS; }
    else if (otherActive) { ty = FAN[index][1] + SCATTER_UP; }
    else if (isHovered)   { ty = FAN[index][1] + 0.35; }

    let [rx, ry, rz] = FAN_ROT[index];
    if (isActive) {
      rotY.current += delta * 1.2;
      rx = 0.15; ry = rotY.current; rz = 0;
    } else {
      rotY.current = 0;
    }

    g.position.x = lerp(g.position.x, tx, LERP);
    g.position.y = lerp(g.position.y, ty, LERP);
    g.position.z = lerp(g.position.z, tz, LERP);
    g.rotation.x = lerp(g.rotation.x, rx, LERP);
    g.rotation.y = lerp(g.rotation.y, ry, LERP);
    g.rotation.z = lerp(g.rotation.z, rz, LERP);

    const ts = isActive ? 1.12 : isHovered ? 1.06 : 1.0;
    g.scale.x = lerp(g.scale.x, ts, LERP);
    g.scale.y = lerp(g.scale.y, ts, LERP);
    g.scale.z = lerp(g.scale.z, ts, LERP);
  });

  return (
    <group
      ref={groupRef}
      position={FAN[index]}
      rotation={FAN_ROT[index]}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(project.id);  document.body.style.cursor = 'pointer'; }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(null);        document.body.style.cursor = 'default'; }}
      onClick={(e)        => { e.stopPropagation(); onClick(project.id); }}
    >
      <primitive object={cloned} />
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
      <pointsMaterial color="#ffffff" size={0.018} transparent opacity={0.12} />
    </points>
  );
}

function ProjectCard({ project, visible }: { project: typeof PROJECTS[0] | null; visible: boolean }) {
  if (!project) return null;
  return (
    <div style={{
      position: 'absolute', right: '6%', top: '50%',
      transform: `translateY(-50%) translateX(${visible ? '0' : '60px'})`,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 10, width: 300,
      fontFamily: '"Share Tech Mono","Courier New",monospace',
    }}>
      <div style={{
        background: 'rgba(3,3,3,0.97)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3,
        boxShadow: '0 0 40px rgba(255,255,255,0.04)', overflow: 'hidden',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '7px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>● {project.name}</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{project.year}</span>
        </div>
        <div style={{ padding: '14px 14px 12px' }}>
          <div style={{ marginBottom: 10, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            <span>hayyan@portfolio:~$</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}> cat {project.name}.md</span>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            {project.desc}
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, marginBottom: 6 }}>STACK</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  fontSize: 9, color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 2, padding: '2px 7px',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <a href={project.href} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', fontSize: 10, color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2,
            padding: '5px 14px', textDecoration: 'none', letterSpacing: 1,
            transition: 'border-color 0.2s, color 0.2s',
          }}>
            → VIEW ON GITHUB
          </a>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: 3, textAlign: 'right' }}>
        PRESS ESC TO CLOSE
      </div>
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

      {/* Same grid background as CRT hero */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Same sweep line */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="projects-sweep" />
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)',
      }} />



      {/* Section label — left side */}
      <div style={{
        position: 'absolute', top: '50%', left: '5%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none', zIndex: 10,
        opacity: activeId === null ? 1 : 0,
        transition: 'opacity 0.3s ease',
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

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 0, 11], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
        onClick={handleClose}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5,  10,  8]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-4,  2, -4]} intensity={0.5} color="#8090ff" />
        <pointLight       position={[0,   4,  6]} intensity={1.6} color="#ffffff" />

        <Particles />

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

      <ProjectCard project={activeProject} visible={activeId !== null} />
    </div>
  );
}