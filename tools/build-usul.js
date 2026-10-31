// Builds data/usul.js and data/usul-sharh/<chapter>.json from the page transcriptions in tools/texts/usul/pages/pNNN.md
// («تهذيب مسار الأصول إلى علم أصول فقه الحنفية» لـ د. صلاح أبو الحاج; format in tools/texts/usul/BRIEF.md).
// Chapters are the book's مطالب (or a مبحث/فصل with no مطالب), units are its paragraphs. Bold text is the author's
// definitions and rules: the «التعريفات والقواعد» track memorises only the paragraphs that have bold, and only their bold;
// the «الكتاب كامل» track memorises everything. Footnotes go under their paragraph as «الحواشي». The end-of-chapter
// exercises («مناقشة») are left out.
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
// empty chapters (a title alone) go. A long chapter is one long review block, so one over MAX paragraphs is cut at its
// #### sub-headings into parts of at least MIN paragraphs, each titled by its first sub-heading
const MAX = 24, MIN = 6, CH = [];
for (const c of chapters.filter(c => c.units.length)) {
  if (c.units.length <= MAX) { CH.push(c); continue }
  let part = null; const parts = [];
  c.units.forEach((u, i) => {
    if (!part || (u.head && part.units.length >= MIN && c.units.length - i >= MIN)) {
      part = { ...c, title: part ? u.head : c.title, sup: part ? c.title : c.sup, units: [] }; parts.push(part);
    }
    part.units.push(u);
  });
  parts.forEach((p, k) => { p.id = c.id + (k ? String.fromCharCode(96 + k) : ''); CH.push(p) });
}

/* 3. units: bold -> "matn" segments, the rest -> "ctx" */
const segsOf = t => {
  const out = [];
  t.split(/(\*\*[^*]+\*\*)/).forEach(part => {
    if (!part) return;
    const bold = /^\*\*/.test(part), s = part.replace(/\*\*/g, '');
    if (!s.trim()) return;
    // punctuation alone stays with the segment before it
    if (out.length && /^[\s.،؛:!?…\-ـ)\]»]+$/.test(s)) { out[out.length - 1][1] += s.trim(); return }
    out.push([bold ? 'matn' : 'ctx', s.trim()]);
  });
  return out.filter(([, s]) => s);
};
const sharh = {};
const BOOK = {
  key: 'usul', app: 'mutoon', lsk: 'mutoon_usul_v1', title: 'تهذيب مسار الأصول',
  sub: 'إلى علم أصول فقه الحنفية · أ.د. صلاح محمد أبو الحاج',
  unitWord: 'فقرة', sharhDir: 'data/usul-sharh/', track: 'matn',
  tracks: [
    { k: 'matn', l: 'التعريفات والقواعد', kinds: ['def'], note: 'الكلام الغامق بالكتاب بس (التعريفات والقواعد)، وباقي الفقرة بيضل ظاهر للقراءة.' },
    { k: 'full', l: 'الكتاب كامل', note: 'كل فقرات الكتاب، كلمة كلمة.' },
  ],
  chapters: CH.map(c => {
    const units = c.units.map((u, i) => {
      const id = c.id + '_' + (i + 1), segs = segsOf(u.t);
      if (u.notes.length) sharh[c.id] = Object.assign(sharh[c.id] || {}, { [id]: { title: 'الحواشي', foot: '', secs: [{ src: 'حواشي الكتاب', ref: 'ص ' + ar(u.page + 2), url: '', text: u.notes.join('\n\n') }] } });
      return { id, kind: segs.some(s => s[0] === 'matn') ? 'def' : 'text', label: c.title + ' · الفقرة ' + ar(i + 1), segs };
    });
    const o = { id: c.id, title: c.title, group: c.group, units };
    if (c.sup && c.sup !== c.title) o.sup = c.sup;
    return o;
  }),
};

fs.writeFileSync(path.join(root, 'data/usul.js'), '// Generated by tools/build-usul.js from tools/texts/usul/pages — edit the pages, not this file\nwindow.BOOK=' + JSON.stringify(BOOK) + ';\n');
const sd = path.join(root, 'data/usul-sharh'); fs.mkdirSync(sd, { recursive: true });
for (const f of fs.readdirSync(sd)) fs.unlinkSync(path.join(sd, f));
for (const [cid, j] of Object.entries(sharh)) fs.writeFileSync(path.join(sd, cid + '.json'), JSON.stringify(j));
const n = BOOK.chapters.reduce((a, c) => a + c.units.length, 0), d = BOOK.chapters.reduce((a, c) => a + c.units.filter(u => u.kind === 'def').length, 0);
const w = BOOK.chapters.reduce((a, c) => a + c.units.reduce((b, u) => b + u.segs.filter(s => s[0] === 'matn').reduce((x, s) => x + s[1].split(/\s+/).length, 0), 0), 0);
console.log(`${BOOK.chapters.length} chapters, ${n} paragraphs, ${d} with definitions (${w} words to memorise in the matn track), ${Object.keys(sharh).length} footnote files`);
