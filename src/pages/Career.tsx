import { useEffect, useRef } from 'react';

const CAREER = [
  {
    id: 0,
    role: 'Fullstack Developer',
    company: 'PAYTO Technologies',
    period: '2026 — Present',
    type: 'Full-time',
    desc: 'Building and maintaining full-stack features for a fintech platform. Working across the React frontend and Firebase backend, shipping production-grade code in a fast-moving startup environment.',
    tags: ['React', 'TypeScript', 'Firebase'],
    active: true,
  },
  {
    id: 1,
    role: 'Programming Research Assistant',
    company: 'TH Aschaffenburg',
    period: '2025 — Present',
    type: 'Part-time',
    desc: 'Assisted in academic research involving NLP and data processing pipelines. Wrote automation scripts and helped process large datasets for research publications.',
    tags: ['Python', 'NumPy', 'NLTK', 'Selenium'],
    active: true,
  },
  {
    id: 3,
    role: 'Technical Writer',
    company: 'Tech4Gamers',
    period: '2022 — 2023',
    type: 'Freelance',
    desc: 'Wrote in-depth technical articles, hardware reviews, and guides for a gaming-focused tech publication. Covered topics ranging from PC hardware to software optimization.',
    tags: ['Technical Writing', 'Research', 'Publishing'],
    active: false,
  },
  {
    id: 4,
    role: 'Freelance Game Developer',
    company: 'Self-employed',
    period: '2021 — 2022',
    type: 'Freelance',
    desc: 'Designed and developed small indie games independently. Handled all aspects of production including game design, programming, and asset creation.',
    tags: ['Game Design', 'Programming', 'Asset Creation'],
    active: false,
  },
];

function TimelineEntry({ entry, index }: { entry: typeof CAREER[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity    = '1';
          el.style.transform  = 'translateY(0)';
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 48px 1fr',
        gap: 0,
        marginBottom: 64,
        opacity: 0,
        transform: 'translateY(32px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        transitionDelay: `${index * 0.08}s`,
      }}
    >
      {/* Left content */}
      <div style={{
        padding: '0 40px 0 0',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      }}>
        {isLeft ? (
          <EntryCard entry={entry} align="right" />
        ) : (
          <PeriodLabel entry={entry} align="right" />
        )}
      </div>

      {/* Centre line + dot */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 12, height: 12,
          borderRadius: '50%',
          background: entry.active ? 'rgba(100,220,100,0.9)' : 'rgba(255,255,255,0.2)',
          border: entry.active ? '2px solid rgba(100,220,100,0.4)' : '2px solid rgba(255,255,255,0.08)',
          boxShadow: entry.active ? '0 0 12px rgba(100,220,100,0.5)' : 'none',
          flexShrink: 0,
          marginTop: 6,
          zIndex: 1,
        }} />
      </div>

      {/* Right content */}
      <div style={{
        padding: '0 0 0 40px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
        {isLeft ? (
          <PeriodLabel entry={entry} align="left" />
        ) : (
          <EntryCard entry={entry} align="left" />
        )}
      </div>
    </div>
  );
}

function PeriodLabel({ entry, align }: { entry: typeof CAREER[0]; align: 'left' | 'right' }) {
  return (
    <div style={{ textAlign: align, paddingTop: 2 }}>
      <p style={{
        margin: 0,
        fontSize: 10, letterSpacing: '4px',
        color: 'rgba(255,255,255,0.2)',
        fontFamily: '"Share Tech Mono",monospace',
      }}>{entry.period}</p>
      <p style={{
        margin: '6px 0 0',
        fontSize: 9, letterSpacing: '3px',
        color: 'rgba(255,255,255,0.12)',
        fontFamily: '"Share Tech Mono",monospace',
        textTransform: 'uppercase',
      }}>{entry.type}</p>
    </div>
  );
}

function EntryCard({ entry, align }: { entry: typeof CAREER[0]; align: 'left' | 'right' }) {
  return (
    <div style={{
      maxWidth: 400,
      textAlign: align,
    }}>
      {/* Role */}
      <h3 style={{
        margin: '0 0 4px',
        fontFamily: '"Georgia","Times New Roman",serif',
        fontWeight: 400,
        fontStyle: 'italic',
        fontSize: 'clamp(1.1rem,2vw,1.4rem)',
        color: 'rgba(255,255,255,0.88)',
        letterSpacing: '-0.01em',
        lineHeight: 1.2,
      }}>{entry.role}</h3>

      {/* Company */}
      <p style={{
        margin: '0 0 14px',
        fontSize: 10, letterSpacing: '4px',
        color: entry.active ? 'rgba(100,220,100,0.7)' : 'rgba(255,255,255,0.3)',
        fontFamily: '"Share Tech Mono",monospace',
        textTransform: 'uppercase',
      }}>{entry.company}</p>

      {/* Divider */}
      <div style={{
        width: 28, height: 1,
        background: 'rgba(255,255,255,0.1)',
        marginBottom: 14,
        marginLeft: align === 'right' ? 'auto' : 0,
      }} />

      {/* Description */}
      <p style={{
        margin: '0 0 16px',
        fontSize: 12,
        color: 'rgba(255,255,255,0.45)',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1.8,
        fontWeight: 300,
      }}>{entry.desc}</p>

      {/* Tags */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      }}>
        {entry.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 9, letterSpacing: '2px',
            color: 'rgba(255,255,255,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 2,
            padding: '3px 8px',
            fontFamily: '"Share Tech Mono",monospace',
            textTransform: 'uppercase',
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function Career() {
  const lineRef = useRef<HTMLDivElement>(null);

  // Animate the timeline line growing as you scroll
  useEffect(() => {
    const onScroll = () => {
      const el = lineRef.current;
      if (!el) return;
      const rect   = el.getBoundingClientRect();
      const visible = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
      el.style.setProperty('--line-progress', `${visible * 100}%`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      width: '100vw',
      background: '#030303',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      `}</style>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1000,
        margin: '0 auto',
        padding: '120px 40px 120px',
      }}>

        {/* Section header */}
        <div style={{ marginBottom: 96, textAlign: 'center' }}>
          <p style={{
            margin: '0 0 12px',
            fontSize: 9, letterSpacing: '6px',
            color: 'rgba(255,255,255,0.2)',
            fontFamily: '"Share Tech Mono",monospace',
            textTransform: 'uppercase',
          }}>Experience & Education</p>
          <h2 style={{
            margin: 0,
            fontFamily: '"Georgia","Times New Roman",serif',
            fontWeight: 400,
            fontSize: 'clamp(2rem,5vw,3.5rem)',
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            The journey<br />
            <em style={{ fontWeight: 300 }}>so far.</em>
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>

          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0, bottom: 0,
            width: 1,
            background: 'rgba(255,255,255,0.06)',
            transform: 'translateX(-50%)',
          }}>
            {/* Animated progress line */}
            <div
              ref={lineRef}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 'var(--line-progress, 0%)',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.06))',
                transition: 'height 0.1s linear',
              } as React.CSSProperties}
            />
          </div>

          {/* Entries */}
          {CAREER.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} />
          ))}

        </div>

        {/* Bottom cap */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <p style={{
              margin: 0, fontSize: 9,
              letterSpacing: '4px',
              color: 'rgba(255,255,255,0.15)',
              fontFamily: '"Share Tech Mono",monospace',
            }}>MORE TO COME</p>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>

      </div>
    </div>
  );
}