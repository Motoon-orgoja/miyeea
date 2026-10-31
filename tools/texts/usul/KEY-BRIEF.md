# Key points of «تهذيب مسار الأصول» for memorization

The book is a long Hanafi usul al-fiqh textbook. A student will not memorize all of it. For each chapter (مطلب) we want
only its **central points**, each one a **complete piece of knowledge** that makes sense on its own when recited:

- a definition (تعريف: لغةً / اصطلاحاً);
- a rule or ruling (حكم، قاعدة، ضابط);
- a classification with its parts (أقسام X ثلاثة: …);
- a list of conditions (شروط);
- a decisive distinction (الفرق بين X وY) or the Hanafi position (المعتمد عند الحنفية).

Leave out:
- evidence and proofs, long examples, historical narrative, attributions and debates;
- anything already said in another chapter.

Keep a short example only when the rule cannot be understood without it.

## Input

`tools/texts/usul/source/<id>.md` is one chapter:
- its title, then its place in the book in parentheses;
- then its paragraphs, numbered `[n]`. `**…**` is the author's bold, which usually marks his definitions and rules and is
  a strong hint for what is central.

## Output

Write `tools/texts/usul/key/<id>.json` with a JSON array, in book order:

```json
[
  {"t": "تعريف العلم", "h": "", "x": ["العلم: نقيض الجهل، وهو معرفة الشيء على ما هو به"], "p": [2]},
  {"t": "معاني الأصل اصطلاحًا", "h": "الأصل", "x": ["واصطلاحاً: وله معان، وهي:", "١. الدَّليل", "٢. الرَّاجح", "٣. المستصحب", "٤. القاعدة"], "p": [5,6,7,8,9]}
]
```

- `t`: a short title in your own words, at most 6 words. It is shown as the label, not memorized.
- `h`: optional. A lead term of at most 5 words, taken from the book's own wording (a heading or the term being defined).
  Use it when the excerpt does not name its subject, e.g. it starts «وهو…» under the heading «الاستدلال بعبارة النص».
  It is shown before the excerpt with a colon: «عبارة النص: وهو اللفظ…». Use `""` if not needed.
- `x`: the excerpt, as one or more pieces. **Every piece must be copied exactly, letter for letter and haraka for haraka,
  from a single paragraph** of the source, with the `**` marks removed. Never paraphrase, never add or change a word,
  and never fix the author's wording.
  - The pieces are shown joined by a space, so pick cut points where the joined text reads as one coherent statement.
    You may cut a piece at any word boundary, and drop a trailing «:» or «،» if the joined text needs it.
  - Use one piece when one sentence says it all.
  - Use several pieces to gather a list whose items sit in consecutive paragraphs, or a definition split by the
    author's own aside. For a definition split by an aside, take only the bold parts if together they read as a whole.
  - Drop footnote numbers, Quran quotations and long parentheticals.
- `p`: the paragraph numbers the pieces come from.

Size:
- Each unit should normally be **8–45 words**, and never more than about 60. Split a long classification into a unit per
  part only when each part has its own definition worth knowing.
- Most chapters need **2–6 units**. A chapter that is only history or discussion may need 0–2: write `[]` if nothing is
  central.
- Across the whole book we aim for roughly 350–450 units, so be selective. Ask yourself: «would a student be examined on
  this?».

## Workflow

1. Read the whole chapter first, then choose.
2. Write the file.
3. Check yourself: every piece must appear verbatim in its paragraph. A validator will reject any piece that does not.

At the end, reply with your chapters, the number of units in each, and any chapter where you were unsure what is central.
