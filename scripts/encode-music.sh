#!/usr/bin/env bash
# Builds the lightweight music loops in src/assets/songs from the masters in
# art-source/songs (W14-01). Each loop is LOOP seconds long: the CROSSFADE
# seconds that follow the loop point are blended over the start, so
# `audio.loop = true` wraps without a jump. 96 kbps MP3 plays everywhere.
#
# Usage: scripts/encode-music.sh [LOOP=90] [CROSSFADE=4]
set -euo pipefail

LOOP="${1:-90}"
CROSSFADE="${2:-4}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/art-source/songs"
OUT="$ROOT/src/assets/songs"
mkdir -p "$OUT"

for master in "$SRC"/*.mp3; do
  name="$(basename "$master")"
  ffmpeg -v error -y -i "$master" -filter_complex "
    [0:a]asplit=3[a][b][c];
    [a]atrim=0:${CROSSFADE},asetpts=PTS-STARTPTS,afade=t=in:d=${CROSSFADE}:curve=qsin[head];
    [b]atrim=${LOOP}:$((LOOP + CROSSFADE)),asetpts=PTS-STARTPTS,afade=t=out:d=${CROSSFADE}:curve=qsin[tail];
    [head][tail]amix=inputs=2:normalize=0[seam];
    [c]atrim=${CROSSFADE}:${LOOP},asetpts=PTS-STARTPTS[body];
    [seam][body]concat=n=2:v=0:a=1[out]" \
    -map "[out]" -ac 2 -ar 44100 -c:a libmp3lame -b:a 96k "$OUT/$name"
  echo "$name $(du -k "$OUT/$name" | cut -f1) kB"
done
