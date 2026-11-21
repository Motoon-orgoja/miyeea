# Task: match verses of the Hanafi fiqh poem «تحفة الطلاب» to the passages of «مختصر القدوري» that state the same rulings

W = C:/Users/Mahmoud/AppData/Local/Temp/claude/e8f2ade0182db5dc/ed70f31c-400c-4152-809e-627d55458f21/scratchpad/work
- Poem: W/verses_all.tsv — `g <TAB> printed-number <TAB> verse` (g = global index we use). Section headings with their g ranges: W/sections.txt.
  The poem (1946 verses) versifies «بداية المبتدي», whose content overlaps heavily with Qudouri but often in a different order.
- Qudouri: W/qudouri.tsv — `unit-id <TAB> chapter title <TAB> vocalized paragraph` (1900 paragraphs, ids q1_1 … q118_16).

For your verse range, decide for every verse which Qudouri paragraph(s) state the SAME ruling(s), by meaning. Rules:
- A match must really state the ruling(s) of the verse(s). Partial overlap is fine only if the paragraph actually contains the verse's ruling.
- Group consecutive verses that are covered by the same paragraph(s) into one entry. A group may cite several paragraphs.
- If Qudouri does not state the verse's ruling (the poem adds many مسائل from Bidaya/other books), give "units": [] — do NOT force a match.
- Look first in the Qudouri chapters of the same topic, but search the whole file (grep by keywords) when the poem's order differs.
- Do not use any other source for Qudouri. You only output ids; the text will be quoted from the file later.

Write JSON (UTF-8) to W/qud_<RANGE-ID>.json: an array covering EVERY g in your range exactly once, in order:
[{"from":17,"to":18,"units":["q1_2"],"note":"very short reason in Arabic or English"}, {"from":19,"to":19,"units":[],"note":"not in Qudouri"} …]
Then reply with a short summary: verses with / without a parallel, and any chapter where the poem's order differs a lot from Qudouri.
Do not modify any other file.
