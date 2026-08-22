import logo from '../../../images/logo-akarra.png'

/**
 * Elemen signature AKARRA: mark oktagon-mandala resmi.
 *
 * Sengaja hanya muncul di tempat-tempat tertentu sepanjang situs — layar
 * pembuka/loading (Login), latar hero, pemisah antar-section, dan penanda
 * daftar. Kelangkaan inilah yang membuatnya terbaca sebagai tanda tangan,
 * bukan hiasan latar.
 */
export default function MandalaMark({ className = '', animated = false }) {
  return (
    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className={`object-contain ${animated ? 'animate-draw-mark' : ''} ${className}`}
    />
  )
}
