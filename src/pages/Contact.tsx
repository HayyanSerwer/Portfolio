const LINKS = [
  {
    label: 'Email',
    value: 'hayyan.serwer@gmail.com',
    href:  'mailto:hayyan.serwer@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/HayyanSerwer',
    href:  'https://github.com/HayyanSerwer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/hayyan-serwer',
    href:  'https://www.linkedin.com/in/hayyan-serwer-618277274/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    value: '@serwerhayyan',
    href:  'https://twitter.com/serwerhayyan',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Contact() {
  return (
    <div style={{
      width: '100vw',
      background: '#030303',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .contact-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 24px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 3px;
          text-decoration: none;
          color: inherit;
          background: transparent;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .contact-link:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.03);
          transform: translateX(6px);
        }
        .back-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 3px;
          color: rgba(255,255,255,0.4);
          font-family: '"Share Tech Mono",monospace';
          font-size: 10px;
          letter-spacing: 4px;
          padding: 12px 28px;
          cursor: pointer;
          transition: border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
          text-transform: uppercase;
        }
        .back-top-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.8);
          transform: translateY(-3px);
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

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Top divider */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 640,
        margin: '0 auto',
        padding: '120px 40px 100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>

        {/* Header */}
        <p style={{
          margin: '0 0 16px',
          fontSize: 9, letterSpacing: '6px',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: '"Share Tech Mono",monospace',
          textTransform: 'uppercase',
        }}>Get in touch</p>

        <h2 style={{
          margin: '0 0 20px',
          fontFamily: '"Georgia","Times New Roman",serif',
          fontWeight: 400,
          fontSize: 'clamp(2rem,5vw,3.2rem)',
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
  
          <em style={{ fontWeight: 300 }}>Contact me.</em>
        </h2>

        <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 20 }} />

        <p style={{
          margin: '0 0 64px',
          fontSize: 13,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          lineHeight: 1.8,
          maxWidth: 420,
        }}>
          Whether it's a project, an opportunity, or just to say hello -
          reach out through any of the channels below.
        </p>

        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 80,
        }}>
          {LINKS.map(({ label, value, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="contact-link"
            >
              {/* Icon */}
              <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                {icon}
              </span>

              {/* Label + value */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{
                  margin: '0 0 3px',
                  fontSize: 9, letterSpacing: '4px',
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: '"Share Tech Mono",monospace',
                  textTransform: 'uppercase',
                }}>{label}</p>
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                }}>{value}</p>
              </div>

              {/* Arrow */}
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>→</span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: '100%', height: 1, marginBottom: 48,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
        }} />

        {/* Back to top */}
        <button className="back-top-btn" onClick={scrollToTop}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to top
        </button>

        {/* Footer note */}
        <p style={{
          marginTop: 48, marginBottom: 0,
          fontSize: 9, letterSpacing: '4px',
          color: 'rgba(255,255,255,0.1)',
          fontFamily: '"Share Tech Mono",monospace',
        }}>
          HAYYAN SERWER · {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}