import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
const file = "C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/tuhfatullab/fathwahhab.pdf";
const cls = JSON.parse(fs.readFileSync('clusters.json')); const m = {}; cls.forEach((x, i) => x.fonts.forEach(f => m[f] = i));
const all = JSON.parse(fs.readFileSync('all.json'));
const want = process.argv.slice(2).map(Number);
const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 }).promise;
const S = 4, cache = {};
async function page(p) { if (cache[p]) return cache[p]; const pg = await doc.getPage(p); const vp = pg.getViewport({ scale: S });
  const c = createCanvas(vp.width, vp.height); const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, vp.width, vp.height);
  await pg.render({ canvasContext: ctx, viewport: vp }).promise; return cache[p] = { c, vp }; }
for (const ci of want) {
  // pick samples: up to 3 occurrences per char, preferring different pages
  const samp = {};
  for (const pg of all) for (const g of pg.G) if (m[g[5]] === ci) { const k = g[0]; samp[k] = samp[k] || []; if (samp[k].length < 3 && !samp[k].some(s => s.p === pg.p)) samp[k].push({ p: pg.p, g }); }
  const keys = Object.keys(samp).sort();
  const cw = 3 * 110 + 40, ch = 110, cols = 3; const rows = Math.ceil(keys.length / cols);
  const out = createCanvas(cols * cw, rows * ch); const o = out.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, out.width, out.height);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i], X = (i % cols) * cw, Y = Math.floor(i / cols) * ch;
    o.fillStyle = '#c00'; o.font = '28px sans-serif'; o.fillText(JSON.stringify(k).slice(1, -1), X + 4, Y + 40);
    for (let j = 0; j < samp[k].length; j++) {
      const { p, g } = samp[k][j]; const { c, vp } = await page(p);
      const size = g[4], w = Math.max(g[1] * size, 0.3 * size), x0 = g[2] - 0.35 * size, x1 = g[2] + w + 0.35 * size;
      const [ax, ay] = vp.convertToViewportPoint(x0, g[3] + 1.1 * size), [bx, by] = vp.convertToViewportPoint(x1, g[3] - 0.5 * size);
      const sw = bx - ax, sh = by - ay, sc = Math.min(100 / sw, 100 / sh);
      o.drawImage(c, ax, ay, sw, sh, X + 40 + j * 110, Y + 5, sw * sc, sh * sc);
      // mark the glyph's own box
      o.strokeStyle = 'rgba(0,120,255,.6)'; const gx = (g[2] - x0) / (x1 - x0) * sw * sc, gw = w / (x1 - x0) * sw * sc; o.strokeRect(X + 40 + j * 110 + gx, Y + 5, gw, sh * sc);
    }
    o.strokeStyle = '#ccc'; o.strokeRect(X, Y, cw, ch);
  }
  fs.writeFileSync('sheet_' + ci + '.png', out.toBuffer('image/png'));
  console.log(ci, keys.length);
}
