import { useLanguage } from '../../context/LanguageContext'

/**
 * Sakelar bahasa EN/ID, ukuran font disamakan dengan tautan menu
 * (text-[11px] uppercase tracking-[0.18em]) agar menyatu dengan navbar.
 */
export default function LanguageToggle({ tone = 'ink', className = '' }) {
  const { language, setLanguage } = useLanguage()

  const inactive = tone === 'invert' ? 'text-ivory/50' : 'text-ink/50'
  const active = tone === 'invert' ? 'text-ivory' : 'text-ink'
  const divider = tone === 'invert' ? 'text-ivory/30' : 'text-ink/30'

  return (
    <div
      role="group"
      aria-label="Language / Bahasa"
      className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`transition-colors hover:text-gold ${language === 'en' ? active : inactive}`}
      >
        EN
      </button>
      <span className={divider} aria-hidden="true">
        -
      </span>
      <button
        type="button"
        onClick={() => setLanguage('id')}
        aria-pressed={language === 'id'}
        className={`transition-colors hover:text-gold ${language === 'id' ? active : inactive}`}
      >
        ID
      </button>
    </div>
  )
}
