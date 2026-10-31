# Transcribing «تهذيب مسار الأصول إلى علم أصول فقه الحنفية» (د. صلاح أبو الحاج)

The goal is a faithful digital text of the book for a memorization app. You get a range of pages. For each page NNN
(three digits, e.g. 041) in this folder:

- `img/pNNN.png`: the page image. **This is the authority.**
- `draft/pNNN.txt`: a rough text pulled from the PDF's text layer. Most letters are right, so use it to speed you up and to
  check what you read. It has known faults:
  - two-letter ligatures sometimes come out reversed or wrongly "repaired" (عىل/على, قلبا for لقبا, بني for بين);
  - stray spaces inside words (الت فريق، إن ه);
  - Quran text is missing and shows as `[قرآن]`;
  - footnote numbers sit on their own lines (`> (1)`);
  - lines starting with `> ` are footnotes, and `**` marks bold.

Read the image of every page, all of it, and write `out/pNNN.md` with exactly what the page says.

## Rules

- Copy the wording exactly: every letter and every haraka the image shows, and no haraka it does not show. Don't correct,
  modernize or vocalize the author. Use Arabic-Indic digits as printed (٢٢٥). Keep punctuation and quotation marks « » as
  printed.
- Quran: copy the verse from the image, with its vocalization and brackets, as `﴿...﴾` followed by the reference as printed,
  e.g. `﴿حَتَّىٰ يَطْهُرْنَ﴾ [البقرة: ٢٢٢]`. Leave out the verse-number circles inside the verse text.
- Honorific glyphs: write ﷺ for «صلى الله عليه وسلم». Write any other glyph as plain words with no brackets, for example
  رضي الله عنه، رضي الله عنها، رضي الله عنهما، عليه السلام، رحمه الله، جل جلاله، عز وجل، سبحانه وتعالى.
- Leave out the page number at the bottom and any running header.

## Format of out/pNNN.md

- **Headings** each go on their own line:
  - `# ` for a باب, a فصل, or a big centered title (مقدمة …);
  - `## ` for a مبحث;
  - `### ` for a مطلب, or a النوع inside a مبحث;
  - `#### ` for a smaller bold line that stands alone as a heading, e.g. `أولاً: من حيث إنه مركب إضافي:`.
  - A multi-line centered title is one heading, with its lines joined by a space.
- **Paragraphs** are separated by one blank line. Join a paragraph's wrapped lines into one line. A numbered or lettered
  point (١. … / أ. …) is its own paragraph.
- **Bold** inside a paragraph is wrapped in `**…**`, exactly where the image shows bold.
- **Footnote reference** in the text is written as `(١)` right after the word, with no space before it.
- **Footnotes** come at the end, after a line `---`, one per line: `(١) نص الحاشية`.
- If the page starts in the middle of a paragraph that began on the previous page, the first line of the file is `@@CONT`.
  If a footnote continues from the previous page's footnote, start that footnote line with `(+)`.
- A page with nothing but a title, or a blank page, is still written (it may hold one heading line, or be empty).

## When you're unsure

If a word is unclear in the image, write your best reading followed by `{?}`. Add a line for it to
`out/doubts_<first>-<last>.txt`, in the form `pNNN | word | why`.

Work page by page, and write each file as soon as that page is done. Don't touch pages outside your range. At the end,
reply with:
- the pages you wrote;
- how many `{?}` doubts there are;
- anything odd about the pages, such as tables, charts, or a page in a different layout. Describe tables with `|`
  Markdown rows in the page file.
