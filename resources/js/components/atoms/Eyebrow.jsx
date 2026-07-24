/**
 * Label kecil di atas judul. Uppercase dengan jarak huruf lebar — penanda
 * "editorial" paling hemat dan paling efektif. Ini adalah tone default di
 * seluruh referensi Figma (yellow-800 di atas orange-50 lolos kontras AA).
 */
export default function Eyebrow({ children, className = '', tone = 'gold' }) {
  const tones = {
    muted: 'text-muted',
    gold: 'text-gold',
    ink: 'text-ink/70',
    invert: 'text-accent-invert',
  }

  return (
    <span
      className={`block text-[11px] font-medium uppercase tracking-[0.22em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
