import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { createScreenTexture } from '../components/crt/Screentexture';

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
    desc: 'A reinforcement learning environment where agents learn to survive by escaping a bouncing ball inside a circular arena.',
    tech: ['Python', 'PyTorch', 'NumPy', 'Matplotlib'],
    href: 'https://github.com/HayyanSerwer',
  },
  {
    id: 2,
    name: 'resume-classifier',
    year: '2025',
    desc: 'Simple resume classifier built using logistic regression in the backend to answer whether you are a software engineer or not.',
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

const CAREER = [
  {
    id: 0,
    role: 'Fullstack Developer',
    company: 'PAYTO Technologies',
    period: '2026 - Present',
    type: 'Part-time',
    active: true,
  },
  {
    id: 1,
    role: 'Programming Research Assistant',
    company: 'TH Aschaffenburg',
    period: '2025 - Present',
    type: 'Part-time',
    active: true,
  },
  {
    id: 3,
    role: 'Technical Writer',
    company: 'Tech4Gamers',
    period: '2022 - 2023',
    type: 'Freelance',
    active: false,
  },
  {
    id: 4,
    role: 'Freelance Game Developer',
    company: 'Self-employed',
    period: '2021 - 2022',
    type: 'Freelance',
    active: false,
  },
];

const LINKS = [
  { label: 'Email',    value: 'hayyan.serwer@gmail.com',        href: 'mailto:hayyan.serwer@gmail.com' },
  { label: 'GitHub',   value: 'github.com/HayyanSerwer',         href: 'https://github.com/HayyanSerwer' },
  { label: 'LinkedIn', value: 'linkedin.com/in/hayyan-serwer',   href: 'https://www.linkedin.com/in/hayyan-serwer-618277274/' },
  { label: 'Twitter',  value: '@serwerhayyan',                    href: 'https://twitter.com/serwerhayyan' },
];

function RotatingCRT() {
  const { scene: rawScene } = useGLTF('/assets/crt_monitor.glb') as any;
  const groupRef = useRef<THREE.Group>(null!);
  const screenTex = useMemo(() => createScreenTexture(), []);

  const scene = useMemo(() => {
    const clone = rawScene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const n = mesh.name.toLowerCase();
      if (n.includes('glass') || n.includes('screen') || n.includes('monitor_glass')) {
        mesh.material = new THREE.MeshStandardMaterial({
          map: screenTex,
          emissiveMap: screenTex,
          emissive: new THREE.Color(0x88bbff),
          emissiveIntensity: 0.5, roughness: 0.1, metalness: 0.0,
        });
      }
    });
    const box    = new THREE.Box3().setFromObject(clone);
    const size   = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    clone.position.sub(centre);
    const s = 3.2 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(s);
    return clone;
  }, [rawScene, screenTex]);

  const initialized = useRef(false);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (!initialized.current) {
      g.rotation.y = Math.PI;
      g.position.y = -2.2;
      initialized.current = true;
    }
    g.rotation.y += delta * 1.2;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/assets/crt_monitor.glb');

export default function MobileHome() {
  return (
    <div style={{ background: '#030303', minHeight: '100vh', fontFamily: '"Share Tech Mono",monospace' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        .mobile-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        @keyframes crt-scan-m {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        .mobile-sweep {
          position: fixed; left: 0; right: 0; height: 100px; pointer-events: none; z-index: 0;
          background: linear-gradient(to bottom, transparent, rgba(100,180,255,0.015), transparent);
          animation: crt-scan-m 6s linear infinite;
        }

        .proj-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 20px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.2s ease;
        }
        .proj-card:hover { border-color: rgba(255,255,255,0.15); }

        .career-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .contact-link-m {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 3px;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, background 0.2s;
        }
        .contact-link-m:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.03);
        }

        .back-top-m {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 3px;
          color: rgba(255,255,255,0.4);
          font-family: inherit;
          font-size: 9px; letter-spacing: 4px;
          padding: 12px 24px;
          cursor: pointer; text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s;
        }
        .back-top-m:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }

        .section-label {
          font-size: 8px; letter-spacing: 6px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .section-title {
          font-family: "Georgia","Times New Roman",serif;
          font-weight: 400; font-style: italic;
          font-size: clamp(1.6rem, 6vw, 2.2rem);
          color: rgba(255,255,255,0.88);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
          line-height: 1.15;
        }
        .section-divider {
          width: 100%; height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
          margin: 0 0 56px;
        }
      `}</style>

      <div className="mobile-sweep" />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', paddingTop: 80 }}>
        <div className="mobile-grid" />

        {/* CRT Canvas */}
        <div style={{ width: '100%', height: '55vw', maxHeight: 340, position: 'relative', marginTop: 20 }}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 42 }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 2]}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 8]} intensity={2.8} />
            <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#8090ff" />
            <pointLight position={[0, 4, 6]} intensity={1.6} />
            <Suspense fallback={null}>
              <RotatingCRT />
            </Suspense>
          </Canvas>
        </div>

        {/* Intro text */}
        <div style={{ padding: '28px 28px 56px', position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 8px', fontSize: 8, letterSpacing: '6px', color: 'rgba(255,255,255,0.2)' }}>
            HAYYAN SERWER
          </p>
          <h1 style={{
            margin: '0 0 16px',
            fontFamily: '"Georgia","Times New Roman",serif',
            fontWeight: 400,
            fontSize: 'clamp(1.8rem,7vw,2.4rem)',
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            Undergraduate<br /><em style={{ fontWeight: 300 }}>Software Student.</em>
          </h1>
          <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 14 }} />
          <p style={{ margin: '0 0 6px', fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
            Based in Aschaffenburg, Germany
          </p>
          <p style={{ margin: '0 0 24px', fontSize: 10, color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
            Currently a Full Stack Developer @ PAYTO Technologies
          </p>

          {/* Categorized stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'LANGUAGES',  items: ['TS', 'JS', 'Python', 'C/C++', 'Java'] },
              { label: 'FRAMEWORKS', items: ['React', 'Nest.js', 'FastAPI', 'Express', 'Tailwind'] },
              { label: 'AI / ML',    items: ['LangChain', 'RAG', 'PyTorch', 'TensorFlow'] },
              { label: 'BACKEND',    items: ['REST', 'WebSockets', 'JWT/OAuth', 'PostgreSQL'] },
              { label: 'CLOUD',      items: ['Firebase', 'Vercel', 'Supabase'] },
            ].map(({ label, items }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <p style={{
                  margin: 0, fontSize: 7, letterSpacing: '3px',
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: '"Share Tech Mono",monospace',
                  flexShrink: 0, width: 70, textAlign: 'right',
                }}>{label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {items.map(t => (
                    <span key={t} style={{
                      fontSize: 10, letterSpacing: '1px',
                      color: i === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.45)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2, padding: '3px 8px',
                      fontFamily: '"Share Tech Mono",monospace',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: '56px 24px', position: 'relative' }}>
        <div className="mobile-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-label">Selected Works</p>
          <h2 className="section-title">Things I've<br />built.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROJECTS.map(p => (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-card"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '1px' }}>
                    {p.name}
                  </p>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>{p.year}</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontFamily: 'system-ui,sans-serif', fontWeight: 300 }}>
                  {p.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {p.tech.map(t => (
                    <span key={t} style={{
                      fontSize: 8, color: 'rgba(255,255,255,0.35)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 2, padding: '2px 7px',
                      letterSpacing: '2px', textTransform: 'uppercase',
                    }}>{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER ── */}
      <section id="career" style={{ padding: '56px 24px', position: 'relative' }}>
        <div className="mobile-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-label">Experience</p>
          <h2 className="section-title">The journey<br />so far.</h2>

          <div>
            {CAREER.map(entry => (
              <div key={entry.id} className="career-row">
                {/* Dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                  background: entry.active ? 'rgba(100,220,100,0.9)' : 'rgba(255,255,255,0.2)',
                  boxShadow: entry.active ? '0 0 8px rgba(100,220,100,0.5)' : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 3px',
                    fontFamily: '"Georgia",serif', fontStyle: 'italic',
                    fontSize: 14, color: 'rgba(255,255,255,0.8)',
                    fontWeight: 400,
                  }}>{entry.role}</p>
                  <p style={{
                    margin: '0 0 4px', fontSize: 9, letterSpacing: '3px',
                    color: entry.active ? 'rgba(100,220,100,0.7)' : 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                  }}>{entry.company}</p>
                  <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>
                    {entry.period} · {entry.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '56px 24px 80px', position: 'relative' }}>
        <div className="mobile-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-label">Get in touch</p>
          <h2 className="section-title">Let's talk.<br /></h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
            {LINKS.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="contact-link-m"
              >
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: 8, letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'system-ui,sans-serif', fontWeight: 300 }}>{value}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>→</span>
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="back-top-m" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to top
            </button>
            <p style={{ marginTop: 32, fontSize: 8, letterSpacing: '4px', color: 'rgba(255,255,255,0.1)' }}>
              HAYYAN SERWER · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}