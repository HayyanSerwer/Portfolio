import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import CRTMonitor       from './CRTMonitor';
import SceneLighting    from './Screenlighting';
import HUDOverlay       from './Hudoverlay';
import ZoomedScreen     from './Zoomedscreen';
import CRTLoadingScreen from './CRTLoadingScreen';

export default function CRTHeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shiftProgress,  setShiftProgress]  = useState(0);
  const [zoomed,         setZoomed]         = useState(false);
  const [zoomedVisible,  setZoomedVisible]  = useState(false);
  const [loaded,         setLoaded]         = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect     = el.getBoundingClientRect();
      const totalH   = el.offsetHeight;
      const scrolled = -rect.top;
      const vh       = window.innerHeight;

      const phase1End = totalH * 0.6;
      const p1 = Math.max(0, Math.min(1, scrolled / (phase1End - vh)));
      setScrollProgress(p1);

      const phase2Start = phase1End - vh;
      const phase2Len   = totalH * 0.4;
      const p2 = Math.max(0, Math.min(1, (scrolled - phase2Start) / phase2Len));
      setShiftProgress(p2);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScreenClick = useCallback(() => {
    if (scrollProgress < 0.88) return;
    if (shiftProgress > 0.1) return;
    setZoomed(true);
    requestAnimationFrame(() => setZoomedVisible(true));
  }, [scrollProgress, shiftProgress]);

  const handleClose = useCallback(() => {
    setZoomedVisible(false);
    setTimeout(() => setZoomed(false), 500);
  }, []);

  const navLinks = [
    { label: 'Projects', id: 'projects' },
    { label: 'Career',   id: 'career'   },
    { label: 'Contact',  id: 'contact'  },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes crt-scan {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        .crt-sweep-inner {
          position: absolute; left: 0; right: 0; height: 140px;
          background: linear-gradient(to bottom, transparent, rgba(100,180,255,0.025), transparent);
          animation: crt-scan 6s linear infinite;
          pointer-events: none;
        }
        .nav-link-btn {
          display: block;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          font-family: 'Georgia', serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.02em;
          padding: 10px 24px;
          border-radius: 2px;
          cursor: pointer;
          text-align: left;
          width: 180px;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .nav-link-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.35);
          color: rgba(255,255,255,0.95);
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0);   opacity: 0.85; }
          50%       { transform: translateY(6px); opacity: 0.3;  }
        }
        @keyframes scroll-text-pulse {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 1;   }
        }

        /* Screen highlight animations */
        @keyframes screen-ring-pulse {
          0%, 100% {
            box-shadow:
              0 0 0 2px rgba(160,210,255,0.5),
              0 0 24px 6px rgba(120,180,255,0.2),
              0 0 60px 12px rgba(100,160,255,0.08);
          }
          50% {
            box-shadow:
              0 0 0 2px rgba(160,210,255,0.9),
              0 0 32px 10px rgba(120,180,255,0.35),
              0 0 80px 20px rgba(100,160,255,0.15);
          }
        }
        @keyframes screen-corner-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1.0; }
        }
      `}</style>

      {!loaded && <CRTLoadingScreen onComplete={() => setLoaded(true)} />}

      <div
        ref={sectionRef}
        style={{ height: '500vh', position: 'relative', background: '#000' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#030303', overflow: 'hidden' }}>

          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }} />

          <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
            <div className="crt-sweep-inner" />
          </div>

          {/* Top HUD bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 38, zIndex: 10,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 28px', pointerEvents: 'none',
            fontFamily: '"Share Tech Mono",monospace',
          }}>
            <span style={{ fontSize: 9, letterSpacing: '5px', color: 'rgba(255,255,255,0.14)' }}>
              HERITAGE · DISPLAY · CRT-9000
            </span>
            <span style={{ fontSize: 9, letterSpacing: '3px', color: 'rgba(255,255,255,0.07)' }}>
              SYS/BOOT · {new Date().getFullYear()}
            </span>
          </div>

          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 42 }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: 'transparent', width: '100%', height: '100%' }}
            >
              <SceneLighting />
              <React.Suspense fallback={null}>
                <CRTMonitor
                  scrollProgress={scrollProgress}
                  onScreenClick={handleScreenClick}
                  zoomed={zoomed}
                  xOffset={shiftProgress}
                  orbitEnabled={shiftProgress > 0.1}
                />
              </React.Suspense>
            </Canvas>
          </div>

          <HUDOverlay visible={scrollProgress > 0.85 && shiftProgress < 0.1} />

          <div style={{
            position: 'absolute', top: '50%', left: '5%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none', zIndex: 10,
            opacity: shiftProgress < 0.2 ? 1 : 0,
            transition: 'opacity 0.4s ease',
            maxWidth: 240,
          }}>
            <p style={{ margin: '0 0 10px', fontSize: 9, letterSpacing: '5px', color: 'rgba(255,255,255,0.25)', fontFamily: '"Share Tech Mono",monospace' }}>
              HAYYAN SERWER
            </p>
            <h2 style={{
              margin: '0 0 18px', fontWeight: 400,
              fontSize: 'clamp(1.6rem,3vw,2.4rem)',
              color: 'rgba(255,255,255,0.88)',
              fontFamily: '"Georgia","Times New Roman",serif',
              lineHeight: 1.2, letterSpacing: '-0.02em',
            }}>
              Undergraduate<br /><em style={{ fontWeight: 300 }}>Software Student.</em>
            </h2>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 14 }} />
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: '"Share Tech Mono",monospace', lineHeight: 1.7 }}>
              Based in Aschaffenburg,<br />Germany
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: '"Share Tech Mono",monospace', lineHeight: 1.7 }}>
              Currently a Full Stack Developer<br />@ PAYTO Technologies
            </p>
          </div>

          <div style={{
            position: 'absolute', top: '50%', right: 0,
            transform: 'translateY(-50%)',
            pointerEvents: 'none', zIndex: 10,
            opacity: shiftProgress < 0.2 ? 1 : 0,
            transition: 'opacity 0.4s ease',
            width: '35%', textAlign: 'right',
            paddingRight: '3%',
          }}>
            <p style={{ margin: '0 0 16px', fontSize: 10, letterSpacing: '5px', color: 'rgba(255,255,255,0.4)', fontFamily: '"Share Tech Mono",monospace' }}>
              STACK
            </p>

            {[
              { label: 'LANGUAGES',  items: 'TypeScript · JavaScript · Python · C/C++ · Java' },
              { label: 'FRAMEWORKS', items: 'React · Nest.js · FastAPI · Node.js · Express · Tailwind' },
              { label: 'AI / ML',    items: 'LangChain · RAG · LangGraph · PyTorch · TensorFlow' },
              { label: 'BACKEND',    items: 'REST APIs · WebSockets · JWT/OAuth · PostgreSQL' },
              { label: 'CLOUD',      items: 'Firebase · Vercel · Supabase' },
            ].map(({ label, items }, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <p style={{
                  margin: '0 0 4px', fontSize: 9, letterSpacing: '4px',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: '"Share Tech Mono",monospace',
                }}>
                  {label}
                </p>
                <p style={{
                  margin: 0, fontSize: 'clamp(11px, 1.4vw, 16px)',
                  color: i === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
                  fontFamily: '"Share Tech Mono",monospace',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}>
                  {items}
                </p>
              </div>
            ))}

            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)', margin: '16px 0 16px auto' }} />
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: '"Share Tech Mono",monospace' }}>
              Available for work · <span style={{ color: 'rgba(100,220,100,0.7)' }}>●</span>
            </p>
          </div>

          <div style={{
            position: 'absolute', top: '50%', left: '7%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            opacity: shiftProgress > 0.3 ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: shiftProgress > 0.3 ? 'auto' : 'none',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 9, letterSpacing: '5px', color: 'rgba(255,255,255,0.2)', fontFamily: '"Share Tech Mono",monospace' }}>
              MORE ABOUT ME
            </p>
            <h2 style={{
              margin: '0 0 28px', fontWeight: 400,
              fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
              color: 'rgba(255,255,255,0.88)',
              fontFamily: '"Georgia","Times New Roman",serif',
              lineHeight: 1.15, letterSpacing: '-0.02em',
            }}>
              Explore the<br /><em style={{ fontWeight: 300 }}>rest.</em>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {navLinks.map(({ label, id }) => (
                <button key={id} className="nav-link-btn" onClick={() => scrollTo(id)}>
                  {label} →
                </button>
              ))}
            </div>
            <div style={{ marginTop: 28, width: 32, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2C3 2 2 4 2 7C2 10 3 12 3 12M5 1C5 1 3.5 3.5 3.5 7C3.5 10.5 5 13 5 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M8 3L11 7L8 11M11 7H5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: '3px', color: 'rgba(255,255,255,0.45)', fontFamily: '"Share Tech Mono",monospace' }}>
                DRAG TO ROTATE
              </p>
            </div>
          </div>

          <div style={{
            position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none',
            opacity: shiftProgress > 0.3 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <line x1="62%" y1="35%" x2="72%" y2="28%" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <line x1="72%" y1="28%" x2="92%" y2="28%" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <line x1="62%" y1="50%" x2="72%" y2="50%" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <line x1="72%" y1="50%" x2="92%" y2="50%" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <line x1="62%" y1="65%" x2="72%" y2="68%" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <line x1="72%" y1="68%" x2="92%" y2="68%" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <circle cx="92%" cy="28%" r="2" fill="rgba(255,255,255,0.25)"/>
              <circle cx="92%" cy="50%" r="2" fill="rgba(255,255,255,0.25)"/>
              <circle cx="92%" cy="68%" r="2" fill="rgba(255,255,255,0.25)"/>
            </svg>

            <div style={{ position: 'absolute', top: 'calc(28% - 28px)', right: '6%', textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', fontFamily: '"Share Tech Mono",monospace' }}>CURRENT ROLE</p>
              <p style={{ margin: '0 0 2px', fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: '"Georgia",serif', fontStyle: 'italic' }}>Research Assistant @ TH Aschaffenburg</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: '"Georgia",serif', fontStyle: 'italic' }}>Full Stack Developer @ PAYTO</p>
            </div>

            <div style={{ position: 'absolute', top: 'calc(50% - 38px)', right: '6%', textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', fontFamily: '"Share Tech Mono",monospace' }}>QUICK STATS</p>
              <p style={{ margin: '0 0 2px', fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: '"Georgia",serif', fontStyle: 'italic' }}>Fourth Semester Student</p>
              <p style={{ margin: '0 0 2px', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: '"Georgia",serif', fontStyle: 'italic' }}>3 Personal Projects in Development</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: '"Georgia",serif', fontStyle: 'italic' }}>2 Active Roles</p>
            </div>

            <div style={{ position: 'absolute', top: 'calc(68% - 22px)', right: '6%', textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', fontFamily: '"Share Tech Mono",monospace' }}>LOCATION</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: '"Georgia",serif', fontStyle: 'italic' }}>Frankfurt/Rhine-Main Metropolitan Region</p>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: '6%', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            opacity: scrollProgress < 0.25 ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none', zIndex: 10,
          }}>
            <p style={{
              margin: 0, fontSize: 11, letterSpacing: '6px',
              color: 'rgba(255,255,255,0.65)',
              fontFamily: '"Share Tech Mono",monospace',
              whiteSpace: 'nowrap',
              animation: 'scroll-text-pulse 2.5s ease-in-out infinite',
              textShadow: '0 0 24px rgba(255,255,255,0.18)',
            }}>
              SCROLL DOWN TO REVEAL
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  width="20" height="11"
                  viewBox="0 0 20 11"
                  fill="none"
                  style={{
                    animation: `scroll-bounce 1.5s ease-in-out ${i * 0.2}s infinite`,
                  }}
                >
                  <path
                    d="M1 1L10 10L19 1"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
          </div>

        </div>
      </div>

      <ZoomedScreen visible={zoomedVisible} onClose={handleClose} />
    </>
  );
}