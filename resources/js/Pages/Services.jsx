import { Head } from '@inertiajs/react'

import AutoSlideGallery from '../components/organisms/AutoSlideGallery'
import Button from '../components/atoms/Button'
import ClosingCta from '../components/organisms/ClosingCta'
import Display from '../components/atoms/Display'
import Divider from '../components/atoms/Divider'
import Eyebrow from '../components/atoms/Eyebrow'
import Figure from '../components/atoms/Figure'
import Icon, { pickIcon } from '../components/atoms/Icon'
import PageHero from '../components/organisms/PageHero'
import Paragraph from '../components/atoms/Paragraph'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'

/**
 * Pilar 01/02 tampil sebagai section penuh dengan gambar dan dua sub-kartu
 * berpoin — sesuai referensi ("01 / INFRASTRUCTURE", "02 / IDENTITY").
 */
function Pillar({ pillar, index }) {
  const ref = useReveal()
  const reverse = index % 2 === 1

  return (
    <section className="section">
      <div
        ref={ref}
        className={`reveal shell grid gap-12 md:grid-cols-2 md:items-start md:gap-20 ${
          reverse ? 'md:[&>*:first-child]:order-2' : ''
        }`}
      >
        {pillar.gallery?.length > 0 ? (
          <AutoSlideGallery images={pillar.gallery} alt={pillar.name} ratio="aspect-[4/5]" />
        ) : (
          <Figure src={pillar.image} alt={pillar.name} ratio="aspect-[4/5]" />
        )}

        <div>
          <Eyebrow>{String(index + 1).padStart(2, '0')} / {pillar.label}</Eyebrow>

          <Display size="md" className="mt-5">
            {pillar.name}
          </Display>

          <Paragraph className="measure mt-6">{pillar.body}</Paragraph>

          {pillar.subcards?.length > 0 && (
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {pillar.subcards.map((card) => (
                <div key={card.title}>
                  <h3 className="font-display text-2xl font-medium text-ink">{card.title}</h3>
                  <Paragraph className="mt-2 text-[15px] leading-[1.6]">{card.body}</Paragraph>

                  {card.bullets?.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {card.bullets.map((bullet) => (
                        <li key={bullet} className="text-[12px] font-normal uppercase tracking-[0.12em] text-gold">
                          • {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Button to="/#kolaborasi" variant="solid">
              Inquire for Bespoke Solutions
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyList({ title, items }) {
  const ref = useReveal()

  if (items.length === 0) return null

  return (
    <section className="section bg-canvas">
      <div className="shell grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <Display size="md" className="md:sticky md:top-32 md:self-start">
          {title}
        </Display>

        <ol ref={ref} className="reveal">
          {items.map((item, index) => (
            <li key={item.title} className="border-t border-line py-8 first:border-t-0 first:pt-0">
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

function AmplificationCard({ title, body, bullets = [], featured = false }) {
  return (
    <div className={`flex flex-col items-center border border-ivory/15 p-8 text-center md:p-10 ${featured ? 'bg-ivory/5' : ''}`}>
      <Icon name={pickIcon(title)} className="h-10 w-10 text-accent-invert md:h-12 md:w-12" />
      <h3 className="mt-6 font-display text-2xl font-medium text-ivory">{title}</h3>
      <p className="mt-3 w-full text-[15px] leading-[1.7] text-ivory-soft">{body}</p>

      {bullets.length > 0 && (
        <ul className="mt-6 w-full space-y-3 border-t border-ivory/10 pt-6">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center justify-center gap-2 text-[14px] text-accent-invert/80">
              <span className="h-1.5 w-2 bg-accent-invert/80" aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Services() {
  const { get, list } = useContent()

  const pillars = list('services', 'pillars').slice(0, 2)
  const amplificationCards = list('services', 'amplification_cards')

  return (
    <>
      <Head title={`Services | ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('services', 'hero_subtitle')} />
      </Head>

      <PageHero
        eyebrow={get('services', 'hero_eyebrow', 'Our Capabilities')}
        title={get('services', 'hero_title')}
        emphasis={get('services', 'hero_title_emphasis')}
        subtitle={get('services', 'hero_subtitle')}
        image={get('services', 'hero_image')}
      />

      {pillars.map((pillar, index) => (
        <Pillar key={pillar.name} pillar={pillar} index={index} />
      ))}

      <section className="section bg-dark">
        <div className="shell text-center">
          <Eyebrow tone="invert">03 / Amplification</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-light text-ivory md:text-5xl">
            {get('services', 'growth_title')}
          </h2>
          <Paragraph tone="invert" className="measure mx-auto mt-6">
            {get('services', 'growth_body')}
          </Paragraph>
        </div>

        {amplificationCards.length > 0 && (
          <div className="shell mt-14 grid gap-8 md:grid-cols-3">
            {amplificationCards.map((card, index) => (
              <AmplificationCard
                key={card.title}
                title={card.title}
                body={card.body}
                bullets={card.bullets}
                featured={index === 1}
              />
            ))}
          </div>
        )}

        <div className="shell mt-14 flex justify-center">
          <Button to="/#kolaborasi" variant="outlineAccentInvert">
            Inquire for Bespoke Solutions
          </Button>
        </div>
      </section>

      <Divider />

      <WhyList title={get('services', 'why_title')} items={list('services', 'why_items')} />

      <ClosingCta
        title={get('services', 'cta_title')}
        subtitle={get('services', 'cta_subtitle')}
        label={get('services', 'cta_label')}
        secondaryLabel={get('services', 'cta_secondary_label')}
        secondaryTo="/#kolaborasi"
      />
    </>
  )
}

Services.layout = (page) => <PublicLayout>{page}</PublicLayout>
