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
      <div style={{ position: 'absolute', top: 56, left: 28 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M0 22 L0 0 L22 0" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"/>
        </svg>
        <p style={{ margin: '4px 0 0', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.16)' }}>
          CRT-9000 // ACTIVE
        </p>
      </div>

      <div style={{ position: 'absolute', top: 56, right: 28, textAlign: 'right' }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M44 22 L44 0 L22 0" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"/>
        </svg>
        <p style={{ margin: '4px 0 0', fontSize: 9, letterSpacing: '4px', color: 'rgba(255,255,255,0.16)' }}>
          INPUT ── VGA
        </p>
      </div>

      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 3, padding: '10px 24px',
          background: 'rgba(255,255,255,0.04)',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
            <circle cx="8" cy="8" r="2.5" fill="rgba(255,255,255,0.6)"/>
          </svg>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: '4px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
            CLICK SCREEN TO EXPLORE
          </p>
        </div>
      </div>
    </div>
  );
}