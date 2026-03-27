import * as THREE from 'three';

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function createScreenTexture(): THREE.CanvasTexture {
  const W = 1280, H = 960;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0,   '#1a8fe3');
  bg.addColorStop(0.6, '#4cb8f0');
  bg.addColorStop(1,   '#87ceeb');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#5db843';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.bezierCurveTo(W*0.1, H*0.65, W*0.3, H*0.55, W*0.5, H*0.62);
  ctx.bezierCurveTo(W*0.7, H*0.7, W*0.85, H*0.58, W, H*0.65);
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#4a9e35';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.bezierCurveTo(W*0.15, H*0.75, W*0.4, H*0.68, W*0.6, H*0.74);
  ctx.bezierCurveTo(W*0.75, H*0.79, W*0.9, H*0.7, W, H*0.75);
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

  const taskH = 40, taskY = H - taskH;
  const tg = ctx.createLinearGradient(0, taskY, 0, H);
  tg.addColorStop(0, '#2456b4'); tg.addColorStop(0.08, '#3a7de0');
  tg.addColorStop(0.4, '#2c65c7'); tg.addColorStop(0.9, '#1c4aa0');
  tg.addColorStop(1, '#163b88');
  ctx.fillStyle = tg; ctx.fillRect(0, taskY, W, taskH);
  ctx.strokeStyle = '#5090e8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, taskY+1); ctx.lineTo(W, taskY+1); ctx.stroke();

  const sg = ctx.createLinearGradient(4, taskY+4, 4, taskY+taskH-4);
  sg.addColorStop(0, '#4db84d'); sg.addColorStop(0.5, '#2da02d'); sg.addColorStop(1, '#1d7a1d');
  ctx.fillStyle = sg; roundRect(ctx, 4, taskY+3, 100, taskH-6, 12); ctx.fill();
  ctx.strokeStyle = '#1a5e1a'; ctx.lineWidth = 1;
  roundRect(ctx, 4, taskY+3, 100, taskH-6, 12); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Tahoma,sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 2;
  ctx.fillText('⊞ start', 16, taskY+26); ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(0,0,60,0.25)';
  roundRect(ctx, W-82, taskY+4, 78, taskH-8, 3); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '13px Tahoma,sans-serif';
  ctx.fillText('12:00 PM', W-72, taskY+18);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '11px Tahoma,sans-serif';
  ctx.fillText('3/27/2026', W-70, taskY+33);

  const wx = 120, wy = 55, ww = 700, wh = 500;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(wx+6, wy+6, ww, wh);
  ctx.fillStyle = '#ece9d8'; ctx.fillRect(wx, wy, ww, wh);

  const tbG = ctx.createLinearGradient(wx, wy, wx, wy+30);
  tbG.addColorStop(0, '#0a4dc7'); tbG.addColorStop(0.4, '#1560e8'); tbG.addColorStop(0.9, '#0d3fa0');
  ctx.fillStyle = tbG; ctx.fillRect(wx, wy, ww, 30);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Tahoma,sans-serif';
  ctx.shadowColor = 'rgba(0,0,80,0.5)'; ctx.shadowBlur = 1;
  ctx.fillText('📁 My Portfolio — [C:\\Users\\Dev\\Portfolio]', wx+10, wy+20);
  ctx.shadowBlur = 0;

  [
    { x: ww-22, label: '×', c0: '#f1707a', c1: '#e81123' },
    { x: ww-44, label: '□', c0: '#5b9bd5', c1: '#2a6dd6' },
    { x: ww-66, label: '–', c0: '#5b9bd5', c1: '#2a6dd6' },
  ].forEach(({ x, label, c0, c1 }) => {
    const g2 = ctx.createLinearGradient(wx+x, wy+4, wx+x, wy+26);
    g2.addColorStop(0, c0); g2.addColorStop(1, c1);
    ctx.fillStyle = g2; roundRect(ctx, wx+x, wy+4, 18, 22, 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Tahoma';
    ctx.fillText(label, wx+x+5, wy+20);
  });

  ctx.fillStyle = '#f0ede3'; ctx.fillRect(wx, wy+30, ww, 22);
  ctx.fillStyle = '#333'; ctx.font = '12px Tahoma';
  ['File','Edit','View','Favorites','Tools','Help'].forEach((item, i) => {
    ctx.fillText(item, wx+10+i*72, wy+45);
  });
  ctx.fillStyle = '#e8e4d8'; ctx.fillRect(wx, wy+52, ww, 26);
  ctx.fillStyle = '#666'; ctx.font = '11px Tahoma';
  ctx.fillText('◀ Back   ▶ Forward   ▲ Up   🔍 Search   📁 Folders', wx+8, wy+68);
  ctx.fillStyle = '#fff'; ctx.fillRect(wx+8, wy+82, ww-70, 20);
  ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1; ctx.strokeRect(wx+8, wy+82, ww-70, 20);
  ctx.fillStyle = '#333'; ctx.font = '12px Tahoma';
  ctx.fillText('C:\\Users\\Dev\\Portfolio', wx+12, wy+96);

  ctx.fillStyle = '#dae8f5'; ctx.fillRect(wx, wy+106, 180, wh-126);
  ctx.fillStyle = '#0a4dc7'; ctx.font = 'bold 11px Tahoma';
  ctx.fillText('File and Folder Tasks', wx+8, wy+125);
  ctx.fillStyle = '#1a5bbf'; ctx.font = '11px Tahoma';
  ['📁 Projects','📁 Skills','📁 About Me','📁 Contact'].forEach((item, i) => {
    ctx.fillText(item, wx+12, wy+145+i*22);
  });
  ctx.fillStyle = '#b8b4a4'; ctx.fillRect(wx+180, wy+106, 1, wh-126);

  ctx.fillStyle = '#fff'; ctx.fillRect(wx+181, wy+106, ww-181, wh-126);
  [
    { name: 'about_me.txt', icon: '📝', col: 0, row: 0 },
    { name: 'projects/',    icon: '📁', col: 1, row: 0 },
    { name: 'resume.pdf',   icon: '📄', col: 2, row: 0 },
    { name: 'skills.exe',   icon: '⚙️', col: 3, row: 0 },
    { name: 'contact.html', icon: '🌐', col: 0, row: 1 },
    { name: 'github/',      icon: '🐱', col: 1, row: 1 },
    { name: 'music.mp3',    icon: '🎵', col: 2, row: 1 },
    { name: 'README.txt',   icon: '📋', col: 3, row: 1 },
  ].forEach(({ name, icon, col, row }) => {
    const fx = wx+181 + 20 + col*90, fy = wy+106 + 20 + row*90;
    ctx.font = '34px serif'; ctx.fillText(icon, fx, fy+34);
    ctx.fillStyle = '#222'; ctx.font = '10px Tahoma';
    ctx.textAlign = 'center'; ctx.fillText(name, fx+17, fy+54);
    ctx.textAlign = 'left';
  });

  ctx.fillStyle = '#d4d0c8'; ctx.fillRect(wx, wy+wh-20, ww, 20);
  ctx.strokeStyle = '#a0a0a0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(wx, wy+wh-20); ctx.lineTo(wx+ww, wy+wh-20); ctx.stroke();
  ctx.fillStyle = '#555'; ctx.font = '11px Tahoma';
  ctx.fillText('8 objects  |  Disk free: 47.2 GB', wx+8, wy+wh-6);

  [
    { icon: '🖥️', name: 'My Computer',       x: 18, y: 16  },
    { icon: '🌐', name: 'Internet\nExplorer', x: 18, y: 88  },
    { icon: '🗑️', name: 'Recycle Bin',        x: 18, y: 160 },
    { icon: '📂', name: 'My Documents',       x: 18, y: 232 },
  ].forEach(({ icon, name, x, y }) => {
    ctx.font = '28px serif'; ctx.fillText(icon, x+6, y+28);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Tahoma';
    ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 4;
    name.split('\n').forEach((line, i) => ctx.fillText(line, x, y+48+i*14));
    ctx.shadowBlur = 0;
  });

  ctx.fillStyle = 'rgba(0,0,0,0.045)';
  for (let sy = 0; sy < H; sy += 3) ctx.fillRect(0, sy, W, 1);

  const vg = ctx.createRadialGradient(W/2, H/2, H*0.28, W/2, H/2, H*0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY           = false;
  tex.minFilter       = THREE.LinearMipmapLinearFilter;
  tex.magFilter       = THREE.LinearFilter;
  tex.anisotropy      = 16;
  tex.generateMipmaps = true;
  return tex;
}