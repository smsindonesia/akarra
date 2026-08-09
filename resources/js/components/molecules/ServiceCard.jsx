import { Link } from '@inertiajs/react'

import Icon, { pickIcon } from '../atoms/Icon'
import Paragraph from '../atoms/Paragraph'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Kartu layanan bergaris (outline outline-line), ikon kecil di atas, judul,
 * paragraf, tautan terpaku di bawah dengan garis pemisah. Dipakai untuk
 * grid 3-kartu di halaman Ecosystem ("Fashion & Atelier" dst).
 */
export default function ServiceCard({ name, body, linkLabel, to = '/services' }) {
  const { t } = useLanguage()

  return (
    <Link
      href={to}
      className="group flex h-full flex-col items-center justify-between border border-line p-10 text-center transition-colors hover:border-gold/40 md:p-12"
    >
      <div className="flex w-full flex-col items-center">
        <Icon name={pickIcon(name)} className="h-10 w-10 text-gold md:h-12 md:w-12" />

        <h3 className="mt-8 font-display text-2xl font-medium leading-tight text-ink">{name}</h3>

        <Paragraph className="mt-4 w-full">{body}</Paragraph>
      </div>

      <span className="mt-8 border-t border-line pt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-gold transition-opacity group-hover:opacity-70">
        {linkLabel ?? t('learnMore')}
      </span>
    </Link>
  )
}
