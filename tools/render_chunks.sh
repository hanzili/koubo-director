#!/usr/bin/env bash
# Render the full video in resumable chunks (fresh Chrome per chunk avoids OOM on long timelines), then concat.
#   render_chunks.sh [out.mp4]        env: STEP=1800 CONC=4
# Run from the project root. Re-running skips chunks whose frame count is already complete.
cd "${PWD}"; OUT=${1:-video.mp4}; STEP=${STEP:-1800}; CONC=${CONC:-4}
TOTAL=$(python3 -c "import json;print(int(round(json.load(open('src/data/shots.json'))['total']*24)))")
mkdir -p chunks; : > chunks/list.txt; i=0; a=0; bad=
cnt(){ ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of default=nw=1:nk=1 "$1" 2>/dev/null || echo 0; }
# Bundle once into .render-cache/shared and reuse across all chunks (avoids copying 2GB+ public/ per chunk)
SHARED="$PWD/.render-cache/shared"
rm -rf "$SHARED"
node render.mjs bundle "$SHARED" > chunks/log_bundle.txt 2>&1
export SERVE_URL="$SHARED"
trap 'rm -rf "$SHARED"' EXIT
while (( a < TOTAL )); do
  b=$(( a + STEP - 1 )); (( b >= TOTAL )) && b=$(( TOTAL - 1 )); f=$(printf "chunks/c_%02d.mp4" $i); n=$(( b - a + 1 ))
  have=$(cnt $f)
  if [[ "$have" != "$n" ]]; then
    for try in 1 2 3; do
      node render.mjs video "$PWD/$f" $a $b $CONC > chunks/log_$i.txt 2>&1; have=$(cnt $f)
      [[ "$have" == "$n" ]] && break; echo "chunk $i try $try failed ($have/$n)"; tail -2 chunks/log_$i.txt
    done
  fi
  echo "chunk $i frames $a-$b ok=$have/$n"; echo "file '$PWD/$f'" >> chunks/list.txt
  [[ "$have" == "$n" ]] || bad=1
  a=$(( b + 1 )); i=$(( i + 1 ))
done
# koubo-video: never concat a partial render (11-22 a full /tmp left chunks 1-4 empty and the old script still said ALLDONE)
if [[ -n "$bad" ]]; then echo "INCOMPLETE: some chunks are short, not concatenating"; exit 1; fi
ffmpeg -v error -y -f concat -safe 0 -i chunks/list.txt -c copy "$OUT"
ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets:format=duration -of compact "$OUT"
echo "expected frames $TOTAL"; echo ALLDONE
