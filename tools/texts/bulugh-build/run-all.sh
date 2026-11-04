#!/bin/sh
# Rebuilds bulugh.json and every collation output. Run from tools/texts/bulugh-build.
set -e
R=../raw/bulugh
node build.js $R/shamela9111 ../bulugh.json
node collate.js ../bulugh.json $R/openiti/Sham19Y0017757-ara3.txt out/collation-fahl.tsv
node collate.js ../bulugh.json $R/openiti/ShamAY0034283-ara2.txt out/collation-fiqi.tsv
node collate.js ../bulugh.json $R/subul/Shamela0021590.txt out/collation-subul.tsv
node collate.js ../bulugh.json $R/sunnah out/collation-sunnah.tsv
node threeway.js out/collation-fahl.tsv out/collation-fiqi.tsv out/zuhayri-alone.tsv
node table.js out/collation-fahl.tsv out/differences.tsv fiqi=out/collation-fiqi.tsv subul=out/collation-subul.tsv sunnah=out/collation-sunnah.tsv
node vocal.js ../bulugh.json $R/sunnah out/vocal-sunnah.tsv
