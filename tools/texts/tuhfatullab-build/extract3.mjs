// glyph dump from the operator list (textContent drops glyphs whose code looks like whitespace)
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
const [file, out, from, to] = process.argv.slice(2);
const doc = await pdfjs.getDocument({data: new Uint8Array(fs.readFileSync(file)), verbosity:0, fontExtraProperties:true}).promise;
const O = pdfjs.OPS; const mul = (a, b) => [a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1], a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3], a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5]];
const res = [];
for (let p = +from; p <= Math.min(+to, doc.numPages); p++) {
  const pg = await doc.getPage(p); const ol = await pg.getOperatorList();
  let st = {ctm:[1,0,0,1,0,0], font:null, size:0, cs:0, ws:0, hs:1, lead:0, rise:0}; const stack = [];
  let Tm = [1,0,0,1,0,0], Tlm = [1,0,0,1,0,0]; const G = [];
  const fonts = {};
  const getF = n => fonts[n] || (fonts[n] = pg.commonObjs.get(n));
  for (let i = 0; i < ol.fnArray.length; i++) {
    const fn = ol.fnArray[i], a = ol.argsArray[i];
    switch (fn) {
      case O.save: stack.push({...st, ctm: st.ctm.slice()}); break;
      case O.restore: if (stack.length) st = stack.pop(); break;
      case O.transform: st.ctm = mul(st.ctm, a); break;
      case O.beginText: Tm = [1,0,0,1,0,0]; Tlm = [1,0,0,1,0,0]; break;
      case O.setFont: st.font = a[0]; st.size = a[1]; break;
      case O.setTextMatrix: Tm = a.slice(0,6); Tlm = Tm.slice(); break;
      case O.moveText: Tlm = mul(Tlm, [1,0,0,1,a[0],a[1]]); Tm = Tlm.slice(); break;
      case O.setLeadingMoveText: st.lead = -a[1]; Tlm = mul(Tlm, [1,0,0,1,a[0],a[1]]); Tm = Tlm.slice(); break;
      case O.setLeading: st.lead = a[0]; break;
      case O.nextLine: Tlm = mul(Tlm, [1,0,0,1,0,-st.lead]); Tm = Tlm.slice(); break;
      case O.setCharSpacing: st.cs = a[0]; break;
      case O.setWordSpacing: st.ws = a[0]; break;
      case O.setHScale: st.hs = a[0] / 100; break;
      case O.setTextRise: st.rise = a[0]; break;
      case O.nextLineShowText: case O.nextLineSetSpacingShowText: case O.showText: case O.showSpacedText: {
        if (fn === O.nextLineSetSpacingShowText) { st.ws = a[0]; st.cs = a[1]; }
        if (fn !== O.showText && fn !== O.showSpacedText) { Tlm = mul(Tlm, [1,0,0,1,0,-st.lead]); Tm = Tlm.slice(); }
        const glyphs = fn === O.nextLineSetSpacingShowText ? a[2] : a[0];
        const f = getF(st.font); const fm0 = f.fontMatrix ? f.fontMatrix[0] : 0.001; const d = f.differences || [];
        for (const g of glyphs) {
          if (typeof g === 'number') { Tm = mul(Tm, [1,0,0,1, -g / 1000 * st.size * st.hs, 0]); continue; }
          const code = g.originalCharCode, nm = d[code];
          const ch = nm && /^\d+$/.test(nm) ? String.fromCharCode(+nm) : '{' + (nm || '#' + code) + '}';
          const w = g.width * fm0; // glyph-space width -> text space per unit size
          const M = mul(st.ctm, mul(Tm, [1,0,0,1,0,st.rise]));
          const size = Math.hypot(M[0] * st.size, M[1] * st.size) ;
          G.push([ch, +w.toFixed(3), +M[4].toFixed(1), +M[5].toFixed(1), +(size).toFixed(1), st.font]);
          const adv = (w * st.size + st.cs + (g.isSpace ? st.ws : 0)) * st.hs;
          Tm = mul(Tm, [1,0,0,1,adv,0]);
        }
        break; }
    }
  }
  res.push({p, G}); pg.cleanup();
}
fs.writeFileSync(out, JSON.stringify(res)); console.log('done', res.length);
