import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'

import MandalaMark from '../components/atoms/MandalaMark'
import { SETTING_GROUPS, SETTING_GROUP_LABELS } from '../lib/settingGroups'

const links = [
  { href: '/admin', label: 'Dashboard', end: true },
  { href: '/admin/articles', label: 'Artikel' },
  { href: '/admin/categories', label: 'Kategori' },
  { href: '/admin/contacts', label: 'Pesan Masuk' },
  { href: '/admin/integrations', label: 'Integrasi' },
]

const linkClass = (isActive) =>
  `block border-l-2 px-5 py-3 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors ${
    isActive
      ? 'border-gold bg-ink text-ivory'
      : 'border-transparent text-ivory/60 hover:border-gold/50 hover:text-ivory'
  }`

/** Submenu "Pengaturan": tertutup secara default, hanya terbuka lewat klik. */
function SettingsNavItem({ url, onNavigate }) {
  const [open, setOpen] = useState(false)

  const onSettingsPage = url.startsWith('/admin/settings')
  const currentGroup = new URLSearchParams(url.split('?')[1] ?? '').get('group')

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between ${linkClass(onSettingsPage)}`}
      >
        <span>Pengaturan</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          {SETTING_GROUPS.map((group, index) => {
            const isActive = onSettingsPage && (currentGroup === group || (!currentGroup && index === 0))

            return (
              <Link
                key={group}
                href={`/admin/settings?group=${group}`}
                onClick={onNavigate}
                className={`block border-l-2 py-2.5 pl-9 pr-5 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? 'border-gold bg-ink text-gold'
                    : 'border-transparent text-ivory/50 hover:border-gold/50 hover:text-ivory'
                }`}
              >
                {SETTING_GROUP_LABELS[group] ?? group}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ url, onNavigate }) {
  return (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <MandalaMark className="h-8 w-8" />
        <span className="font-display text-lg tracking-wide text-ivory">Akarra Admin</span>
      </div>

      <div className="flex-1 space-y-1 py-2">
        {links.map((link) => {
          const isActive = link.end ? url === link.href : url.startsWith(link.href)

          return (
            <Link key={link.href} href={link.href} onClick={onNavigate} className={linkClass(isActive)}>
              {link.label}
            </Link>
          )
        })}

        <SettingsNavItem url={url} onNavigate={onNavigate} />
      </div>

      <div className="px-5 py-6">
        <Link href="/" className="text-[11px] uppercase tracking-[0.18em] text-ivory/40 hover:text-gold">
          &larr; Lihat situs publik
        </Link>
      </div>
    </nav>
  )
}

export default function AdminLayout({ children }) {
  const { url, props } = usePage()
  const user = props.auth.user
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    router.post('/admin/logout')
  }

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">
        <SidebarContent url={url} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-ink/60 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="h-full w-64 bg-ink" onClick={(e) => e.stopPropagation()}>
            <SidebarContent url={url} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-ink/10 bg-ivory px-6 py-4">
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setMenuOpen(true)}
            className="text-ink lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <span className="hidden text-[13px] text-muted lg:block">Panel Admin</span>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[13px] font-medium text-ink">{user?.name}</p>
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted">{user?.role}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-gold hover:text-gold"
            >
              Keluar
            </button>
          </div>
        </header>

        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
