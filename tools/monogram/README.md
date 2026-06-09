# Monograma DJ — pipeline de assets

El monograma de la marca vive como **un solo master** (`master-sage.png`, el diseño
aprobado original) y se **recolorea por código** a todos los formatos que usa el sitio.
Así, cambiar el color o regenerar los íconos es trivial y no requiere rediseñar nada.

## Regenerar todo

```bash
bash tools/monogram/build.sh
```

Genera en `/public`:

| Archivo | Uso |
|---|---|
| `dj-monograma-teal.png` | logo del nav (insignia teal, fondo transparente) |
| `dj-monograma-cream.png` | logo del footer (letras crema sobre fondo oscuro) |
| `favicon.png` / `favicon-32.png` / `favicon-16.png` | íconos de pestaña |
| `favicon.ico` | ícono legacy |
| `apple-touch-icon.png` | ícono iOS (opaco, esquinas crema) |

## Cambiar el color

Editá la constante `TEAL` en `recolor.cjs` (hoy `#0F6E56`) y volvé a correr `build.sh`.
El script remapea el eje sage→cream del master hacia (nuevo color)→cream **conservando
exactamente las formas de letra y el suavizado** — no redibuja nada.

## Requisitos
- `pngjs` (devDependency, ya en package.json)
- `sips` (incluido en macOS) para los downscales de favicon
