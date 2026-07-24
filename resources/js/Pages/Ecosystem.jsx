import { Head } from '@inertiajs/react'

import Divider from '../components/atoms/Divider'
import NarrativeSplit from '../components/organisms/NarrativeSplit'
import PageHero from '../components/organisms/PageHero'
import SectionHead from '../components/molecules/SectionHead'
import StatementBlock from '../components/organisms/StatementBlock'
import Paragraph from '../components/atoms/Paragraph'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'

function ValueGrid({ items }) {
  const ref = useReveal()

  if (items.length === 0) return null

  return (
    <div ref={ref} className="reveal mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.name ?? item.title} className="border-t border-ink/10 pt-6">
          <h3 className="font-display text-2xl font-light">{item.name ?? item.title}</h3>

          {item.label && (
            <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {item.label}
            </span>
          )}

          <Paragraph className="mt-4">{item.body}</Paragraph>
        </div>
      ))}
    </div>
  )
}

export default function Ecosystem() {
  const { get, list } = useContent()

  return (
    <>
      <Head title={`Ecosystem — ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('ecosystem', 'hero_subtitle')} />
      </Head>

      <PageHero
        title={get('ecosystem', 'hero_title')}
        emphasis={get('ecosystem', 'hero_title_emphasis')}
        subtitle={get('ecosystem', 'hero_subtitle')}
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

      <section className="section bg-ivory">
        <div className="shell">
          <SectionHead
            eyebrow="Filosofi"
            title={get('ecosystem', 'philosophy_title')}
            body={get('ecosystem', 'philosophy_body')}
          />
          <ValueGrid items={list('ecosystem', 'philosophy_items')} />
        </div>
      </section>

      <NarrativeSplit
        eyebrow="Standar"
        title={get('ecosystem', 'standard_title')}
        body={get('ecosystem', 'standard_body')}
        image={get('ecosystem', 'standard_image')}
      />

      <section className="section pt-0">
        <div className="shell">
          <SectionHead eyebrow="Nilai" title="Lima nilai yang kami pegang" />
          <ValueGrid items={list('ecosystem', 'values')} />
        </div>
      </section>

      <StatementBlock
        eyebrow="Visi & Misi"
        title={get('ecosystem', 'vision_title')}
        body={get('ecosystem', 'vision_body')}
        items={list('ecosystem', 'mission')}
      />
    </>
  )
}

Ecosystem.layout = (page) => <PublicLayout>{page}</PublicLayout>
