#!/bin/bash
# Regenera la imagen de previsualización social (og-image) desde og.html.
# Uso: bash tools/og/build.sh   ·   Requiere Google Chrome instalado.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=8000 \
  --screenshot="$ROOT/public/og-image.png" "file://$DIR/og.html" >/dev/null 2>&1
echo "OK — public/og-image.png regenerado"
