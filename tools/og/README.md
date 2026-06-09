# OG image — previsualización al compartir el link

Imagen 1200×630 que se ve al pegar el link en WhatsApp / redes / buscadores.
Se arma desde `og.html` (foto del hero + branding teal) y se renderiza con Chrome headless.

## Regenerar
```bash
bash tools/og/build.sh   # → genera public/og-image.png
```

## Editar
- Texto / diseño / colores → `og.html`
- Cambiar la foto → actualizá la ruta absoluta en `og.html` (`.photo { background-image }`)

## Requisitos
- Google Chrome instalado (se usa su modo headless para el render).
- Las rutas en `og.html` son absolutas (`file:///Users/loop/...`); si se mueve el
  proyecto, ajustá esas rutas.
