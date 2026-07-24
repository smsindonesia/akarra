/**
 * Elemen signature AKARRA: oktagon dengan segitiga di sekelilingnya, diambil
 * dari geometri logo.
 *
 * Sengaja hanya muncul di empat tempat sepanjang situs — layar pembuka, latar
 * hero, pemisah antar-section, dan penanda daftar. Kelangkaan inilah yang
 * membuatnya terbaca sebagai tanda tangan, bukan hiasan latar.
 */
export default function MandalaMark({ className = '', animated = false, strokeWidth = 1 }) {
  const triangles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8
    return (
      <path
        key={i}
        d="M50 4 L57 17 L43 17 Z"
        transform={`rotate(${angle} 50 50)`}
        className={animated ? 'animate-draw-mark' : undefined}
        style={animated ? { animationDelay: `${400 + i * 70}ms` } : undefined}
      />
    )
  })

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="50,22 70,30 78,50 70,70 50,78 30,70 22,50 30,30"
        className={animated ? 'animate-draw-mark' : undefined}
        pathLength="1"
      />
      <polygon
        points="50,32 64,38 70,50 64,62 50,68 36,62 30,50 36,38"
        opacity="0.55"
        className={animated ? 'animate-draw-mark' : undefined}
        pathLength="1"
        style={animated ? { animationDelay: '200ms' } : undefined}
      />
      <g pathLength="1" opacity="0.8">
        {triangles}
      </g>
    </svg>
  )
}
