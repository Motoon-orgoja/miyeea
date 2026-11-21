import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
// usage: node crop.mjs out.png p:yTop:yBottom ...   (pdf coords, full width)
const file = "C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/tuhfatullab/fathwahhab.pdf";
const [out, ...specs] = process.argv.slice(2);
const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 }).promise;
const S = 2.2, imgs = [];
for (const sp of specs) { const [p, y1, y0] = sp.split(':').map(Number); const pg = await doc.getPage(p); const vp = pg.getViewport({ scale: S });
  const c = createCanvas(vp.width, vp.height); const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  await pg.render({ canvasContext: ctx, viewport: vp }).promise; const [ax, ay] = vp.convertToViewportPoint(150, y1), [bx, by] = vp.convertToViewportPoint(540, y0);
  imgs.push({ c, ax, ay, w: bx - ax, h: by - ay, label: sp }); }
const W = Math.max(...imgs.map(i => i.w)) + 10, H = imgs.reduce((s, i) => s + i.h + 24, 0);
const o = createCanvas(W, H); const x = o.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); let Y = 0;
for (const i of imgs) { x.fillStyle = '#00f'; x.font = '18px sans-serif'; x.fillText(i.label, 4, Y + 18); Y += 22; x.drawImage(i.c, i.ax, i.ay, i.w, i.h, 5, Y, i.w, i.h); Y += i.h + 2; }
fs.writeFileSync(out, o.toBuffer('image/png'));
