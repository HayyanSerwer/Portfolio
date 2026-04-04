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
  },
  {
    id: 1,
    name: 'reinforcement-learning-sim',
    year: '2025',
    desc: 'Agent learns to navigate environments using policy gradients. Visualizes reward curves and training in real time.',
    tech: ['Python', 'PyTorch', 'NumPy', 'Matplotlib'],
    href: 'https://github.com/HayyanSerwer',
  },
  {
    id: 2,
    name: 'resume-classifier',
    year: '2025',
    desc: 'ML model that classifies resumes into job categories. Upload a PDF and get instant role predictions.',
    tech: ['React', 'FastAPI', 'NumPy', 'Joblib'],
    href: 'https://github.com/HayyanSerwer',
  },
  {
    id: 3,
    name: 'indeed-scraper',
    year: '2025',
    desc: 'Desktop tool that scrapes Indeed job listings with filters, exports to CSV, and displays results in a GUI.',
    tech: ['Python', 'Selenium', 'BeautifulSoup', 'Tkinter'],
    href: 'https://github.com/HayyanSerwer',
  },
];

const FAN = [
  { pos: [-2.7, 0.2, 0.0] as [number,number,number], rot: [0, 0, 0.3] as [number,number,number] },
  { pos: [-0.9,  0.6, 0.1] as [number,number,number], rot: [0, 0, 0.2] as [number,number,number] },
  { pos: [ 0.9,  0.5, 0.2] as [number,number,number], rot: [0, 0, -0.1] as [number,number,number] },
  { pos: [ 2.4, 0.2, 0.3] as [number,number,number], rot: [0, 0,  -0.3] as [number,number,number] },
];

const SCATTER_UP  = 2.4;
const ACTIVE_POS: [number,number,number] = [-1.2, -0.6, 1.5];
const TARGET_SIZE = 2.9;
const LERP        = 0.08;

function lerpV3(obj: THREE.Vector3, tx: number, ty: number, tz: number, t: number) {
  obj.x += (tx - obj.x) * t;
  obj.y += (ty - obj.y) * t;
  obj.z += (tz - obj.z) * t;
}
function lerpE(obj: THREE.Euler, rx: number, ry: number, rz: number, t: number) {
  obj.x += (rx - obj.x) * t;
  obj.y += (ry - obj.y) * t;
  obj.z += (rz - obj.z) * t;
}

function FloppyDisk({ project, index, activeId, hoveredId, onHover, onClick }: {
  project: typeof PROJECTS[0];
  index: number;
  activeId: number | null;
  hoveredId: number | null;
  onHover: (id: number | null) => void;
  onClick: (id: number) => void;
}) {
  const gltf = useGLTF('/assets/floppy_disk.glb') as any;

  // useMemo so the clone is stable and only created once per disk instance
  const cloned = useMemo(() => {
    const mesh = gltf.scene.clone(true);
    const box  = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const s    = TARGET_SIZE / Math.max(size.x, size.y, size.z);
    mesh.scale.setScalar(s);
    const box2   = new THREE.Box3().setFromObject(mesh);
    const centre = box2.getCenter(new THREE.Vector3());
    mesh.position.sub(centre);
    return mesh;
  }, [gltf.scene]);

  const groupRef = useRef<THREE.Group>(null!);
  const rotY     = useRef(0);

  // On mount — snap group to fan position immediately so first frame is clean
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.set(...FAN[index].pos);
    g.rotation.set(...FAN[index].rot);
    g.scale.setScalar(1);
    rotY.current = 0;
  }, [index]);

  const isActive    = activeId === project.id;
  const isHovered   = hoveredId === project.id;
  const otherActive = activeId !== null && !isActive;

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    // Hard cap delta — anything above 100ms is a stale frame, skip it
    if (delta > 0.1) return;

    let tx = FAN[index].pos[0];
    let ty = FAN[index].pos[1];
    let tz = FAN[index].pos[2];

    if (isActive)         { [tx, ty, tz] = ACTIVE_POS; }
    else if (otherActive) { ty += SCATTER_UP; }
    else if (isHovered)   { ty += 0.4; }

    let rx = FAN[index].rot[0];
    let ry = FAN[index].rot[1];
    let rz = FAN[index].rot[2];

    if (isActive) {
      rotY.current += delta * 0.9;
      rx = 0.15; ry = rotY.current; rz = 0;
    } else {
      rotY.current = 0;
    }

    lerpV3(g.position, tx, ty, tz, LERP);
    lerpE(g.rotation,  rx, ry, rz, LERP);

    const ts = isActive ? 1.1 : isHovered ? 1.06 : 1.0;
    g.scale.x += (ts - g.scale.x) * LERP;
    g.scale.y += (ts - g.scale.y) * LERP;
    g.scale.z += (ts - g.scale.z) * LERP;
  });

  return (
    <group
      ref={groupRef}
      position={FAN[index].pos}
      rotation={FAN[index].rot}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(project.id);  document.body.style.cursor = 'pointer'; }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(null);        document.body.style.cursor = 'default'; }}
      onClick={(e)        => { e.stopPropagation(); onClick(project.id); }}
    >
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload('/assets/floppy_disk.glb');

function Particles() {
  const ref   = useRef<THREE.Points>(null!);
  const count = 160;
  const pos   = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random()-0.5)*22;
      arr[i*3+1] = (Math.random()-0.5)*14;
      arr[i*3+2] = (Math.random()-0.5)*8 - 4;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (delta > 0.1) return;
    ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#1a8c3a" size={0.025} transparent opacity={0.5} />
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
        background: 'rgba(6,12,6,0.97)',
        border: '1px solid #1a8c3a', borderRadius: 3,
        boxShadow: '0 0 40px rgba(51,255,102,0.1)', overflow: 'hidden',
      }}>
        <div style={{
          background: 'rgba(0,20,6,0.98)', borderBottom: '1px solid #1a8c3a',
          padding: '7px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, color: '#33ff66', fontWeight: 'bold' }}>● {project.name}</span>
          <span style={{ fontSize: 9, color: '#1a8c3a' }}>{project.year}</span>
        </div>
        <div style={{ padding: '14px 14px 12px' }}>
          <div style={{ marginBottom: 10, fontSize: 10, color: '#1a8c3a' }}>
            <span>hayyan@portfolio:~$</span>
            <span style={{ color: 'rgba(220,255,230,0.7)' }}> cat {project.name}.md</span>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 11, color: 'rgba(200,240,200,0.85)', lineHeight: 1.7 }}>
            {project.desc}
          </p>
          <div style={{ borderTop: '1px dashed #1a4a1a', paddingTop: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 8, color: '#1a8c3a', letterSpacing: 2, marginBottom: 6 }}>STACK</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  fontSize: 9, color: '#ffb830',
                  border: '1px solid rgba(255,184,48,0.3)',
                  borderRadius: 2, padding: '2px 7px',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <a href={project.href} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', fontSize: 10, color: '#33ff66',
            border: '1px solid #1a8c3a', borderRadius: 2,
            padding: '5px 14px', textDecoration: 'none', letterSpacing: 1,
          }}>
            → VIEW ON GITHUB
          </a>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 9, color: 'rgba(51,255,102,0.3)', letterSpacing: 3, textAlign: 'right' }}>
        PRESS ESC TO CLOSE
      </div>
    </div>
  );
}

export default function Projects() {
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
    <div style={{ width: '100vw', height: '100vh', background: '#060c06', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        .scan { position:absolute;left:0;right:0;height:100px;pointer-events:none;
          background:linear-gradient(to bottom,transparent,rgba(51,255,102,0.02),transparent);
          animation:scanline 8s linear infinite; }
      `}</style>

      <div className="scan" />
      <div style={{
        position:'absolute',inset:0,pointerEvents:'none',zIndex:1,
        background:'radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.75) 100%)',
      }} />

      <div style={{
        position:'absolute',top:0,left:0,right:0,height:38,zIndex:10,
        borderBottom:'1px solid rgba(51,255,102,0.08)',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 28px',fontFamily:'"Share Tech Mono",monospace',
        background:'rgba(0,0,0,0.5)',
      }}>
        <span style={{fontSize:9,letterSpacing:'5px',color:'rgba(51,255,102,0.3)'}}>HAYYAN · PROJECTS</span>
        <span style={{fontSize:9,letterSpacing:'3px',color:'rgba(51,255,102,0.15)'}}>
          {activeId !== null ? 'CLICK DISK TO CLOSE · ESC' : 'HOVER & CLICK A DISK'}
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 11], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', inset: 0 }}
        onClick={handleClose}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5,  8,  5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#aaffcc" />
        <pointLight position={[0,  3,  6]} intensity={2.0} color="#ffffff" distance={14} />
        <pointLight position={[0, -3,  4]} intensity={0.8} color="#33ff66" distance={10} />

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