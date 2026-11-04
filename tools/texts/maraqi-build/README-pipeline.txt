Order of the pipeline (run from this folder):
node extract-takwin.js ../raw/maraqi/takwin.html takwin.verses.txt
node extract-ko.js ../raw/maraqi/ko-25829.json ko.lines.txt
node ko-into-takwin.js takwin.verses.txt ko.lines.txt base1.txt base1.log
node extract-shamela.js ../raw/maraqi/s283 1 713 nathr.lines.txt   ; cut -f3 nathr.lines.txt | sed 's/([٠-٩0-9]*)//g' > nathr.w.txt
node extract-shamela.js ../raw/maraqi/s20892 1 647 bunud.lines.txt ; cut -f3 bunud.lines.txt > bunud.w.txt
node agree.js base1.txt nathr.w.txt bunud.w.txt base2.txt agree.log review.txt
node apply-fixes.js base2.txt base3.txt            (fixes.js)
strip all marks of base3 -> bare.txt
node ../scripts/merge-harakat.js bare.txt nathr.w.txt h1.txt h1.log N
node ../scripts/merge-harakat.js h1.txt base3.txt h2.txt h2.log ko
node build.js                                       -> ../maraqi.txt
checks: vote.js, verse-vote.js, extra.js, anomalies.js, find.js (fulltext.js makes *.full.txt)
