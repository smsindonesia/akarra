import { Head } from '@inertiajs/react'

import ClosingCta from '../components/organisms/ClosingCta'
import Divider from '../components/atoms/Divider'
import FounderCard from '../components/molecules/FounderCard'
import PageHero from '../components/organisms/PageHero'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'

function PullQuote({ children }) {
  const ref = useReveal()

  if (!children) return null

  return (
    <section className="section">
      <blockquote ref={ref} className="reveal shell text-center">
        <p className="mx-auto max-w-3xl font-display text-3xl font-light italic leading-[1.35] md:text-4xl">
          “{children}”
        </p>
      </blockquote>
    </section>
  )
}

export default function Founders() {
  const { get, list } = useContent()

  const people = list('founders', 'people')

  return (
    <>
      <Head title={`Founders — ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('founders', 'hero_subtitle')} />
      </Head>

      <PageHero
        title={get('founders', 'hero_title')}
        emphasis={get('founders', 'hero_title_emphasis')}
        subtitle={get('founders', 'hero_subtitle')}
      />

      {people[0] && (
        <section className="section pt-0">
          <div className="shell">
            <FounderCard {...people[0]} />
          </div>
        </section>
      )}

      <PullQuote>{get('founders', 'quote')}</PullQuote>

      {people[1] && (
        <section className="section pt-0">
          <div className="shell">
            <FounderCard {...people[1]} reverse />
          </div>
        </section>
      )}

      {people.length > 2 && (
        <>
          <Divider />
          <section className="section">
            <div className="shell space-y-24">
              {people.slice(2).map((person, index) => (
                <FounderCard key={person.name} {...person} reverse={index % 2 === 1} />
              ))}
            </div>
          </section>
        </>
      )}

      <ClosingCta
        title={get('founders', 'cta_title')}
        subtitle={get('founders', 'cta_subtitle')}
        label={get('founders', 'cta_label')}
      />
    </>
  )
}

Founders.layout = (page) => <PublicLayout>{page}</PublicLayout>
