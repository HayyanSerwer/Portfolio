import React, { useState, useEffect, useCallback } from 'react';
import FileWindow from './Filewindow';
import { EXPLORER_ICONS, DESKTOP_ICONS } from './FileContent';

interface OpenWindow {
  id:      number;
  fileKey: string;
  pos:     { x: number; y: number };
}

let winId = 0;

interface ZoomedScreenProps {
  visible:  boolean;
  onClose:  () => void;
}

export default function ZoomedScreen({ visible, onClose }: ZoomedScreenProps) {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [focusOrder,  setFocusOrder]  = useState<number[]>([]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    if (!visible) { setOpenWindows([]); setFocusOrder([]); }
  }, [visible]);

  const openFile = useCallback((fileKey: string) => {
    const id   = winId++;
    const base = { x: 60 + openWindows.length * 22, y: 40 + openWindows.length * 18 };
    setOpenWindows(w => [...w, { id, fileKey, pos: base }]);
    setFocusOrder(f => [...f.filter(x => x !== id), id]);
  }, [openWindows.length]);

  const closeWindow = useCallback((id: number) => {
    setOpenWindows(w => w.filter(win => win.id !== id));
    setFocusOrder(f => f.filter(x => x !== id));
  }, []);

  const focusWindow = useCallback((id: number) => {
    setFocusOrder(f => [...f.filter(x => x !== id), id]);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.45s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          transform: visible ? 'scale(1)' : 'scale(0.88)',
          transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
          borderRadius: 10, overflow: 'hidden',
          width: 'min(90vw, 900px)', aspectRatio: '4/3',
          boxShadow: '0 0 100px rgba(100,150,255,0.25), 0 0 0 20px #1e1c1a, 0 0 0 21px rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #1a8fe3 0%, #4cb8f0 60%, #87ceeb 100%)',
          overflow: 'hidden', fontFamily: 'Tahoma, sans-serif',
        }}>

          <svg
            style={{ position: 'absolute', bottom: 40, left: 0, width: '100%', height: '65%', pointerEvents: 'none' }}
            viewBox="0 0 900 400" preserveAspectRatio="none"
          >
            <path d="M0,400 C90,260 270,220 450,248 C630,280 765,232 900,260 L900,400 Z" fill="#5db843"/>
            <path d="M0,400 C135,300 360,272 540,296 C675,316 810,280 900,300 L900,400 Z" fill="#4a9e35"/>
          </svg>

          <div style={{ position: 'absolute', top: 10, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {DESKTOP_ICONS.map(({ icon, name }) => (
              <div
                key={name}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56, padding: '4px 2px', cursor: 'default', borderRadius: 2 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(100,160,255,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                {name.split('\n').map((line, i) => (
                  <span key={i} style={{ fontSize: 9, color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.9)', textAlign: 'center', lineHeight: 1.3 }}>{line}</span>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            position: 'absolute', left: '12%', top: '6%', width: '77%', height: '82%',
            background: '#ece9d8', boxShadow: '3px 3px 10px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', border: '1px solid #888',
          }}>
            <div style={{
              background: 'linear-gradient(to bottom, #0a6fe3, #0a4dc7 40%, #083fa0)',
              padding: '3px 6px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>
                📁 My Portfolio — [C:\Users\Dev\Portfolio]
              </span>
              <div style={{ display: 'flex', gap: 2 }}>
                {['–', '□', '×'].map((label, i) => (
                  <button key={label} style={{
                    background: i === 2 ? 'linear-gradient(to bottom,#f1707a,#e81123)' : 'linear-gradient(to bottom,#5b9bd5,#2a6dd6)',
                    border: '1px solid rgba(0,0,0,0.3)', borderRadius: 2,
                    color: '#fff', fontSize: 10, fontWeight: 700,
                    width: 16, height: 14, cursor: 'pointer', padding: 0,
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: '#f0ede3', padding: '2px 8px', fontSize: 11, color: '#333', display: 'flex', gap: 14, flexShrink: 0, borderBottom: '1px solid #ccc' }}>
              {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
                <span
                  key={m}
                  style={{ cursor: 'default', padding: '1px 3px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#316ac5'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; }}
                >{m}</span>
              ))}
            </div>

            <div style={{ background: '#e8e4d8', padding: '2px 8px', fontSize: 10, color: '#666', flexShrink: 0, borderBottom: '1px solid #ccc' }}>
              ◀ Back &nbsp; ▶ Forward &nbsp; ▲ Up &nbsp; 🔍 Search &nbsp; 📁 Folders
            </div>

            <div style={{ background: '#e8e4d8', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, borderBottom: '1px solid #ccc' }}>
              <span style={{ fontSize: 10, color: '#555' }}>Address</span>
              <div style={{ flex: 1, background: '#fff', border: '1px solid #aaa', padding: '1px 4px', fontSize: 11 }}>
                C:\Users\Dev\Portfolio
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '24%', background: '#dae8f5', padding: '8px 6px', borderRight: '1px solid #b8b4a4', fontSize: 10, flexShrink: 0, overflowY: 'auto' }}>
                <div style={{ color: '#0a4dc7', fontWeight: 700, marginBottom: 6 }}>File and Folder Tasks</div>
                {['📁 Projects', '📁 Skills', '📁 About Me', '📁 Contact'].map(item => (
                  <div key={item} style={{ color: '#1a5bbf', marginBottom: 4, cursor: 'default' }}>{item}</div>
                ))}
              </div>

              <div style={{ flex: 1, background: '#fff', padding: 8, position: 'relative', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                  {EXPLORER_ICONS.map(({ name, icon }) => (
                    <div
                      key={name}
                      onDoubleClick={() => openFile(name)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 4px', borderRadius: 2, cursor: 'default', border: '1px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(49,106,197,0.15)'; e.currentTarget.style.border = '1px solid rgba(49,106,197,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid transparent'; }}
                    >
                      <span style={{ fontSize: 28 }}>{icon}</span>
                      <span style={{ fontSize: 9, color: '#222', textAlign: 'center', marginTop: 2, wordBreak: 'break-all' }}>{name}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, color: '#bbb', pointerEvents: 'none' }}>
                  double-click to open
                </div>
              </div>
            </div>

            <div style={{ background: '#d4d0c8', borderTop: '1px solid #a0a0a0', padding: '2px 8px', fontSize: 10, color: '#555', flexShrink: 0 }}>
              8 objects &nbsp;|&nbsp; Disk free: 47.2 GB
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(to bottom, #2456b4 0%, #3a7de0 8%, #2c65c7 40%, #1c4aa0 90%, #163b88 100%)',
            borderTop: '1px solid #5090e8',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 6px',
          }}>
            <button style={{
              background: 'linear-gradient(to bottom, #4db84d, #2da02d 50%, #1d7a1d)',
              border: '1px solid #1a5e1a', borderRadius: 10,
              color: '#fff', fontSize: 12, fontWeight: 700,
              padding: '2px 14px', cursor: 'pointer',
            }}>⊞ start</button>
            <div style={{ background: 'rgba(0,0,60,0.25)', borderRadius: 3, padding: '2px 8px', textAlign: 'right' }}>
              <div style={{ color: '#fff', fontSize: 11 }}>12:00 PM</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>3/27/2026</div>
            </div>
          </div>

          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 3px)',
          }} />

          {/* Open file windows */}
          {openWindows.map(win => (
            <FileWindow
              key={win.id}
              fileKey={win.fileKey}
              onClose={() => closeWindow(win.id)}
              zIndex={20 + focusOrder.indexOf(win.id)}
              onFocus={() => focusWindow(win.id)}
              initialPos={win.pos}
            />
          ))}
        </div>

        <div
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 14, zIndex: 200,
            fontFamily: '"Share Tech Mono",monospace',
            fontSize: 9, letterSpacing: '3px', color: 'rgba(255,255,255,0.28)',
            cursor: 'pointer',
          }}
        >
          [ ESC / CLICK OUTSIDE ]
        </div>
      </div>
    </div>
  );
}