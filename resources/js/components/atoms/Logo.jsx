import { Link } from '@inertiajs/react'

import logo from '../../../images/logo-akarra.png'
import { useLanguage } from '../../context/LanguageContext'

export default function Logo({ tone = 'ink', className = '' }) {
  const { t } = useLanguage()
  const tones = { ink: 'text-ink', invert: 'text-ivory' }

  return (
    <Link
      href={route('home')}
      className={`flex items-center gap-3 font-display text-xl font-normal uppercase tracking-[0.42em] ${tones[tone]} ${className}`}
      aria-label={t('logoHomeAria')}
    >
      <img src={logo} alt="" className="h-8 w-8 shrink-0" />
      Akarra
    </Link>
  )
}
