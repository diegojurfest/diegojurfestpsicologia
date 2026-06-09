#!/bin/bash
# Regenera todos los assets del monograma DJ desde master-sage.png.
# Uso:  bash tools/monogram/build.sh
# Para cambiar el color: editá TEAL en recolor.js y volvé a correr esto.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
PUB="$ROOT/public"

node "$DIR/recolor.cjs"
# favicons en alta calidad (downscale con sips, conserva transparencia)
sips -z 64 64 "$PUB/dj-monograma-teal.png" --out "$PUB/favicon.png"    >/dev/null
sips -z 32 32 "$PUB/dj-monograma-teal.png" --out "$PUB/favicon-32.png" >/dev/null
sips -z 16 16 "$PUB/dj-monograma-teal.png" --out "$PUB/favicon-16.png" >/dev/null
node "$DIR/make-ico.cjs"
echo "OK — assets del monograma regenerados en /public"
