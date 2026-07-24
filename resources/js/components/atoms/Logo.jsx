import { Link } from '@inertiajs/react'

export default function Logo({ tone = 'ink', className = '' }) {
  const tones = { ink: 'text-ink', invert: 'text-ivory' }

  return (
    <Link
      href="/"
      className={`font-display text-xl font-normal uppercase tracking-[0.42em] ${tones[tone]} ${className}`}
      aria-label="AKARRA, ke beranda"
    >
      Akarra
    </Link>
  )
}
