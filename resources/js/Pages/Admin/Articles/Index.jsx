import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'

import Badge from '../../../components/admin/Badge'
import Modal from '../../../components/admin/Modal'
import Button from '../../../components/atoms/Button'
import AdminLayout from '../../../Layouts/AdminLayout'

function DeleteArticleModal({ article, onClose }) {
  const [deleting, setDeleting] = useState(false)

  const destroy = () => {
    setDeleting(true)
    router.delete(`/admin/articles/${article.slug}`, {
      preserveScroll: true,
      onFinish: () => {
        setDeleting(false)
        onClose()
      },
    })
  }

  return (
    <Modal title="Hapus Artikel" onClose={onClose} size="sm">
      <p className="text-[14px] text-ink/80">
        Yakin ingin menghapus artikel <strong>{article.title}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="quiet" onClick={onClose}>
          Batal
        </Button>
        <Button
          type="button"
          variant="solid"
          onClick={destroy}
          disabled={deleting}
          className="disabled:opacity-50"
        >
          {deleting ? 'Menghapus…' : 'Hapus'}
        </Button>
      </div>
    </Modal>
  )
}

export default function ArticlesIndex({ articles, categories, filters }) {
  const [deleting, setDeleting] = useState(null)

  const updateFilter = (key, value) => {
    router.get(
      '/admin/articles',
      { ...filters, [key]: value || undefined, page: undefined },
      { preserveState: true, replace: true },
    )
  }

  const goToPage = (page) => {
    router.get('/admin/articles', { ...filters, page }, { preserveState: true })
  }

  return (
    <div>
      <Head title="Artikel" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-light text-ink">Artikel</h1>
        <Button to="/admin/articles/create" variant="solid">
          Artikel Baru
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          defaultValue={filters.search ?? ''}
          placeholder="Cari judul atau ringkasan…"
          onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', e.currentTarget.value)}
          onBlur={(e) => updateFilter('search', e.currentTarget.value)}
          className="min-w-[220px] border-0 border-b border-ink/20 bg-transparent px-0 py-2 text-[14px] text-ink focus:border-gold focus:outline-none"
        />

        <select
          value={filters.status ?? ''}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="border-0 border-b border-ink/20 bg-transparent pl-0 pr-6 py-2 text-[14px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Semua status</option>
          <option value="published">Terbit</option>
          <option value="draft">Draf</option>
        </select>

        <select
          value={filters.category ?? ''}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="border-0 border-b border-ink/20 bg-transparent pl-0 pr-6 py-2 text-[14px] text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Semua kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {articles.data.length === 0 && <p className="text-[14px] text-muted">Tidak ada artikel.</p>}

        {articles.data.length > 0 && (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/15 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                <th className="pb-3">Judul</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Penulis</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {articles.data.map((article) => (
                <tr key={article.id} className="text-[14px] text-ink">
                  <td className="max-w-xs truncate py-3 pr-4">{article.title}</td>
                  <td className="py-3 pr-4 text-muted">{article.category?.name ?? 'Tidak ada'}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={article.status === 'published' ? 'gold' : 'muted'}>
                      {article.status === 'published' ? 'Terbit' : 'Draf'}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted">{article.author?.name ?? 'Tidak ada'}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      className="mr-4 text-[11px] uppercase tracking-[0.1em] text-gold hover:underline"
                    >
                      Ubah
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleting(article)}
                      className="text-[11px] uppercase tracking-[0.1em] text-ink/50 hover:text-gold hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {articles.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between text-[13px] text-muted">
            <span>
              Halaman {articles.current_page} dari {articles.last_page}
            </span>
            <div className="flex gap-3">
              <Button
                variant="quiet"
                onClick={() => goToPage(articles.current_page - 1)}
                disabled={articles.current_page <= 1}
                className="disabled:opacity-30"
              >
                Sebelumnya
              </Button>
              <Button
                variant="quiet"
                onClick={() => goToPage(articles.current_page + 1)}
                disabled={articles.current_page >= articles.last_page}
                className="disabled:opacity-30"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {deleting && <DeleteArticleModal article={deleting} onClose={() => setDeleting(null)} />}
    </div>
  )
}

ArticlesIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
