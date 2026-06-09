// Recolorea el monograma DJ aprobado (master-sage.png) al color de marca y genera
// todos los assets en /public. NO redibuja las letras: solo remapea el eje sage→cream
// hacia teal→cream, conservando exactamente las formas y el suavizado.
//
// Para ajustar el color a futuro: cambiá TEAL abajo y corré `bash tools/monogram/build.sh`.
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const TEAL  = [15, 110, 86];    // #0F6E56  ← color de marca (cambiá esto si hace falta)
const CREAM = [250, 249, 245];  // fondo/letras del master
const SAGE  = [124, 136, 116];  // cuadrado del master

const DIR = __dirname;
const PUB = path.resolve(DIR, '../../public');
const png = PNG.sync.read(fs.readFileSync(path.join(DIR, 'master-sage.png')));
const { width: W, height: H, data: D } = png;

const v = [CREAM[0]-SAGE[0], CREAM[1]-SAGE[1], CREAM[2]-SAGE[2]];
const vv = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
const idx = (x, y) => y*W + x;
const clamp = n => n < 0 ? 0 : n > 255 ? 255 : n|0;
const lerp = (a, b, t) => a + (b-a)*t;

const tAt = new Float32Array(W*H);            // 0 = sage, 1 = cream
for (let i = 0; i < W*H; i++) {
  const p = i*4;
  let t = ((D[p]-SAGE[0])*v[0] + (D[p+1]-SAGE[1])*v[1] + (D[p+2]-SAGE[2])*v[2]) / vv;
  tAt[i] = t < 0 ? 0 : t > 1 ? 1 : t;
}
function flood(thr) {
  const out = new Uint8Array(W*H), st = [];
  for (const [cx, cy] of [[0,0],[W-1,0],[0,H-1],[W-1,H-1]]) {
    const i = idx(cx, cy); if (tAt[i] > thr && !out[i]) { out[i] = 1; st.push(i); }
  }
  while (st.length) {
    const i = st.pop(), x = i%W, y = (i/W)|0;
    for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
      if (nx<0||ny<0||nx>=W||ny>=H) continue;
      const j = idx(nx, ny); if (!out[j] && tAt[j] > thr) { out[j] = 1; st.push(j); }
    }
  }
  return out;
}
const outside = flood(0.6), outsideB = flood(0.45);

const mkA = (transparent) => {
  const o = new PNG({ width: W, height: H });
  for (let i = 0; i < W*H; i++) {
    const t = tAt[i], p = i*4;
    o.data[p]   = clamp(lerp(TEAL[0], CREAM[0], t));
    o.data[p+1] = clamp(lerp(TEAL[1], CREAM[1], t));
    o.data[p+2] = clamp(lerp(TEAL[2], CREAM[2], t));
    o.data[p+3] = transparent ? (outside[i] ? 0 : 255) : 255;
  }
  return o;
};
const A = mkA(true);       // teal badge, transparent corners (nav + favicons)
const Afull = mkA(false);  // teal badge, opaque cream corners (apple-touch)
const B = new PNG({ width: W, height: H }); // cream letterforms only (footer)
for (let i = 0; i < W*H; i++) {
  const t = tAt[i], p = i*4;
  B.data[p] = CREAM[0]; B.data[p+1] = CREAM[1]; B.data[p+2] = CREAM[2];
  let a = (t - 0.5) / 0.35; a = a < 0 ? 0 : a > 1 ? 1 : a;
  B.data[p+3] = outsideB[i] ? 0 : clamp(a*255);
}

function bbox(p, athr) {
  let minx=W, miny=H, maxx=0, maxy=0;
  for (let y=0;y<H;y++) for (let x=0;x<W;x++)
    if (p.data[idx(x,y)*4+3] > athr) { if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y; }
  return { minx, miny, maxx, maxy };
}
function square(bb, pad) {
  let { minx, miny, maxx, maxy } = bb;
  minx-=pad; miny-=pad; maxx+=pad; maxy+=pad;
  const w = maxx-minx+1, h = maxy-miny+1;
  if (w > h) { const d=w-h; miny-=d>>1; maxy+=d-(d>>1); }
  else if (h > w) { const d=h-w; minx-=d>>1; maxx+=d-(d>>1); }
  return { minx, miny, maxx, maxy };
}
function crop(p, bb) {
  const w = bb.maxx-bb.minx+1, h = bb.maxy-bb.miny+1, o = new PNG({ width: w, height: h });
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) {
    const sx=bb.minx+x, sy=bb.miny+y, d=(y*w+x)*4;
    if (sx<0||sy<0||sx>=W||sy>=H) { o.data[d+3]=0; continue; }
    const s=idx(sx,sy)*4;
    o.data[d]=p.data[s]; o.data[d+1]=p.data[s+1]; o.data[d+2]=p.data[s+2]; o.data[d+3]=p.data[s+3];
  }
  return o;
}
const Acrop = crop(A, square(bbox(A,10), 6));
// letras crema: recortar ajustado y volver a cuadrar con margen para que respiren
const Bcrop = crop(B, square(bbox(B,10), 22));

fs.writeFileSync(path.join(PUB, 'dj-monograma-teal.png'),  PNG.sync.write(Acrop));
fs.writeFileSync(path.join(PUB, 'dj-monograma-cream.png'), PNG.sync.write(Bcrop));
fs.writeFileSync(path.join(PUB, 'apple-touch-icon.png'),   PNG.sync.write(Afull));
console.log('teal', Acrop.width+'x'+Acrop.height, '| cream', Bcrop.width+'x'+Bcrop.height, '| apple', W+'x'+H);

// preview para verificación (teal sobre cream | crema sobre teal oscuro)
function scaleTo(p, th) {
  const s=th/p.height, w=Math.round(p.width*s), o=new PNG({width:w,height:th});
  for (let y=0;y<th;y++) for (let x=0;x<w;x++) {
    const sx=Math.min(p.width-1,Math.floor(x/s)), sy=Math.min(p.height-1,Math.floor(y/s));
    const si=(sy*p.width+sx)*4, di=(y*w+x)*4;
    o.data[di]=p.data[si]; o.data[di+1]=p.data[si+1]; o.data[di+2]=p.data[si+2]; o.data[di+3]=p.data[si+3];
  }
  return o;
}
const PW=760, PH=360, half=PW/2, prev=new PNG({width:PW,height:PH});
for (let y=0;y<PH;y++) for (let x=0;x<PW;x++) { const d=(y*PW+x)*4, dk=x>=half;
  prev.data[d]=dk?8:252; prev.data[d+1]=dk?80:250; prev.data[d+2]=dk?65:244; prev.data[d+3]=255; }
function blit(c, sp, ox, oy) { for (let y=0;y<sp.height;y++) for (let x=0;x<sp.width;x++) {
  const s=(y*sp.width+x)*4, a=sp.data[s+3]/255; if (a<=0) continue;
  const cx=ox+x, cy=oy+y; if (cx<0||cy<0||cx>=c.width||cy>=c.height) continue; const d=(cy*c.width+cx)*4;
  c.data[d]=clamp(lerp(c.data[d],sp.data[s],a)); c.data[d+1]=clamp(lerp(c.data[d+1],sp.data[s+1],a)); c.data[d+2]=clamp(lerp(c.data[d+2],sp.data[s+2],a)); } }
const As=scaleTo(Acrop,150), Bs=scaleTo(Bcrop,150);
blit(prev, As, Math.round(half/2-As.width/2), Math.round(PH/2-As.height/2));
blit(prev, Bs, Math.round(half+half/2-Bs.width/2), Math.round(PH/2-Bs.height/2));
fs.mkdirSync('/tmp/mono/out', { recursive: true });
fs.writeFileSync('/tmp/mono/out/PREVIEW2.png', PNG.sync.write(prev));
