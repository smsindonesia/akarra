/**
 * Ikon garis minimalis (viewBox 24x24, stroke currentColor) yang senada
 * dengan gaya ikon lain di situs (Navbar, MobileDrawer, Modal). Dipakai
 * untuk mengganti kotak solid polos yang sebelumnya jadi placeholder ikon
 * di ValueCard, ServiceCard, dan kartu-kartu sejenis.
 */
const paths = {
  star: (
    <path d="M12 2.5l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9l-5.6 2.7 1.4-6.3L3 9l6.4-.6L12 2.5z" />
  ),
  shield: <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />,
  spark: <path d="M12 3c0 3.5-1 5.5-3 6.5 2 1 3 3 3 6.5 0-3.5 1-5.5 3-6.5-2-1-3-3-3-6.5z" />,
  gem: (
    <>
      <path d="M7 3h10l4 6-9 12L3 9l4-6z" />
      <path d="M3 9h18M9 3l3 6 3-6M9 9l3 12 3-12" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  thread: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M7.6 7.4L20 19M7.6 16.6L20 5" />
    </>
  ),
  brush: (
    <>
      <path d="M15 4l5 5-9 9H6v-5l9-9z" />
      <path d="M13 6l5 5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6l-5.3 9.2A2 2 0 006.4 21h11.2a2 2 0 001.7-3l-5.3-9V3" />
      <path d="M8 15h8" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="6" r="1.8" />
      <circle cx="18" cy="6" r="1.8" />
      <circle cx="12" cy="18" r="1.8" />
      <path d="M7.5 7L12 16M16.5 7L12 16M7.8 6h8.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 3 2.5 13 0 16M12 4c-2.5 3-2.5 13 0 16" />
    </>
  ),
  trending: (
    <>
      <path d="M4 17l5.5-6 4 3L20 6" />
      <path d="M15 6h5v5" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8a2 2 0 012-2h1.5l1.2-2h4.6l1.2 2H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </>
  ),
  quote: (
    <>
      <path d="M4 8h5v5c0 2.8-1.9 4.7-4.7 4.7V15.2c1.3 0 2.2-.9 2.2-2.2H4V8z" />
      <path d="M13 8h5v5c0 2.8-1.9 4.7-4.7 4.7V15.2c1.3 0 2.2-.9 2.2-2.2H13V8z" />
    </>
  ),
  mark: <path d="M12 3l7 9-7 9-7-9 7-9z" />,
}

export default function Icon({ name = 'mark', className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      {paths[name] ?? paths.mark}
    </svg>
  )
}

const KEYWORD_ICONS = [
  [['excellence', 'keunggulan'], 'star'],
  [['integrity', 'integritas', 'trust', 'kepercayaan'], 'shield'],
  [['innovation', 'inovasi', 'energi', 'energy', 'dinamisme'], 'spark'],
  [['elegance', 'elegansi', 'berlian', 'diamond', 'kemewahan'], 'gem'],
  [['mandala', 'harmoni', 'collaboration', 'kolaborasi'], 'orbit'],
  [['fashion', 'atelier', 'textile', 'tekstil', 'pakaian'], 'thread'],
  [['creative', 'kreatif', 'art direction', 'desain', 'design'], 'brush'],
  [['material', 'bio', 'lab'], 'flask'],
  [['cognitive', 'data'], 'network'],
  [['omnichannel', 'global'], 'globe'],
  [['growth', 'conversion', 'trending'], 'trending'],
  [['content production', 'visual', 'camera'], 'camera'],
  [['strategic', 'advoca', 'advertising', 'periklanan'], 'target'],
]

export function pickIcon(text) {
  const value = (text ?? '').toLowerCase()

  for (const [keywords, icon] of KEYWORD_ICONS) {
    if (keywords.some((keyword) => value.includes(keyword))) return icon
  }

  return 'mark'
}
