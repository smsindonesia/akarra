import { Link } from '@inertiajs/react'

import Paragraph from '../atoms/Paragraph'

export default function ServiceCard({ index, name, label, body, to = '/services' }) {
  return (
    <Link
      href={to}
      className="group flex flex-col border-t border-ink/10 pt-8 transition-colors hover:border-gold"
    >
      {/* Nomor dipakai karena tiga pilar ini memang punya urutan pada company
          profile, bukan sekadar hiasan penanda. */}
      <span className="font-display text-2xl font-light text-gold">
        {String(index + 1).padStart(2, '0')}
      </span>

      <h3 className="mt-6 font-display text-2xl font-light leading-tight text-ink">{name}</h3>

      {label && <span className="mt-2 text-[13px] text-muted">{label}</span>}

      <Paragraph className="mt-4 flex-1">{body}</Paragraph>

      <span className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/50 transition-colors group-hover:text-gold">
        Selengkapnya
      </span>
    </Link>
  )
}
