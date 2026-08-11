import Button from '../atoms/Button'
import SectionHead from '../molecules/SectionHead'

/**
 * "The Services Ecosystem" — tiga pilar dalam satu kotak bergaris, dipisah
 * border-r, nomor ghost besar sebagai penanda urutan, daftar berpoin.
 * Berbeda dari ServiceCard (yang dipakai untuk kartu ringkasan bertaut).
 */
function Pillar({ index, name, bullets = [], last }) {
  return (
    <div className={`p-10 md:p-12 ${last ? '' : 'border-b border-line md:border-b-0 md:border-r'}`}>
      <span className="block font-display text-5xl font-light leading-none text-gold/10">
        {String(index + 1).padStart(2, '0')}
      </span>

      <h3 className="mt-6 pt-6 font-display text-2xl font-medium leading-tight text-ink">{name}</h3>

      <ul className="mt-6 space-y-4">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-3">
            <span className="size-1.5 shrink-0 rounded-full bg-gold/40" aria-hidden="true" />
            <span className="text-[15px] text-body">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ServicesEcosystem({ eyebrow, title, subtitle, pillars = [], ctaLabel }) {
  return (
    <section id="layanan" className="section">
      <div className="shell">
        <SectionHead title={title} body={subtitle} align="center" eyebrow={eyebrow} />

        <div className="mt-16 grid border border-line md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Pillar
              key={pillar.name}
              index={index}
              name={pillar.name}
              bullets={pillar.bullets}
              last={index === pillars.length - 1}
            />
          ))}
        </div>

        {ctaLabel && (
          <div className="mt-16 flex justify-center">
            <Button to={route('services')} variant="quiet">
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
