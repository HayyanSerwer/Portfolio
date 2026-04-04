import * as THREE from 'three';

export function createScreenTexture(): THREE.CanvasTexture {
  const W = 64, H = 64;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#090f09';
  ctx.fillRect(0, 0, W, H);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}