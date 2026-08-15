import ArticlesPreview from '../components/organisms/ArticlesPreview'
import CollaborationForm from '../components/organisms/CollaborationForm'
import GalleryPreview from '../components/organisms/GalleryPreview'
import NarrativeSplit from '../components/organisms/NarrativeSplit'
import PageHero from '../components/organisms/PageHero'
import ServicesEcosystem from '../components/organisms/ServicesEcosystem'
import SolutionsGrid from '../components/organisms/SolutionsGrid'
import StoryFeature from '../components/organisms/StoryFeature'
import ValuesGrid from '../components/organisms/ValuesGrid'
import Seo from '../components/atoms/Seo'
import PublicLayout from '../Layouts/PublicLayout'
import { useContent } from '../hooks/useContent'

/**
 * Beranda berperan sebagai etalase: tiap section adalah pintu ke satu halaman
 * dalam, dan seluruhnya bermuara pada formulir di bagian akhir.
 *
 * CTA sengaja tidak diulang di antara section. Satu formulir di akhir plus
 * tombol di navbar sudah cukup — pengulangan merusak ketenangan yang jadi
 * sumber kesan mewah di desain ini.
 */
export default function Home({ latestArticles = [], canonicalUrl }) {
  const { get, list } = useContent()

  const solutions = list('home', 'solutions')
  const pillars = list('services', 'pillars')
  const values = list('home', 'values')
  const serviceGallery = list('services', 'gallery')

  return (
    <>
      <Seo
        title={get('global', 'tagline')}
        description={get('global', 'description')}
        canonicalUrl={canonicalUrl}
      />

      <PageHero
        variant="landing"
        eyebrow={get('home', 'hero_eyebrow')}
        title={get('home', 'hero_title')}
        emphasis={get('home', 'hero_title_emphasis')}
        subtitle={get('home', 'hero_subtitle')}
        ctaLabel={get('home', 'hero_cta_label')}
        ctaTo={`${route('home')}#kolaborasi`}
        secondaryCtaLabel={get('home', 'hero_secondary_cta_label')}
        secondaryCtaTo={route('ecosystem')}
      />

      <NarrativeSplit
        title={get('home', 'narrative_title')}
        body={get('home', 'narrative_body')}
        image={get('home', 'narrative_image')}
        quote={get('home', 'narrative_quote')}
        quoteAttribution={get('home', 'narrative_quote_attribution')}
        badge={get('home', 'narrative_badge')}
        reverse
      />

      {values.length > 0 && (
        <div className="shell pb-24 md:pb-32">
          <ValuesGrid items={values} columns={4} />
        </div>
      )}

      {solutions.length > 0 && (
        <SolutionsGrid
          title={get('home', 'solutions_title')}
          subtitle={get('home', 'solutions_subtitle')}
          items={solutions}
        />
      )}

      <ServicesEcosystem
        eyebrow={get('home', 'services_eyebrow')}
        title={get('home', 'services_title')}
        subtitle={get('home', 'services_subtitle')}
        pillars={pillars}
        ctaLabel={get('home', 'services_cta_label')}
      />

      <StoryFeature
        title={get('home', 'story_title')}
        body={get('home', 'story_body')}
        image={get('home', 'story_image')}
        video={get('home', 'story_video')}
      />

      <GalleryPreview images={serviceGallery} />

      <ArticlesPreview articles={latestArticles} />

      <CollaborationForm />
    </>
  )
}

Home.layout = (page) => <PublicLayout>{page}</PublicLayout>
