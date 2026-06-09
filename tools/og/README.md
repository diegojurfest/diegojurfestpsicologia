# OG image — previsualización al compartir el link

Imagen 1200×630 que se ve al pegar el link en WhatsApp / redes / buscadores.

El **diseño está congelado** en `og-base.png` (la versión clara aprobada: eyebrow con
hoja, "Lic. Diego Jurfest", monograma, etc.). Solo se **reemplaza la foto** de la
derecha por el retrato actual — NO se rediseña.

## Regenerar
```bash
bash tools/og/build.sh   # → public/og-image.jpg
```
Toma `src/assets/diego-hero.jpg`, la compone sobre `og-base.png` con fundido suave y
re-pone el monograma crema arriba a la derecha.

## Cambiar la foto
Actualizá `src/assets/diego-hero.jpg` y corré `build.sh`.

## Ajustar encuadre/posición de la foto
Editá las constantes arriba de `swap-photo.cjs` (REGION_X, REGION_W, FADE, BIAS_Y…).

## Cambiar el diseño (texto, colores, layout)
Eso vive en `og-base.png` (imagen). Para rehacerlo habría que editar esa base en un
editor de imágenes; el script solo cambia la foto.

## Requisitos
- `pngjs` (devDependency) · `sips` (macOS)
