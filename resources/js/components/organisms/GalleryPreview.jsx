import Button from '../atoms/Button'
import CoverflowGallery from './CoverflowGallery'
import SectionHead from '../molecules/SectionHead'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Pratinjau galeri foto Services di beranda (satu sumber data dengan galeri
 * lengkap di /services — lihat services.gallery), supaya pengunjung beranda
 * melihat cuplikannya dan diarahkan ke galeri lengkap.
 */
export default function GalleryPreview({ images = [] }) {
  const { t } = useLanguage()

  if (images.length === 0) return null

  return (
    <section className="section">
      <div className="shell">
        <SectionHead title={t('homeGalleryTitle')} align="center" eyebrow={t('homeGalleryEyebrow')} />

        <div className="mx-auto mt-16 max-w-5xl">
          <CoverflowGallery images={images} alt={t('homeGalleryEyebrow')} />
        </div>

        <div className="mt-12 flex justify-center">
          <Button to={route('services')} variant="quiet">
            {t('homeGalleryCta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
