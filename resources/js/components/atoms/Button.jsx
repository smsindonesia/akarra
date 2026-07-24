import { Link } from '@inertiajs/react'

/**
 * Tombol garis emas tipis, bukan blok solid.
 *
 * Varian 'solid' disediakan tetapi sebaiknya dipakai maksimal satu kali per
 * halaman — pada CTA penutup. Emas yang terlalu banyak terbaca murah.
 */
const styles = {
  outline:
    'border border-gold/60 text-ink hover:bg-gold hover:text-ivory hover:border-gold',
  outlineMuted:
    'border border-border-muted text-ink hover:bg-ink hover:text-canvas hover:border-ink',
  outlineInvert:
    'border border-ivory/30 text-ivory hover:bg-ivory hover:text-dark hover:border-ivory',
  outlineAccentInvert:
    'border border-accent-invert/60 text-accent-invert hover:bg-accent-invert hover:text-dark hover:border-accent-invert',
  solid: 'bg-gold text-ivory border border-gold hover:bg-transparent hover:text-gold',
  quiet:
    'border-b border-gold/40 text-ink hover:border-gold pb-1 px-0 py-0 min-h-0 hover:bg-transparent',
}

export default function Button({
  children,
  to,
  href,
  variant = 'outline',
  className = '',
  ...props
}) {
  // min-h-11 menjaga target sentuh tetap 44px, batas yang mudah dilanggar
  // oleh tombol bergaris tipis seperti ini.
  const base = `inline-flex items-center justify-center gap-2 min-h-11 px-8 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${styles[variant]} ${className}`

  if (to) {
    return (
      <Link href={to} className={base} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={base} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={base} {...props}>
      {children}
    </button>
  )
}
