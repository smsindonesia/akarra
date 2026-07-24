import { Head, Link } from '@inertiajs/react'

import AdminLayout from '../../Layouts/AdminLayout'

function CountCard({ label, value, to }) {
  const content = (
    <div className="border border-ink/10 bg-ivory p-6 transition-colors hover:border-gold/50">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 font-display text-4xl font-light text-ink">{value}</p>
    </div>
  )

  return to ? <Link href={to}>{content}</Link> : content
}

export default function Dashboard({ counts, latestArticles, unreadContacts }) {
  return (
    <div>
      <Head title="Dashboard" />

      <h1 className="font-display text-3xl font-light text-ink">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <CountCard label="Artikel" value={counts.articles} to="/admin/articles" />
        <CountCard label="Terbit" value={counts.published} to="/admin/articles?status=published" />
        <CountCard label="Draf" value={counts.drafts} to="/admin/articles?status=draft" />
        <CountCard label="Kategori" value={counts.categories} to="/admin/categories" />
        <CountCard label="Pesan Masuk" value={counts.contacts} to="/admin/contacts" />
        <CountCard label="Belum Dibaca" value={counts.unread_contacts} to="/admin/contacts?is_read=0" />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink">Artikel Terbaru</h2>
            <Link href="/admin/articles" className="text-[11px] uppercase tracking-[0.14em] text-gold hover:underline">
              Lihat semua
            </Link>
          </div>

          {latestArticles.length === 0 ? (
            <p className="text-[13px] text-muted">Belum ada artikel.</p>
          ) : (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {latestArticles.map((article) => (
                <li key={article.id} className="py-3">
                  <Link href={`/admin/articles/${article.slug}/edit`} className="text-[14px] text-ink hover:text-gold">
                    {article.title}
                  </Link>
                  <p className="mt-1 text-[12px] text-muted">
                    {article.category?.name ?? 'Tanpa kategori'} &middot;{' '}
                    {article.status === 'published' ? 'Terbit' : 'Draf'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink">Pesan Belum Dibaca</h2>
            <Link href="/admin/contacts" className="text-[11px] uppercase tracking-[0.14em] text-gold hover:underline">
              Lihat semua
            </Link>
          </div>

          {unreadContacts.length === 0 ? (
            <p className="text-[13px] text-muted">Tidak ada pesan baru.</p>
          ) : (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {unreadContacts.map((contact) => (
                <li key={contact.id} className="py-3">
                  <Link href="/admin/contacts" className="text-[14px] text-ink hover:text-gold">
                    {contact.name}
                  </Link>
                  <p className="mt-1 truncate text-[12px] text-muted">{contact.subject || contact.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

Dashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>
