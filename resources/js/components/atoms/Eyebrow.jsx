/**
 * Label kecil di atas judul. Uppercase dengan jarak huruf lebar — penanda
 * "editorial" paling hemat dan paling efektif.
 *
 * Warnanya default ke --muted, bukan emas: pada 11px, emas di atas latar
 * terang tidak lolos rasio kontras 4.5:1.
 */
export default function Eyebrow({ children, className = '', tone = 'muted' }) {
  const tones = {
    muted: 'text-muted',
    gold: 'text-gold-lite',
    ink: 'text-ink/70',
  }

  return (
    <span
      className={`block text-[11px] font-medium uppercase tracking-[0.22em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
