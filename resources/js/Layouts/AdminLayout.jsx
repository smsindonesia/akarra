import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'

import MandalaMark from '../components/atoms/MandalaMark'

const links = [
  { href: '/admin', label: 'Dashboard', end: true },
  { href: '/admin/articles', label: 'Artikel' },
  { href: '/admin/categories', label: 'Kategori' },
  { href: '/admin/contacts', label: 'Pesan Masuk' },
  { href: '/admin/settings', label: 'Pengaturan' },
  { href: '/admin/integrations', label: 'Integrasi' },
]

function SidebarContent({ url, onNavigate }) {
  return (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <MandalaMark className="h-8 w-8 text-gold" strokeWidth={1.3} />
        <span className="font-display text-lg tracking-wide text-ivory">Akarra Admin</span>
      </div>

      <div className="flex-1 space-y-1 py-2">
        {links.map((link) => {
          const isActive = link.end ? url === link.href : url.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`block border-l-2 px-5 py-3 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors ${
                isActive
                  ? 'border-gold bg-ink text-ivory'
                  : 'border-transparent text-ivory/60 hover:border-gold/50 hover:text-ivory'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
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
