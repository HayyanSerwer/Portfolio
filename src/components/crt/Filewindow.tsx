import React, { useState, useEffect, useRef } from 'react';
import { FILE_CONTENT } from './FileContent';

export interface FileWindowProps {
  fileKey:    string;
  onClose:    () => void;
  zIndex:     number;
  onFocus:    () => void;
  initialPos: { x: number; y: number };
}

export default function FileWindow({ fileKey, onClose, zIndex, onFocus, initialPos }: FileWindowProps) {
  const file = FILE_CONTENT[fileKey];
  const [pos, setPos] = useState(initialPos);
  const dragging   = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onTitleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    dragging.current   = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  if (!file) return null;

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: 'absolute', left: pos.x, top: pos.y, zIndex,
        width: 340, background: '#ece9d8',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
        border: '1px solid #888', borderRadius: 4, overflow: 'hidden',
        fontFamily: 'Tahoma, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          background: 'linear-gradient(to bottom, #0a6fe3, #0a4dc7 40%, #083fa0)',
          padding: '3px 6px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'move',
        }}
      >
        <span style={{
          color: '#fff', fontSize: 11, fontWeight: 700,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260,
        }}>
          {file.title}
        </span>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={onClose}
          style={{
            background: 'linear-gradient(to bottom, #f1707a, #e81123)',
            border: '1px solid #8b0a14', borderRadius: 2,
            color: '#fff', fontSize: 11, fontWeight: 700,
            width: 18, height: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, lineHeight: 1, flexShrink: 0,
          }}
        >×</button>
      </div>

      <div style={{ padding: 12, maxHeight: 220, overflowY: 'auto', background: '#fff' }}>
        {file.content}
      </div>
    </div>
  );
}