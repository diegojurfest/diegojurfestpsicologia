// Mantiene el diseño ORIGINAL del og-image (og-base.png) y reemplaza SOLO la foto
// de la derecha por la nueva (/tmp/og-photo.png), con fundido suave por la izquierda.
// Re-pone el monograma crema arriba a la derecha (queda tapado por la foto).
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');

const base  = PNG.sync.read(fs.readFileSync(path.join(__dirname, 'og-base.png')));   // 1200x630
const photo = PNG.sync.read(fs.readFileSync('/tmp/og-photo.png'));                    // retrato
const mono  = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'public/dj-monograma-cream.png')));

const W = base.width, H = base.height;
const clamp = (n, a, b) => n < a ? a : n > b ? b : n;

// --- ajustes (tunear si hace falta) ---
const REGION_X = 700;   // izquierda de la zona de foto en el lienzo
const REGION_W = 500;   // ancho de la foto
const REGION_H = H;     // alto (toda la altura)
const FADE = 150;       // ancho del fundido por la izquierda
const BIAS_Y = 0.12;    // 0 = tope (más pelo), 0.5 = centro
const MONO_SIZE = 46;   // tamaño del monograma arriba-derecha
const MONO_X = W - MONO_SIZE - 34;
const MONO_Y = 30;

function sample(src, fx, fy) {
  fx = clamp(fx, 0, src.width - 1); fy = clamp(fy, 0, src.height - 1);
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const x1 = Math.min(x0 + 1, src.width - 1), y1 = Math.min(y0 + 1, src.height - 1);
  const dx = fx - x0, dy = fy - y0;
  const px = (x, y) => { const i = (y * src.width + x) * 4; return [src.data[i], src.data[i+1], src.data[i+2], src.data[i+3]]; };
  const a = px(x0, y0), b = px(x1, y0), c = px(x0, y1), d = px(x1, y1);
  const out = [0, 0, 0, 0];
  for (let k = 0; k < 4; k++) {
    const top = a[k]*(1-dx) + b[k]*dx, bot = c[k]*(1-dx) + d[k]*dx;
    out[k] = top*(1-dy) + bot*dy;
  }
  return out;
}

// cover-scale de la foto dentro de REGION_W x REGION_H
const scale = Math.max(REGION_W / photo.width, REGION_H / photo.height);
const sw = photo.width * scale, sh = photo.height * scale;
const offX = (sw - REGION_W) / 2, offY = (sh - REGION_H) * BIAS_Y;

for (let ry = 0; ry < REGION_H; ry++) {
  for (let rx = 0; rx < REGION_W; rx++) {
    const tx = REGION_X + rx, ty = ry;
    if (tx >= W || ty >= H) continue;
    const c = sample(photo, (rx + offX) / scale, (ry + offY) / scale);
    const a = clamp(rx / FADE, 0, 1) * (c[3] / 255);
    const bi = (ty * W + tx) * 4;
    base.data[bi]   = base.data[bi]   * (1 - a) + c[0] * a;
    base.data[bi+1] = base.data[bi+1] * (1 - a) + c[1] * a;
    base.data[bi+2] = base.data[bi+2] * (1 - a) + c[2] * a;
  }
}

// monograma crema arriba-derecha (queda sobre la foto)
const mscale = MONO_SIZE / mono.height;
for (let yy = 0; yy < MONO_SIZE; yy++) {
  for (let xx = 0; xx < Math.round(mono.width * mscale); xx++) {
    const c = sample(mono, xx / mscale, yy / mscale);
    const a = c[3] / 255; if (a <= 0) continue;
    const tx = MONO_X + xx, ty = MONO_Y + yy;
    if (tx < 0 || ty < 0 || tx >= W || ty >= H) continue;
    const bi = (ty * W + tx) * 4;
    base.data[bi]   = base.data[bi]   * (1 - a) + c[0] * a;
    base.data[bi+1] = base.data[bi+1] * (1 - a) + c[1] * a;
    base.data[bi+2] = base.data[bi+2] * (1 - a) + c[2] * a;
  }
}

// Reemplaza la insignia sage (abajo-izq) por la teal de la marca, para que el
// logo del og coincida con el del sitio. Coordenadas fijas del badge en og-base
// (detectadas con connected-components; og-base es un master que no cambia).
const teal = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'public/dj-monograma-teal.png')));
const BADGE = { x0: 62, y0: 482, x1: 122, y1: 546 };
{
  const si = ((BADGE.y0 - 20) * W + BADGE.x0) * 4;        // muestreo del fondo crema
  const cr = [base.data[si], base.data[si+1], base.data[si+2]];
  for (let y = BADGE.y0-4; y <= BADGE.y1+4; y++) for (let x = BADGE.x0-4; x <= BADGE.x1+4; x++) {
    if (x<0||y<0||x>=W||y>=H) continue; const i = (y*W+x)*4;
    base.data[i]=cr[0]; base.data[i+1]=cr[1]; base.data[i+2]=cr[2];
  }
  const side = (BADGE.y1 - BADGE.y0 + 1) + 2;             // ~67, cubre el badge
  const ts = side / teal.height;
  const ox = Math.round((BADGE.x0 + BADGE.x1)/2 - side/2);
  const oy = Math.round((BADGE.y0 + BADGE.y1)/2 - side/2);
  for (let yy = 0; yy < Math.round(teal.height*ts); yy++) for (let xx = 0; xx < Math.round(teal.width*ts); xx++) {
    const c = sample(teal, xx/ts, yy/ts), a = c[3]/255; if (a<=0) continue;
    const tx = ox+xx, ty = oy+yy; if (tx<0||ty<0||tx>=W||ty>=H) continue;
    const i = (ty*W+tx)*4;
    base.data[i]=base.data[i]*(1-a)+c[0]*a; base.data[i+1]=base.data[i+1]*(1-a)+c[1]*a; base.data[i+2]=base.data[i+2]*(1-a)+c[2]*a;
  }
  console.log('insignia -> teal en', ox, oy, 'side', side);
}

fs.writeFileSync('/tmp/og-built.png', PNG.sync.write(base));
console.log('OK — /tmp/og-built.png (build.sh lo convierte a public/og-image.jpg)');
