import MandalaMark from './MandalaMark'

/**
 * Pemisah antar-section: garis rambut dengan motif kecil di tengah.
 * Satu dari empat tempat motif mandala boleh muncul.
 */
export default function Divider({ tone = 'ink' }) {
  const line = tone === 'invert' ? 'bg-ivory/15' : 'bg-line'
  const mark = tone === 'invert' ? 'text-accent-invert/60' : 'text-gold/40'

  return (
    <div className="shell" aria-hidden="true">
      <div className="flex items-center gap-6">
        <span className={`h-px flex-1 ${line}`} />
        <MandalaMark className={`h-5 w-5 ${mark}`} strokeWidth={2} />
        <span className={`h-px flex-1 ${line}`} />
      </div>
    </div>
  )
}
