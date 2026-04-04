import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  return isMobile;
}

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const isMobile   = useIsMobile();
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  const linkClass = "text-[9px] tracking-[4px] uppercase transition-all duration-300 relative group text-white/20 hover:text-white/50 bg-transparent border-0 cursor-pointer p-0";

  return (
    <>
      <nav
        style={{ fontFamily: '"Share Tech Mono", "Courier New", monospace' }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 md:py-6 pointer-events-none"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.04]" />

        {/* Branding */}
        <div className="pointer-events-auto flex flex-col gap-1">
          <span className="text-[10px] md:text-[11px] tracking-[5px] text-white/70 uppercase">Hayyan Serwer</span>
          <span className="text-[7px] md:text-[8px] tracking-[6px] text-white/20 uppercase">Portfolio · 2026</span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div className="flex gap-10 pointer-events-auto">
            <NavLink to="/" end className={({ isActive }) =>
              `text-[9px] tracking-[4px] uppercase no-underline transition-all duration-300 relative group ${isActive ? 'text-white/80' : 'text-white/20 hover:text-white/50'}`
            }>
              {({ isActive }) => (<>Home<span className={`absolute -bottom-1.5 left-0 h-px bg-white/40 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} /></>)}
            </NavLink>
            <button onClick={() => scrollTo('projects')} className={linkClass}>
              Projects<span className="absolute -bottom-1.5 left-0 h-px bg-white/40 transition-all duration-300 w-0 group-hover:w-full" />
            </button>
            <button onClick={() => scrollTo('career')} className={linkClass}>
              Career<span className="absolute -bottom-1.5 left-0 h-px bg-white/40 transition-all duration-300 w-0 group-hover:w-full" />
            </button>
            <button onClick={() => scrollTo('contact')} className={linkClass}>
              Contact<span className="absolute -bottom-1.5 left-0 h-px bg-white/40 transition-all duration-300 w-0 group-hover:w-full" />
            </button>
          </div>
        )}

        {/* Desktop availability */}
        {!isMobile && (
          <div className="flex items-center gap-2 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
            <span className="text-[8px] tracking-[4px] text-white/15 uppercase">Available</span>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            className="pointer-events-auto bg-transparent border-0 cursor-pointer p-0 flex flex-col gap-1.5"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            <span style={{
              display: 'block', width: 22, height: 1,
              background: 'rgba(255,255,255,0.5)',
              transition: 'transform 0.2s, opacity 0.2s',
              transform: open ? 'translateY(5px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 22, height: 1,
              background: 'rgba(255,255,255,0.5)',
              opacity: open ? 0 : 1,
              transition: 'opacity 0.2s',
            }} />
            <span style={{
              display: 'block', width: 22, height: 1,
              background: 'rgba(255,255,255,0.5)',
              transition: 'transform 0.2s, opacity 0.2s',
              transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
            }} />
          </button>
        )}
      </nav>

      {/* Mobile dropdown */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 49,
          background: '#030303',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: open ? '80px 28px 28px' : '0 28px 0',
          maxHeight: open ? 320 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, padding 0.35s ease',
          fontFamily: '"Share Tech Mono",monospace',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { label: 'Home',     action: () => { setOpen(false); navigate('/'); } },
              { label: 'Projects', action: () => scrollTo('projects') },
              { label: 'Career',   action: () => scrollTo('career')   },
              { label: 'Contact',  action: () => scrollTo('contact')  },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  background: 'transparent', border: 0, cursor: 'pointer',
                  textAlign: 'left', padding: 0,
                  fontSize: 11, letterSpacing: '5px',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  fontFamily: 'inherit',
                }}
              >
                {label}
              </button>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(100,220,100,0.8)' }} />
              <span style={{ fontSize: 8, letterSpacing: '4px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Available for work</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}