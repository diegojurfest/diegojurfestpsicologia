// Monograma DJ "puente": dibujado en código con la tipografía real del sitio
// (Cormorant Garamond), no con trazos a mano. Los colores se controlan por CSS
// (.mono-badge / .mono-letters) para que combine perfecto en cada contexto.
export default function Monogram({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="mono-badge" x="1" y="1" width="46" height="46" rx="12" />
      <text
        className="mono-letters"
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="27"
        fontWeight="600"
        letterSpacing="-1.5"
      >DJ</text>
    </svg>
  )
}
