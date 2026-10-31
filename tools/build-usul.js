// Builds data/usul.js and data/usul-sharh/<chapter>.json from the page transcriptions in tools/texts/usul/pages/pNNN.md
// («تهذيب مسار الأصول إلى علم أصول فقه الحنفية» لـ د. صلاح أبو الحاج; format in tools/texts/usul/BRIEF.md).
// Chapters are the book's مطالب (or a مبحث/فصل with no مطالب). Units are not its paragraphs but its key points, chosen
// per chapter in tools/texts/usul/key (see KEY-BRIEF.md). The introductions, objectives and exercises are left out.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dir = path.join(__dirname, 'texts/usul/pages');
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

/* 1. one stream of blocks: {h:level,t} headings, {p:text,page,notes:[...]} paragraphs */
const files = fs.readdirSync(dir).filter(f => /^p\d{3}\.md$/.test(f)).sort();
const blocks = []; let lastNotes = null;
for (const f of files) {
  const page = parseInt(f.slice(1, 4), 10);
  let src = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r/g, '').replace(/\{\?\}/g, '');
  const [body, foot = ''] = src.split(/\n-{3,}\n/);
  // footnotes of this page: (n) text; (+) continues the previous page's last footnote
  // footnotes in print order; a page can restart its numbering, so each reference takes the first unused note with its number
  const notes = [];
  for (const line of foot.split('\n').map(s => s.trim()).filter(Boolean)) {
    const m = line.match(/^\(([٠-٩0-9]+|\+)\)\s*(.*)$/);
    if (!m) { if (notes.length) notes[notes.length - 1].t += ' ' + line; else if (lastNotes && lastNotes.length) lastNotes[lastNotes.length - 1] += ' ' + line; continue }
    if (m[1] === '+') { if (lastNotes && lastNotes.length) lastNotes[lastNotes.length - 1] += ' ' + m[2]; continue }
    notes.push({ n: +m[1].replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), t: m[2] });
  }
  let paras = body.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  let cont = false;
  if (paras[0] && paras[0].startsWith('@@CONT')) { cont = true; paras[0] = paras[0].replace(/^@@CONT\s*/, ''); if (!paras[0]) paras.shift() }
  paras.forEach((t, i) => {
    t = t.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    // footnote references (n) -> the note text, kept with the paragraph
    const own = [];
    t = t.replace(/\(([٠-٩]{1,2})\)/g, (all, n) => { const k = +n.replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), note = notes.find(x => x.n === k && !x.used); if (!note) return all; note.used = 1; own.push(note.t); return '' });
    const h = t.match(/^(#{1,4})\s+(.*)$/);
    if (h) { blocks.push({ h: h[1].length, t: h[2].replace(/\*\*/g, '').trim(), page }); return }
    const prev = blocks[blocks.length - 1];
    if (i === 0 && cont && prev && prev.p !== undefined) { prev.p += ' ' + t; prev.notes.push(...own); lastNotes = prev.notes; return }
    blocks.push({ p: t, page, notes: own }); lastNotes = own;
  });
}

/* 2. chapters */
const chapters = []; let ch = null, group = '', mabhath = '', skip = 0, pendingHead = null;
const clean = s => s.replace(/[:：]\s*$/, '').trim();
const newChapter = (title, page) => { ch = { id: 'u' + (chapters.length + 1), title, group, units: [], page }; chapters.push(ch) };
for (const b of blocks) {
  if (b.h) {
    if (skip && b.h <= skip) skip = 0;
    // the exercises run to the next مطلب-or-higher heading, whatever level their own title got
    if (/^مناقشة/.test(b.t)) { skip = Math.min(b.h, 3); continue }
    if (skip) continue;
    // the two introductions are not memorised
    if (b.h === 1 && /^مقدمة/.test(b.t)) { skip = 1; continue }
    // a فصل or قسم inside a باب is a section like a مبحث; the group stays the باب
    if (b.h === 1 && /^الباب/.test(b.t)) { group = clean(b.t); mabhath = ''; newChapter(group, b.page); continue }
    if (b.h === 1) { mabhath = clean(b.t); newChapter(mabhath, b.page); continue }
    if (b.h === 2) { mabhath = clean(b.t); newChapter(mabhath, b.page); continue }
    if (b.h === 3) { newChapter(clean(b.t), b.page); if (mabhath) ch.sup = mabhath; continue }
    // the learning objectives listed at the start of each باب are left out too, up to the next heading
    if (/الأهداف/.test(b.t)) { skip = 4; continue }
    if (skip === 4) skip = 0;
    pendingHead = b.t; continue; // #### : a bold line that opens the next paragraph
  }
  if (skip || !ch || /^بسم الله الرحمن الرحيم$/.test(b.p) || /^[*\s]+$/.test(b.p)) continue;
  let t = b.p;
  let head = null;
  if (pendingHead) { head = clean(pendingHead.replace(/\*\*/g, '')); t = '**' + pendingHead.replace(/\*\*/g, '') + '** ' + t; pendingHead = null }
  ch.units.push({ t, notes: b.notes, page: b.page, head });
}
const CH = chapters.filter(c => c.units.length);

// --export: one readable file per chapter for choosing its key points (tools/texts/usul/source/<id>.md)
if (process.argv.includes('--export')) {
  const od = path.join(__dirname, 'texts/usul/source'); fs.mkdirSync(od, { recursive: true });
  for (const c of CH) fs.writeFileSync(path.join(od, c.id + '.md'), '# ' + c.title + '\n(' + [c.group, c.sup].filter(Boolean).join(' › ') + ')\n\n'
    + c.units.map((u, i) => '[' + (i + 1) + '] ' + u.t).join('\n\n') + '\n');
  console.log('exported', CH.length, 'chapters'); process.exit(0);
}

/* 3. units: the chapter's key points from tools/texts/usul/key/<id>.json (see KEY-BRIEF.md; check-key.js proves every
   piece is the book's own words). Under each one, «من الكتاب» shows the paragraphs it was taken from with their footnotes. */
const plain = s => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const sharh = {}, kd = path.join(__dirname, 'texts/usul/key');
const BOOK = {
  key: 'usul', app: 'mutoon', lsk: 'mutoon_usul_v2', title: 'تهذيب مسار الأصول',
  sub: 'إلى علم أصول فقه الحنفية · أ.د. صلاح محمد أبو الحاج · التعريفات والقواعد',
  unitWord: 'معلومة', sharhDir: 'data/usul-sharh/',
  chapters: CH.map(c => {
    const f = path.join(kd, c.id + '.json'); if (!fs.existsSync(f)) return null;
    const units = JSON.parse(fs.readFileSync(f, 'utf8')).map((k, i) => {
      const id = c.id + '_' + (i + 1);
      const text = (k.h ? k.h.replace(/[:،]\s*$/, '') + ': ' : '') + k.x.map(p => plain(p)).join(' ');
      const src = [...new Set(k.p || [])].sort((a, b) => a - b).map(n => c.units[n - 1]).filter(Boolean);
      const notes = src.flatMap(u => u.notes), pages = [...new Set(src.map(u => u.page + 2))];
      sharh[c.id] = Object.assign(sharh[c.id] || {}, { [id]: { title: 'من الكتاب', foot: '', secs: [
        { src: c.title, ref: pages.length ? 'ص ' + pages.map(ar).join('، ') : '', url: '', text: src.map(u => plain(u.t)).join('\n\n') },
        ...(notes.length ? [{ src: 'الحواشي', ref: '', url: '', text: notes.join('\n\n') }] : []),
      ] } });
      return { id, label: k.t, segs: [['matn', text]] };
    });
    if (!units.length) return null;
    // a chapter is reviewed as one block, so a big one is cut into even parts of at most PART points
    const PART = 9, k = Math.ceil(units.length / PART), size = Math.ceil(units.length / k);
    return Array.from({ length: k }, (_, i) => {
      const id = c.id + (i ? String.fromCharCode(97 + i) : ''), us = units.slice(i * size, (i + 1) * size);
      if (i) us.forEach(u => { sharh[id] = Object.assign(sharh[id] || {}, { [u.id]: sharh[c.id][u.id] }); delete sharh[c.id][u.id] });
      const o = { id, title: c.title + (k > 1 ? ' (' + ar(i + 1) + ')' : ''), group: c.group, units: us };
      if (c.sup && c.sup !== c.title) o.sup = c.sup;
      return o;
    });
  }).filter(Boolean).flat(),
};

fs.writeFileSync(path.join(root, 'data/usul.js'), '// Generated by tools/build-usul.js from tools/texts/usul (pages + key) — edit those, not this file\nwindow.BOOK=' + JSON.stringify(BOOK) + ';\n');
const sd = path.join(root, 'data/usul-sharh'); fs.mkdirSync(sd, { recursive: true });
for (const f of fs.readdirSync(sd)) fs.unlinkSync(path.join(sd, f));
for (const [cid, j] of Object.entries(sharh)) fs.writeFileSync(path.join(sd, cid + '.json'), JSON.stringify(j));
const n = BOOK.chapters.reduce((a, c) => a + c.units.length, 0);
const w = BOOK.chapters.reduce((a, c) => a + c.units.reduce((b, u) => b + u.segs[0][1].split(/\s+/).length, 0), 0);
console.log(`${BOOK.chapters.length} chapters, ${n} key points, ${w} words to memorise`);
