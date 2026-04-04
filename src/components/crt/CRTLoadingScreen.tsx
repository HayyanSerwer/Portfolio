import { useEffect, useState } from 'react';

interface CRTLoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'BIOS v2.6.1 · Skratada Display Systems',          delay: 0    },
  { text: 'CPU: Ryzen 9 9950X3D · 93123 MHz · OK',                  delay: 180  },
  { text: 'Memory Test: 64823 TB · OK',                         delay: 360  },
  { text: 'Initializing video adapter · VGA · OK',            delay: 540  },
  { text: '──────────────────────────────────────────',       delay: 700  },
  { text: 'Loading hayyan.portfolio v1.0.0...',               delay: 860  },
  { text: 'Mounting filesystem · /home/hayyan · OK',          delay: 1050 },
  { text: 'Loading modules: wasd· wasdwasd · wasd',      delay: 1240 },
  { text: 'Checking dependencies · node_modules · OK',        delay: 1430 },
  { text: 'Starting dev server · localhost:5173 · OK',        delay: 1620 },
  { text: '──────────────────────────────────────────',       delay: 1800 },
  { text: 'Welcome, visitor. Type "help" to get started.',    delay: 1980 },
  { text: '',                                                  delay: 2100 },
  { text: 'hayyan@portfolio:~$ ./launch_portfolio.sh',        delay: 2200 },
];

const TOTAL_DURATION = 3200;

export default function CRTLoadingScreen({ onComplete }: CRTLoadingScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress,     setProgress]     = useState(0);
  const [exiting,      setExiting]      = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / TOTAL_DURATION);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 500);
        }, 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const pct = Math.round(progress * 100);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#080e08',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: exiting ? 0 : 1,
      transition: exiting ? 'opacity 0.5s ease' : 'none',
      // keep background solid during exit so nothing flashes through
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.82} 94%{opacity:1} 97%{opacity:0.91} 98%{opacity:1}
        }
        .crt-cursor { display:inline-block; width:9px; height:14px; background:#33ff66; vertical-align:text-bottom; animation:blink 1s step-end infinite; }
        .crt-scanline {
          position:absolute; left:0; right:0; height:120px; pointer-events:none;
          background:linear-gradient(to bottom,transparent,rgba(51,255,102,0.03),transparent);
          animation:scanline 5s linear infinite;
        }
        .crt-flicker { animation:flicker 7s ease-in-out infinite; }
        .crt-vignette {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%);
        }
        .crt-scanlines {
          position:absolute; inset:0; pointer-events:none;
          background:repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px);
        }
      `}</style>

      <div className="crt-scanline" />
      <div className="crt-scanlines" />
      <div className="crt-vignette" />

      <div className="crt-flicker" style={{
        width: 'min(680px, 90vw)',
        border: '1px solid #1a8c3a',
        borderRadius: 3,
        boxShadow: '0 0 40px rgba(51,255,102,0.1), inset 0 0 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        fontFamily: '"Share Tech Mono", "Courier New", monospace',
        position: 'relative', zIndex: 1,
      }}>

        <div style={{
          background: 'rgba(0,20,6,0.98)', borderBottom: '1px solid #1a8c3a',
          padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, color: '#33ff66', fontWeight: 'bold', letterSpacing: 1 }}>
            HERITAGE CRT-9000 · BOOT SEQUENCE
          </span>
          <span style={{ fontSize: 10, color: '#1a8c3a' }}>SYS/{new Date().getFullYear()}</span>
        </div>

        <div style={{ background: '#080e08', padding: '16px 18px 12px', minHeight: 280 }}>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} style={{
              fontSize: 12, lineHeight: 1.8, letterSpacing: 0.3,
              color: line.text.startsWith('──') ? '#1a8c3a'
                   : line.text.startsWith('Welcome') ? 'rgba(220,255,230,0.7)'
                   : line.text.includes('OK') ? '#33ff66'
                   : line.text.includes('hayyan@') ? '#ffb830'
                   : 'rgba(180,240,180,0.75)',
            }}>
              {line.text || '\u00A0'}
            </div>
          ))}
          {visibleLines >= BOOT_LINES.length && (
            <div style={{ fontSize: 12, lineHeight: 1.8 }}>
              <span style={{ color: '#1a8c3a' }}>hayyan@portfolio:~$</span>
              {' '}<span className="crt-cursor" />
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(0,15,4,0.98)', borderTop: '1px solid #1a8c3a',
          padding: '10px 18px 12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: '#1a8c3a', letterSpacing: 2 }}>LOADING PORTFOLIO</span>
            <span style={{ fontSize: 10, color: '#33ff66', letterSpacing: 2 }}>{pct}%</span>
          </div>
          <div style={{
            height: 6, background: 'rgba(51,255,102,0.08)',
            border: '1px solid #1a8c3a', borderRadius: 1, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'repeating-linear-gradient(90deg, #33ff66 0px, #33ff66 8px, #1a8c3a 8px, #1a8c3a 10px)',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 8px rgba(51,255,102,0.6)',
            }} />
          </div>
          <div style={{ marginTop: 6, fontSize: 9, color: '#1a8c3a', letterSpacing: 3, textAlign: 'right' }}>
            {pct < 30  ? 'INITIALIZING...'
           : pct < 60  ? 'LOADING MODULES...'
           : pct < 85  ? 'MOUNTING FILESYSTEM...'
           : pct < 100 ? 'ALMOST READY...'
           : 'COMPLETE'}
          </div>
        </div>
      </div>
    </div>
  );
}