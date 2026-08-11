import { useEffect, useState } from 'react'

import Button from '../atoms/Button'
import LanguageToggle from '../atoms/LanguageToggle'
import Logo from '../atoms/Logo'
import MobileDrawer from '../molecules/MobileDrawer'
import NavLinks from '../molecules/NavLinks'
import { useLanguage } from '../../context/LanguageContext'
import { useContent } from '../../hooks/useContent'

export default function Navbar() {
  const { list, get } = useContent()
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const items = list('global', 'nav')
  const ctaLabel = get('global', 'nav_cta_label', 'Start a Conversation')

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? 'border-b border-line bg-canvas/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="shell flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label={t('mainNavigation')}>
            <NavLinks items={items} />
          </nav>

          <div className="hidden items-center gap-4 lg:flex xl:gap-5">
            <LanguageToggle />
            <Button to={`${route('home')}#kolaborasi`} variant="outline" className="!min-h-0 !gap-1.5 !px-4 !py-2.5 !text-[10px]">
              {ctaLabel}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('openMenu')}
            className="-mr-3 grid h-11 w-11 place-items-center lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 7h18M3 17h18" />
            </svg>
          </button>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        ctaLabel={ctaLabel}
      />
    </>
  )
}
