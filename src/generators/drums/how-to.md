и логику рандомизации я думаю нужно унести как раз рядом с нашими паттернами в папке src/generators/patterns/drums чтобы было четко понятно

node scripts/build-patterns.mjs src/generators/drums/patterns/straight-kick-patterns.txt src/generators/drums/patterns/straight-offbeat-patterns.txt src/generators/drums/patterns/sum/house-like.txt

node scripts/remove-bad-pattern-lines.mjs src/generators/drums/patterns/sum/house-like.txt scripts/only-symmetric-strong-x.ts

node scripts/build-patterns.mjs src/generators/drums/patterns/sum/house-like.txt src/generators/drums/patterns/straight-weak-offbeat-patterns.txt src/generators/drums/patterns/sum/house-like-with-accents.txt

node scripts/build-patterns.mjs src/generators/drums/patterns/straight-kick-fills.txt ----O-------O--- src/generators/drums/patterns/sum/straight-fills.txt

node scripts/build-patterns.mjs src/generators/drums/patterns/straight-weak-offbeat-patterns.txt src/generators/drums/patterns/techno-kicks.txt src/generators/drums/patterns/sum/techno.txt

node scripts/build-patterns.mjs src/generators/drums/patterns/breakbeat-kick-combination.txt src/generators/drums/patterns/breakbeat-offbeats.txt src/generators/drums/patterns/sum/breakbeat.txt --no-x --breakbeat

node scripts/build-patterns.mjs src/generators/drums/patterns/dembow-kicks.txt src/generators/drums/patterns/dembow-offbeats.txt src/generators/drums/patterns/sum/dembow.txt --no-x

node scripts/merge-patterns.mjs src/generators/drums/patterns/sum src/generators/drums/patterns/sum.txt
