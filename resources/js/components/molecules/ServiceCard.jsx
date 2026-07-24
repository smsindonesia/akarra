import { Link } from '@inertiajs/react'

import Paragraph from '../atoms/Paragraph'

/**
 * Kartu layanan bergaris (outline outline-line), ikon kecil di atas, judul,
 * paragraf, tautan terpaku di bawah dengan garis pemisah. Dipakai untuk
 * grid 3-kartu di halaman Ecosystem ("Fashion & Atelier" dst).
 */
export default function ServiceCard({ name, body, linkLabel = 'Selengkapnya', to = '/services' }) {
  return (
    <Link
      href={to}
      className="group flex h-full flex-col justify-between border border-line p-10 transition-colors hover:border-gold/40 md:p-12"
    >
      <div>
        <span className="block h-6 w-6 bg-gold" aria-hidden="true" />

        <h3 className="mt-8 font-display text-2xl font-medium leading-tight text-ink">{name}</h3>

        <Paragraph className="mt-4">{body}</Paragraph>
      </div>

      <span className="mt-8 border-t border-line pt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-gold transition-opacity group-hover:opacity-70">
        {linkLabel}
      </span>
    </Link>
  )
}
