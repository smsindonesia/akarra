import { useEffect, useState } from 'react'

import SectionHead from '../molecules/SectionHead'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Strip logo klien yang bergeser otomatis tanpa henti (marquee) — beda dari
 * CoverflowGallery (satu foto besar di tengah bergantian): logo kecil dan
 * seragam lebih pas ditampilkan sebagai barisan berjalan.
 *
 * Daftar logo digandakan sekali supaya track sepanjang 200% bisa
 * translateX(-50%) tanpa lompatan saat loop (lihat .animate-marquee di
 * app.css). Kalau prefers-reduced-motion aktif, logo tampil diam satu baris
 * saja — tidak digandakan, tidak berjalan.
 */
export default function ClientsCarousel({ logos = [] }) {
  const { t } = useLanguage()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const items = logos.filter(Boolean)

  if (items.length === 0) return null

  const track = reducedMotion ? items : [...items, ...items]

  return (
    <section className="section">
      <div className="shell">
        <SectionHead title={t('homeClientsTitle')} align="center" eyebrow={t('homeClientsEyebrow')} />
      </div>

      <div
        className="mt-16 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div
          className={
            reducedMotion
              ? 'flex flex-wrap items-center justify-center gap-16'
              : 'animate-marquee flex w-max items-center gap-16 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]'
          }
        >
          {track.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt=""
              loading="lazy"
              className="h-10 w-auto shrink-0 object-contain opacity-50 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 md:h-12"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
