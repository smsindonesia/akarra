import MandalaMark from './MandalaMark'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Pembungkus gambar dengan placeholder.
 *
 * Ketika `src` kosong komponen ini menampilkan blok bertekstur dengan motif
 * samar. Tata letak tetap utuh, dan slot gambar yang belum diisi terlihat
 * jelas tanpa merusak tampilan.
 */
export default function Figure({ src, alt = '', ratio = 'aspect-[4/3]', className = '' }) {
  const { t } = useLanguage()

  if (!src) {
    return (
      <div
        className={`${ratio} ${className} grid place-items-center overflow-hidden bg-sand`}
        role="img"
        aria-label={alt || t('imageNotAvailable')}
      >
        <MandalaMark className="h-16 w-16 opacity-25" />
      </div>
    )
  }

  return (
    <div className={`${ratio} ${className} overflow-hidden bg-sand`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-editorial)] hover:scale-[1.03]"
      />
    </div>
  )
}
