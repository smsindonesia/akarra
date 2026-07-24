import { Head } from '@inertiajs/react'

import ClosingCta from '../components/organisms/ClosingCta'
import Divider from '../components/atoms/Divider'
import Figure from '../components/atoms/Figure'
import NarrativeSplit from '../components/organisms/NarrativeSplit'
import PageHero from '../components/organisms/PageHero'
import StatementBlock from '../components/organisms/StatementBlock'
import PublicLayout from '../Layouts/PublicLayout'
import useReveal from '../hooks/useReveal'
import { useContent } from '../hooks/useContent'

function EditorialPair({ images = [], alt }) {
  const ref = useReveal()

  if (images.length === 0) return null

  return (
    <div ref={ref} className="reveal shell grid gap-6 md:grid-cols-2 md:gap-10">
      {images.slice(0, 2).map((src, index) => (
        <Figure
          key={index}
          src={src}
          alt={`${alt} ${index + 1}`}
          ratio={index === 0 ? 'aspect-[3/4]' : 'aspect-[3/4] md:mt-16'}
        />
      ))}
    </div>
  )
}

export default function Products() {
  const { get, list } = useContent()

  return (
    <>
      <Head title={`Products — ${get('global', 'site_name', 'AKARRA')}`}>
        <meta name="description" content={get('products', 'hero_subtitle')} />
      </Head>

      <PageHero
        title={get('products', 'hero_title')}
        emphasis={get('products', 'hero_title_emphasis')}
        subtitle={get('products', 'hero_subtitle')}
      />

      <NarrativeSplit
        eyebrow="01 — Textile"
        title={get('products', 'textile_title')}
        body={get('products', 'textile_body')}
        image={list('products', 'textile_images')[0]}
        imageAlt={get('products', 'textile_title')}
      />

      <EditorialPair
        images={list('products', 'textile_images').slice(1)}
        alt={get('products', 'textile_title')}
      />

      <Divider />

      <NarrativeSplit
        eyebrow="02 — Labs"
        title={get('products', 'labs_title')}
        body={get('products', 'labs_body')}
        image={get('products', 'labs_image')}
        reverse
      />

      <StatementBlock
        eyebrow="03 — Digital"
        title={get('products', 'digital_title')}
        body={get('products', 'digital_body')}
      />

      <ClosingCta
        title={get('products', 'cta_title')}
        subtitle={get('products', 'cta_subtitle')}
        label={get('products', 'cta_label')}
      />
    </>
  )
}

Products.layout = (page) => <PublicLayout>{page}</PublicLayout>
