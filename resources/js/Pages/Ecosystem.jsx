import { Head } from '@inertiajs/react'

import Divider from '../components/atoms/Divider'
import Eyebrow from '../components/atoms/Eyebrow'
import Figure from '../components/atoms/Figure'
import Icon, { pickIcon } from '../components/atoms/Icon'
import filosofiLogo from '../../images/filosofi-logo.svg'
import Paragraph from '../components/atoms/Paragraph'
import ServiceCard from '../components/molecules/ServiceCard'
import StatItem from '../components/molecules/StatItem'
import PageHero from '../components/organisms/PageHero'
import SectionHead from '../components/molecules/SectionHead'
import StatementBlock from '../components/organisms/StatementBlock'
import ValuesGrid from '../components/organisms/ValuesGrid'
import PublicLayout from '../Layouts/PublicLayout'
import { useContent } from '../hooks/useContent'

const pillarCards = [
  {
    name: 'Fashion & Atelier',
    body: 'Bespoke craftsmanship that transcends seasonal trends. Our atelier focuses on archival quality, utilizing rare textiles and ancestral techniques to redefine modern luxury.',
    linkLabel: 'Explore Atelier',
  },
  {
    name: 'Creative Direction',
    body: 'The visual soul of our ecosystem. We curate environments and narratives that resonate with intellectual depth, ensuring every brand touchpoint is a masterpiece of intent.',
    linkLabel: 'View Portfolio',
  },
  {
    name: 'Strategic Advocacy',
    body: 'High-stakes advertising for the discerning. We deploy precision-engineered campaigns that communicate prestige without volume, reaching the global elite through subtle, impactful resonance.',
    linkLabel: 'Strategic Services',
  },
]

export default function Ecosystem() {
  const { get, list } = useContent()

  return (
    <>
      <Head title={`Ecosystem | ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('ecosystem', 'hero_subtitle')} />
      </Head>

      <PageHero
        eyebrow={get('ecosystem', 'hero_eyebrow', 'The Architecture of Aspiration')}
        title={get('ecosystem', 'hero_title')}
        emphasis={get('ecosystem', 'hero_title_emphasis')}
        subtitle={get('ecosystem', 'hero_subtitle')}
        divider
      />

      <section className="section pt-0">
        <div className="shell">
          <SectionHead
            eyebrow="Cerita Kami"
            title={get('ecosystem', 'story_title')}
            body={get('ecosystem', 'story_body')}
            align="center"
            className="max-w-3xl"
          />
        </div>
      </section>

      <Divider />

      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Filosofi"
            title={get('ecosystem', 'philosophy_title')}
            body={get('ecosystem', 'philosophy_body')}
            align="center"
            className="mx-auto max-w-3xl"
          />
          <div className="mt-12">
            <img
              src={filosofiLogo}
              alt={get('ecosystem', 'philosophy_title')}
              className="mx-auto w-full max-w-3xl"
            />
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-3">
            {pillarCards.map((card) => (
              <ServiceCard key={card.name} name={card.name} body={card.body} linkLabel={card.linkLabel} to="/services" />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <Eyebrow>Ethos &amp; Integrity</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight text-ink md:text-5xl">
              The AKARRA Standard
            </h2>
            <Paragraph className="measure mt-6">{get('ecosystem', 'standard_body')}</Paragraph>

            <div className="mt-10 space-y-6">
              {list('ecosystem', 'values')
                .slice(0, 2)
                .map((value) => (
                  <div key={value.name} className="flex gap-4">
                    <Icon name={pickIcon(value.name)} className="mt-1 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">
                        {value.name}
                      </h3>
                      <Paragraph className="mt-1">{value.body}</Paragraph>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="relative">
            <Figure src={get('ecosystem', 'standard_image')} alt="The AKARRA Standard" ratio="aspect-[4/5]" />

            <div className="absolute -bottom-8 -left-8 hidden max-w-xs bg-gold p-8 md:block">
              <p className="font-display text-2xl font-normal leading-snug text-ivory">
                &ldquo;Precision is the highest form of respect.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <SectionHead eyebrow="Nilai" title="Lima Nilai yang Kami Pegang" />
          <div className="mt-12">
            <ValuesGrid items={list('ecosystem', 'values')} columns={5} />
          </div>
        </div>
      </section>

      <StatementBlock
        eyebrow="Looking Forward"
        title={get('ecosystem', 'vision_title')}
        body={get('ecosystem', 'vision_body')}
        items={list('ecosystem', 'mission')}
      >
        {list('ecosystem', 'stats').length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-ivory/10 pt-8 md:grid-cols-4">
            {list('ecosystem', 'stats').map((stat) => (
              <StatItem key={stat.label} value={stat.value} label={stat.label} tone="invert" align="left" />
            ))}
          </div>
        )}
      </StatementBlock>
    </>
  )
}

Ecosystem.layout = (page) => <PublicLayout>{page}</PublicLayout>
