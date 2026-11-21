# Task: check our digital text of the poem «تحفة الطلاب» against a printed edition (scan), word by word

Work dir (all paths absolute):
W = C:/Users/Mahmoud/AppData/Local/Temp/claude/e8f2ade0182db5dc/ed70f31c-400c-4152-809e-627d55458f21/scratchpad/work
P = C:/Users/Mahmoud/AppData/Local/Temp/claude/e8f2ade0182db5dc/ed70f31c-400c-4152-809e-627d55458f21/scratchpad/pdfw

- Our text: W/verses_all.tsv — one verse per line: `g <TAB> printed-number <TAB> first hemistich | second hemistich`.
  g = our global index (1..1946; g 1–16 = unnumbered introduction, then g = printed number + 16).
  It was decoded from «فتح الوهاب شرح تحفة الطلاب» (another edition), partly vocalized.
- The scan: «متن تحفة الطلاب» (ed. يحيى بن محمد الملا, 2003), 267 image pages, fully vocalized, 2 columns per verse (right = first hemistich).
  Render a page to PNG:  `cd P && node spage.mjs 1.6 <page> [<page>…]`  → writes P/scan_<page>.png, then look at it with the Read tool.
  (ignore a crash message printed after the PNG is written). Use scale 2.2 if a word is hard to read.
  Rough position: g ≈ 17 is on scan page ~26–27; about 8–9 verses per page (fewer on pages with footnotes). Find your start page by probing.

For every verse in your range:
1. Compare the WORDS (consonant skeleton) of ours with the scan, ignoring harakat, tatweel and punctuation. Report every real difference:
   a different/missing/extra word or letter, different hamza seat, ة vs ه, ى vs ي, ض vs ظ, etc. Do NOT report harakat-only differences.
2. Report verses that are in the scan but not in ours (with their text as printed, with the scan's harakat), or in ours but not in the scan, or in a different order.
3. Record every heading printed in the scan (كتاب/باب/فصل/خاتمة…) exactly as printed (with its harakat) and the g of the first verse after it.
Be careful and literal: you are a copyist, not an editor. If a scan word is unclear, say so instead of guessing.

Write your result as JSON (UTF-8) to W/scan_<RANGE-ID>.json:
{"range":[gFrom,gTo],"pages":[first,last],
 "diffs":[{"g":123,"ours":"word as in ours","scan":"word as printed in scan, with its harakat","note":"optional"}],
 "missing_in_ours":[{"after_g":123,"text":"..."}], "extra_in_ours":[g…], "order":"notes if any",
 "headings":[{"before_g":17,"text":"كِتَابُ الطَّهَارَةِ"}], "unclear":[{"g":..,"note":".."}]}
Then reply with a 3-line summary (count of diffs, missing/extra, anything odd). Do not modify any other file.
