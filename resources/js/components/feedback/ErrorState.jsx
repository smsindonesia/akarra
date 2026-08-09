import { useLanguage } from '../../context/LanguageContext'

export default function ErrorState({ message, onRetry }) {
  const { t } = useLanguage()

  return (
    <div className="shell py-24 text-center">
      <p className="text-[15px] text-ink/70">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold"
        >
          {t('tryAgain')}
        </button>
      )}
    </div>
  )
}
