#!/bin/bash
# Regenera la og-image (preview al compartir) MANTENIENDO el diseño original
# (og-base.png) y reemplazando solo la foto por src/assets/diego-hero.jpg.
# Uso: bash tools/og/build.sh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
sips -s format png "$ROOT/src/assets/diego-hero.jpg" --out /tmp/og-photo.png >/dev/null 2>&1
node "$DIR/swap-photo.cjs"
sips -s format jpeg -s formatOptions 80 /tmp/og-built.png --out "$ROOT/public/og-image.jpg" >/dev/null 2>&1
echo "OK — public/og-image.jpg generado"
