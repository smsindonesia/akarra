import { Link } from '@inertiajs/react'

import Logo from '../atoms/Logo'
import SocialLinks from '../molecules/SocialLinks'
import { useLanguage } from '../../context/LanguageContext'
import { useContent } from '../../hooks/useContent'

export default function Footer() {
  const { get, list } = useContent()
  const { t } = useLanguage()

  const email = get('global', 'email')
  const year = new Date().getFullYear()
  const pillars = [
    { label: 'Fashionpreneur', path: route('services') },
    { label: 'Creative Labs', path: route('services') },
    { label: 'Advertising', path: route('services') },
  ]

  return (
    <footer className="border-t border-ivory/10 bg-dark">
      <div className="shell py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="invert" />
            <p className="measure mt-6 text-[15px] leading-[1.85] text-ivory-soft">
              {get('global', 'description')}
            </p>
          </div>

          <nav aria-label={t('footerNavigation')}>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-invert">
              {t('explore')}
            </h2>
            <ul className="mt-6 space-y-3">
              {list('global', 'nav').map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="text-[15px] text-ivory-soft transition-colors hover:text-accent-invert">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('ecosystemAria')}>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-invert">
              {t('ecosystemHeading')}
            </h2>
            <ul className="mt-6 space-y-3">
              {pillars.map((item) => (
                <li key={item.label}>
                  <Link href={item.path} className="text-[15px] text-ivory-soft transition-colors hover:text-accent-invert">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-[11px] uppercase tracking-[0.18em] text-ivory-soft/70 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {get('global', 'site_name', 'AKARRA')}. {get('global', 'footer_note')}
          </span>

          <div className="flex items-center gap-6">
            {email && (
              <a href={`mailto:${email}`} className="text-[11px] font-medium uppercase tracking-[0.18em] text-ivory-soft transition-colors hover:text-accent-invert">
                {email}
              </a>
            )}
            <SocialLinks items={list('global', 'social')} />
          </div>
        </div>
      </div>
    </footer>
  )
}
