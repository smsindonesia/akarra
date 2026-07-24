import { Link } from '@inertiajs/react'

import Logo from '../atoms/Logo'
import SocialLinks from '../molecules/SocialLinks'
import { useContent } from '../../hooks/useContent'

function ContactLine({ label, value, href }) {
  if (!value) return null

  return (
    <li>
      <span className="sr-only">{label}: </span>
      {href ? (
        <a href={href} className="text-ivory/70 transition-colors hover:text-gold">
          {value}
        </a>
      ) : (
        <span className="text-ivory/70">{value}</span>
      )}
    </li>
  )
}

export default function Footer() {
  const { get, list } = useContent()

  const email = get('global', 'email')
  const phone = get('global', 'phone')
  const address = get('global', 'address')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-ivory">
      <div className="shell py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo tone="invert" />
            <p className="measure mt-6 text-[15px] leading-[1.85] text-ivory/60">
              {get('global', 'description')}
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-lite">
              Jelajahi
            </h2>
            <ul className="mt-6 space-y-3">
              {list('global', 'nav').map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="text-[15px] text-ivory/70 transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-lite">
              Kontak
            </h2>

            <ul className="mt-6 space-y-3 text-[15px]">
              <ContactLine label="Alamat" value={address} />
              <ContactLine label="Telepon" value={phone} href={phone ? `tel:${phone}` : null} />
              <ContactLine label="Email" value={email} href={email ? `mailto:${email}` : null} />
              <ContactLine label="Jam operasional" value={get('global', 'office_hours')} />
            </ul>

            <div className="mt-6">
              <SocialLinks items={list('global', 'social')} />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-[11px] uppercase tracking-[0.18em] text-ivory/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {get('global', 'site_name', 'AKARRA')}
          </span>
          <span>{get('global', 'footer_note')}</span>
        </div>
      </div>
    </footer>
  )
}
