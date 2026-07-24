import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ title, children, onClose, size = 'md' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[85vh] w-full overflow-y-auto bg-ivory p-8 ${widths[size]}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-light text-ink">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-ink/40 transition-colors hover:text-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  )
}
