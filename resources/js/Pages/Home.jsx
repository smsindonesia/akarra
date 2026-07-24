import { Head } from '@inertiajs/react'

import Divider from '../components/atoms/Divider'
import CollaborationForm from '../components/organisms/CollaborationForm'
import FoundersPreview from '../components/organisms/FoundersPreview'
import NarrativeSplit from '../components/organisms/NarrativeSplit'
import PageHero from '../components/organisms/PageHero'
import ServicesEcosystem from '../components/organisms/ServicesEcosystem'
import SolutionsGrid from '../components/organisms/SolutionsGrid'
import StatsBar from '../components/organisms/StatsBar'
import StoryFeature from '../components/organisms/StoryFeature'
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
export default function Home() {
  const { get, list } = useContent()

  const solutions = list('home', 'solutions')
  const pillars = list('services', 'pillars')

  return (
    <>
      <Head title={get('global', 'tagline')}>
        <meta name="description" content={get('global', 'description')} />
      </Head>

      <PageHero
        variant="landing"
        eyebrow={get('home', 'hero_eyebrow')}
        title={get('home', 'hero_title')}
        emphasis={get('home', 'hero_title_emphasis')}
        subtitle={get('home', 'hero_subtitle')}
        ctaLabel={get('home', 'hero_cta_label')}
        ctaTo="/#kolaborasi"
      />

      <StatsBar items={list('home', 'stats')} />

      <NarrativeSplit
        eyebrow="Tentang Kami"
        title={get('home', 'narrative_title')}
        body={get('home', 'narrative_body')}
        image={get('home', 'narrative_image')}
        reverse
      />

      <Divider />

      <ServicesEcosystem
        title={get('home', 'services_title')}
        subtitle={get('home', 'services_subtitle')}
        pillars={pillars}
        ctaLabel={get('home', 'services_cta_label')}
      />

      {solutions.length > 0 && (
        <SolutionsGrid
          title={get('home', 'solutions_title')}
          subtitle={get('home', 'solutions_subtitle')}
          items={solutions}
        />
      )}

      <StoryFeature
        title={get('home', 'story_title')}
        body={get('home', 'story_body')}
        image={get('home', 'story_image')}
        ctaLabel={get('home', 'story_cta_label')}
        ctaTo="/ecosystem"
      />

      <FoundersPreview
        title={get('home', 'founders_title')}
        subtitle={get('home', 'founders_subtitle')}
        people={list('founders', 'people')}
      />

      <CollaborationForm />
    </>
  )
}

Home.layout = (page) => <PublicLayout>{page}</PublicLayout>
