import { useEffect } from 'react'

import Button from '../atoms/Button'
import Logo from '../atoms/Logo'
import MandalaMark from '../atoms/MandalaMark'
import NavLinks from './NavLinks'

export default function MobileDrawer({ open, onClose, items, ctaLabel }) {
  // Mengunci scroll halaman selama laci terbuka, dan menutup dengan Escape.
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dark text-ivory md:hidden">
      <div className="flex items-center justify-between px-6 py-6">
        <Logo tone="invert" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu"
          className="grid h-11 w-11 place-items-center text-ivory/70 transition-colors hover:text-gold"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-8 px-6">
        <div className="flex flex-col gap-8">
          <NavLinks items={items} tone="invert" onNavigate={onClose} />
        </div>

        <Button to="/#kolaborasi" variant="outlineInvert" onClick={onClose} className="mt-4 self-start">
          {ctaLabel}
        </Button>
      </nav>

      <MandalaMark
        className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 text-gold/10"
        strokeWidth={0.6}
      />
    </div>
  )
}
