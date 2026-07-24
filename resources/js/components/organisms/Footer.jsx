import { Link } from '@inertiajs/react'

import Logo from '../atoms/Logo'
import SocialLinks from '../molecules/SocialLinks'
import { useContent } from '../../hooks/useContent'

/**
 * Footer terang (bg-canvas), sesuai kelima frame footer di referensi Figma —
 * tidak satu pun memakai latar gelap. Kontak (alamat/telepon/jam) tidak
 * ditampilkan di sini agar sesuai referensi; tetap tersedia lewat email &
 * ikon sosial di baris bawah, dan lewat formulir kolaborasi.
 */
export default function Footer() {
  const { get, list } = useContent()

  const email = get('global', 'email')
  const year = new Date().getFullYear()
  const pillars = [
    { label: 'Fashionpreneur', path: '/services' },
    { label: 'Creative Labs', path: '/services' },
    { label: 'Advertising', path: '/services' },
  ]

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="shell py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="measure mt-6 text-[15px] leading-[1.85] text-muted">
              {get('global', 'description')}
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
              Jelajahi
            </h2>
            <ul className="mt-6 space-y-3">
              {list('global', 'nav').map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="text-[15px] text-muted transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Ekosistem">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
              Ekosistem
            </h2>
            <ul className="mt-6 space-y-3">
              {pillars.map((item) => (
                <li key={item.label}>
                  <Link href={item.path} className="text-[15px] text-muted transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[11px] uppercase tracking-[0.18em] text-muted-soft md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {get('global', 'site_name', 'AKARRA')}. {get('global', 'footer_note')}
          </span>

          <div className="flex items-center gap-6">
            {email && (
              <a href={`mailto:${email}`} className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold">
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
