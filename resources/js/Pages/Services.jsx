import { Head } from '@inertiajs/react'

import ClosingCta from '../components/organisms/ClosingCta'
import Display from '../components/atoms/Display'
import Divider from '../components/atoms/Divider'
import Eyebrow from '../components/atoms/Eyebrow'
import Figure from '../components/atoms/Figure'
import PageHero from '../components/organisms/PageHero'
import Paragraph from '../components/atoms/Paragraph'
import SectionHead from '../components/molecules/SectionHead'
import StatementBlock from '../components/organisms/StatementBlock'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'

/**
 * Tiga pilar tampil sebagai section penuh, masing-masing dengan gambar dan
 * daftar layanannya. Bukan accordion — di desain Figma tiap pilar memang
 * diberi ruang bernapas sendiri.
 */
function Pillar({ pillar, index }) {
  const ref = useReveal()
  const reverse = index % 2 === 1

  return (
    <section className="section">
      <div
        ref={ref}
        className={`reveal shell grid gap-12 md:grid-cols-2 md:items-center md:gap-20 ${
          reverse ? 'md:[&>*:first-child]:order-2' : ''
        }`}
      >
        <Figure src={pillar.image} alt={pillar.name} ratio="aspect-[4/5]" />

        <div>
          <Eyebrow>{String(index + 1).padStart(2, '0')} — {pillar.label}</Eyebrow>

          <Display size="md" className="mt-5">
            {pillar.name}
          </Display>

          <Paragraph className="measure mt-6">{pillar.body}</Paragraph>

          {pillar.items?.length > 0 && (
            <ul className="mt-10 space-y-3">
              {pillar.items.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-t border-ink/10 pt-3 text-[15px] text-ink/75"
                >
                  <span className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function WhyList({ title, items }) {
  const ref = useReveal()

  if (items.length === 0) return null

  return (
    <section className="section bg-ivory">
      <div className="shell grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <Display size="md" className="md:sticky md:top-32 md:self-start">
          {title}
        </Display>

        <ol ref={ref} className="reveal">
          {items.map((item, index) => (
            <li key={item.title} className="border-t border-ink/10 py-8 first:border-t-0 first:pt-0">
              <div className="flex gap-6">
                <span className="font-display text-xl font-light text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="font-display text-2xl font-light leading-snug">{item.title}</h3>
                  <Paragraph className="measure mt-3">{item.body}</Paragraph>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Services() {
  const { get, list } = useContent()

  const pillars = list('services', 'pillars')

  return (
    <>
      <Head title={`Services — ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('services', 'hero_subtitle')} />
      </Head>

      <PageHero
        title={get('services', 'hero_title')}
        emphasis={get('services', 'hero_title_emphasis')}
        subtitle={get('services', 'hero_subtitle')}
        image={get('services', 'hero_image')}
      />

      <div className="shell">
        <SectionHead eyebrow="Tiga Pilar" title="Yang kami kerjakan bersama Anda" className="pt-8" />
      </div>

      {pillars.map((pillar, index) => (
        <Pillar key={pillar.name} pillar={pillar} index={index} />
      ))}

      <Divider />

      <StatementBlock
        eyebrow="Growth"
        title={get('services', 'growth_title')}
        body={get('services', 'growth_body')}
      />

      <WhyList title={get('services', 'why_title')} items={list('services', 'why_items')} />

      <ClosingCta
        title={get('services', 'cta_title')}
        subtitle={get('services', 'cta_subtitle')}
        label={get('services', 'cta_label')}
      />
    </>
  )
}

Services.layout = (page) => <PublicLayout>{page}</PublicLayout>
