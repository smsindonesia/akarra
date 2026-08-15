import ClosingCta from '../components/organisms/ClosingCta'
import Divider from '../components/atoms/Divider'
import FounderCard from '../components/molecules/FounderCard'
import Icon from '../components/atoms/Icon'
import PageHero from '../components/organisms/PageHero'
import Seo from '../components/atoms/Seo'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'
import { breadcrumbJsonLd } from '../lib/seo'

function PullQuote({ children }) {
  const ref = useReveal()

  if (!children) return null

  return (
    <section className="section">
      <blockquote ref={ref} className="reveal shell flex flex-col items-center gap-6 text-center">
        <Icon name="quote" className="h-7 w-7 text-gold" />
        <p className="mx-auto max-w-3xl font-display text-3xl font-normal leading-[1.35] md:text-4xl">
          “{children}”
        </p>
      </blockquote>
    </section>
  )
}

export default function Founders({ canonicalUrl }) {
  const { get, list } = useContent()

  const people = list('founders', 'people')

  return (
    <>
      <Seo
        title="Founders"
        description={get('founders', 'hero_subtitle')}
        canonicalUrl={canonicalUrl}
        jsonLd={breadcrumbJsonLd([
          { name: get('global', 'site_name', 'AKARRA'), url: route('home') },
          { name: 'Founders', url: canonicalUrl },
        ])}
      />

      <PageHero
        eyebrow={get('founders', 'hero_eyebrow', 'Architects of Value')}
        title={get('founders', 'hero_title')}
        emphasis={get('founders', 'hero_title_emphasis')}
        subtitle={get('founders', 'hero_subtitle')}
      />

      {people[0] && (
        <section className="section pt-0">
          <div className="shell">
            <FounderCard
              {...people[0]}
              quote={people[0].quote}
              legacyTitle={people[0].legacy_body ? 'Building Legacies' : null}
              legacyBody={people[0].legacy_body}
            />
          </div>
        </section>
      )}

      <PullQuote>{get('founders', 'quote')}</PullQuote>

      {people[1] && (
        <section className="section pt-0">
          <div className="shell">
            <FounderCard
              {...people[1]}
              reverse
              quote={people[1].quote}
              legacyTitle={people[1].legacy_body ? 'Building Legacies' : null}
              legacyBody={people[1].legacy_body}
            />
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
        secondaryLabel={get('founders', 'cta_secondary_label')}
        secondaryTo={route('ecosystem')}
      />
    </>
  )
}

Founders.layout = (page) => <PublicLayout>{page}</PublicLayout>
