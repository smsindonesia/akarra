import { Head } from '@inertiajs/react'

import ClosingCta from '../components/organisms/ClosingCta'
import Divider from '../components/atoms/Divider'
import Figure from '../components/atoms/Figure'
import Eyebrow from '../components/atoms/Eyebrow'
import Icon, { pickIcon } from '../components/atoms/Icon'
import Button from '../components/atoms/Button'
import ProductCard from '../components/molecules/ProductCard'
import SectionHead from '../components/molecules/SectionHead'
import PageHero from '../components/organisms/PageHero'
import StatementBlock from '../components/organisms/StatementBlock'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'

function LabsCard({ title, body, large = false }) {
  return (
    <div className={`flex flex-col items-center border border-line/50 bg-sand p-8 text-center md:p-10 ${large ? '' : ''}`}>
      <Icon name={pickIcon(title)} className="h-10 w-10 text-gold md:h-12 md:w-12" />
      <h3 className="mt-6 font-display text-2xl font-normal text-ink">{title}</h3>
      <p className="mt-3 max-w-xs text-[14px] leading-[1.7] text-muted">{body}</p>
    </div>
  )
}

export default function Products() {
  const { get, list } = useContent()
  const ref = useReveal()
  const products = list('products', 'items')
  const labs = list('products', 'labs')
  const whitepaper = get('products', 'whitepaper', {})
  const digitalItems = list('products', 'digital_items')

  return (
    <>
      <Head title={`Products | ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('products', 'hero_subtitle')} />
      </Head>

      <PageHero
        eyebrow={get('products', 'hero_eyebrow', 'Curated Collections')}
        title={get('products', 'hero_title')}
        emphasis={get('products', 'hero_title_emphasis')}
        subtitle={get('products', 'hero_subtitle')}
      />

      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <Eyebrow>Bespoke Collections</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-light leading-tight text-ink md:text-5xl">
                {get('products', 'textile_title')}
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-[1.7] text-muted">
                {get('products', 'textile_body')}
              </p>
            </div>

            <Button to="/services" variant="quiet">
              View Collection
            </Button>
          </div>

          {products.length > 0 && (
            <div ref={ref} className="reveal mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
              {products.slice(0, 2).map((item, index) => (
                <ProductCard
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  image={item.image}
                  tag={item.tag}
                  offset={index === 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Divider />

      {labs.length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionHead eyebrow="Creative Portfolios" title={get('products', 'labs_title')} align="center" />

            <div className="mt-14 grid gap-8">
              <div className="grid gap-8 md:grid-cols-2">
                {labs.map((item) => (
                  <LabsCard key={item.title} title={item.title} body={item.body} />
                ))}
              </div>

              {whitepaper.title && (
                <div className="relative overflow-hidden border border-line/50">
                  <Figure src={whitepaper.image} alt={whitepaper.title} ratio="aspect-[16/9] md:aspect-[21/9]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/40 to-transparent" />

                  <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center gap-2 p-10">
                    <span className="text-[10px] font-normal uppercase tracking-[0.18em] text-gold">
                      {whitepaper.label}
                    </span>
                    <h3 className="font-display text-3xl font-normal text-ink">{whitepaper.title}</h3>
                    <p className="pt-2 text-[15px] leading-[1.6] text-muted">{whitepaper.body}</p>
                    <Button to="/services" variant="quiet" className="mt-4 self-start">
                      View Whitepaper
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <StatementBlock
        eyebrow="Digital Impact"
        title={get('products', 'digital_title')}
        body={get('products', 'digital_body')}
        items={digitalItems}
        numbered
      >
        <div className="mt-10">
          <Button to="/services" variant="solid">
            Scale Your Impact
          </Button>
        </div>
      </StatementBlock>

      <ClosingCta
        tone="light"
        title={get('products', 'cta_title')}
        subtitle={get('products', 'cta_subtitle')}
        label={get('products', 'cta_label')}
        secondaryLabel={get('products', 'cta_secondary_label')}
      />
    </>
  )
}

Products.layout = (page) => <PublicLayout>{page}</PublicLayout>
