import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
const file = "C:/Users/Mahmoud/Downloads/miyeea/tools/texts/raw/tuhfatullab/matn_scan.pdf";
const [scale, ...ps] = process.argv.slice(2);
const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 }).promise;
console.log('pages', doc.numPages);
for (const p of ps) { const pg = await doc.getPage(+p); const vp = pg.getViewport({ scale: +scale });
  const c = createCanvas(vp.width, vp.height); const ctx = c.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height);
  await pg.render({ canvasContext: ctx, viewport: vp }).promise; fs.writeFileSync('scan_' + p + '.png', c.toBuffer('image/png')); console.log(p, vp.width, vp.height); }
