import { useEffect, useState } from 'react';

// Bot 561 lives on the dev instance, not the bot.clye.app default the widget
// falls back to — so both the script and the `domain` attribute must point here.
const WIDGET_DOMAIN = 'https://dev.clye.ai';
const WIDGET_SRC = `${WIDGET_DOMAIN}/widget.js`;
const BOT_ID = '561';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'clye-bot-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'bot-id'?: string;
        side?: string;
        domain?: string;
      };
    }
  }
}

const EMPTY = { name: '', email: '', message: '' };

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontSize: 10,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.4)',
  fontFamily: '"Share Tech Mono",monospace',
};

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 2,
  padding: '10px 12px',
  color: 'rgba(255,255,255,0.85)',
  fontSize: 13,
  fontFamily: 'system-ui, sans-serif',
  outline: 'none',
};

export default function WidgetTest() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState<typeof EMPTY | null>(null);

  useEffect(() => {
    // The custom element stays registered once defined, so never inject twice.
    if (customElements.get('clye-bot-chat')) return;
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = WIDGET_SRC;
    document.head.appendChild(script);
  }, []);

  const update = (key: keyof typeof EMPTY) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm(f => ({ ...f, [key]: e.target.value }));

  // Local only — nothing is sent anywhere.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(form);
  };

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      padding: '80px 24px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>

        {/* Test-page indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid rgba(255,190,80,0.25)',
          background: 'rgba(255,190,80,0.06)',
          borderRadius: 2,
          padding: '10px 14px',
          marginBottom: 32,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(255,190,80,0.9)',
            boxShadow: '0 0 8px rgba(255,190,80,0.5)',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase',
            color: 'rgba(255,190,80,0.85)',
            fontFamily: '"Share Tech Mono",monospace',
          }}>
            Widget form test``
          </span>
        </div>

        <h1 style={{
          margin: '0 0 8px',
          fontSize: 22,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.9)',
        }}>Test form</h1>

        <p style={{
          margin: '0 0 28px',
          fontSize: 12, lineHeight: 1.7, fontWeight: 300,
          color: 'rgba(255,255,255,0.4)',
        }}>
          Submitting does not send anything — it echoes the values back below, so you can
          exercise the form and the chat widget side by side.
        </p>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="wt-name" style={labelStyle}>Name</label>
            <input
              id="wt-name" style={fieldStyle} value={form.name}
              onChange={update('name')} required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label htmlFor="wt-email" style={labelStyle}>Email</label>
            <input
              id="wt-email" type="email" style={fieldStyle} value={form.email}
              onChange={update('email')} required
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label htmlFor="wt-message" style={labelStyle}>Message</label>
            <textarea
              id="wt-message" rows={4} value={form.message}
              onChange={update('message')} required
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{
              background: 'rgba(255,255,255,0.9)',
              border: 'none', borderRadius: 2,
              padding: '9px 20px',
              color: '#000',
              fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
              fontFamily: '"Share Tech Mono",monospace',
              cursor: 'pointer',
            }}>Submit</button>

            <button
              type="button"
              onClick={() => { setForm(EMPTY); setSubmitted(null); }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2,
                padding: '9px 20px',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
                fontFamily: '"Share Tech Mono",monospace',
                cursor: 'pointer',
              }}
            >Reset</button>
          </div>
        </form>

        {submitted && (
          <pre style={{
            marginTop: 26,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            padding: '12px 14px',
            fontSize: 11,
            lineHeight: 1.7,
            color: 'rgba(140,220,140,0.85)',
            fontFamily: '"Share Tech Mono",monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </div>

      <clye-bot-chat bot-id={BOT_ID} domain={WIDGET_DOMAIN} />
    </div>
  );
}
