import Button from '../atoms/Button'
import AutoSlideGallery from './AutoSlideGallery'
import SectionHead from '../molecules/SectionHead'
import useReveal from '../../hooks/useReveal'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Pratinjau galeri foto kegiatan di beranda — gabungan foto dari pilar
 * Fashionpreneur & Creative Labs (lihat pillar.gallery di /services), supaya
 * pengunjung beranda melihat cuplikannya dan diarahkan ke galeri lengkap.
 */
export default function GalleryPreview({ images = [] }) {
  const ref = useReveal()
  const { t } = useLanguage()

  if (images.length === 0) return null

  return (
    <section className="section">
      <div className="shell">
        <SectionHead title={t('homeGalleryTitle')} align="center" eyebrow={t('homeGalleryEyebrow')} />

        <div ref={ref} className="reveal mx-auto mt-16 max-w-3xl">
          <AutoSlideGallery images={images} alt={t('homeGalleryEyebrow')} ratio="aspect-[16/10]" />
        </div>

        <div className="mt-12 flex justify-center">
          <Button to="/services" variant="quiet">
            {t('homeGalleryCta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
