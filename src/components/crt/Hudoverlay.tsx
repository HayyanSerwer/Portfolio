interface HUDOverlayProps {
  visible: boolean;
}

export default function HUDOverlay({ visible }: HUDOverlayProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
      fontFamily: '"Share Tech Mono","Courier New",monospace',
    }}>
      <style>{`
        @keyframes hud-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15), 0 0 18px rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.35); }
          50%       { box-shadow: 0 0 0 6px rgba(255,255,255,0.04), 0 0 32px rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.65); }
        }
        @keyframes hud-dot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes hud-caret {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1;   }
        }
      `}</style>

      {/* Top-left bracket */}
      <div style={{ position: 'absolute', top: 56, left: 28 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M0 22 L0 0 L22 0" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"/>
        </svg>
        <p style={{ margin: '4px 0 0', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.16)' }}>
          CRT-9000 // ACTIVE
        </p>
      </div>

      {/* Top-right bracket */}
      <div style={{ position: 'absolute', top: 56, right: 28, textAlign: 'right' }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M44 22 L44 0 L22 0" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"/>
        </svg>
        <p style={{ margin: '4px 0 0', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.16)' }}>
          INPUT ── VGA
        </p>
      </div>

      {/* Click prompt */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)', textAlign: 'center',
      }}>
        {/* Subtle label above */}
        <p style={{
          margin: '0 0 10px',
          fontSize: 8, letterSpacing: '5px',
          color: 'rgba(255,255,255,0.25)',
          animation: 'hud-caret 2s ease-in-out infinite',
        }}>
          ▲ INTERACTIVE
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 3, padding: '13px 28px',
          background: 'rgba(255,255,255,0.05)',
          animation: 'hud-pulse 2s ease-in-out infinite',
        }}>
          {/* Crosshair / target icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
            <circle cx="9" cy="9" r="2.8" fill="rgba(255,255,255,0.7)"
              style={{ animation: 'hud-dot 2s ease-in-out infinite' }}
            />
            <line x1="9" y1="1" x2="9" y2="4.5"   stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <line x1="9" y1="13.5" x2="9" y2="17" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <line x1="1"   y1="9" x2="4.5" y2="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            <line x1="13.5" y1="9" x2="17" y2="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
          </svg>

          <p style={{
            margin: 0, fontSize: 14, letterSpacing: '5px',
            color: 'rgba(255,255,255,0.85)',
            whiteSpace: 'nowrap',
          }}>
            CLICK SCREEN TO EXPLORE
          </p>
        </div>
      </div>
    </div>
  );
}