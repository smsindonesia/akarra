import { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import RichTextEditor from '../../../components/admin/RichTextEditor'
import Button from '../../../components/atoms/Button'
import Field, { fieldClass } from '../../../components/atoms/Field'
import AdminLayout from '../../../Layouts/AdminLayout'
import api from '../../../lib/api'

/** yyyy-MM-ddThh:mm, format yang dipahami <input type="datetime-local">. */
function toDatetimeLocal(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function ArticleForm({ article, categories }) {
  const isEditing = Boolean(article)

  const [coverUploading, setCoverUploading] = useState(false)
  const [uploadFailure, setUploadFailure] = useState(null)

  const { data, setData, post, put, processing, errors } = useForm({
    title: article?.title ?? '',
    category_id: article?.category?.id ?? '',
    excerpt: article?.excerpt ?? '',
    body: article?.body ?? '',
    cover_image: article?.cover_image ?? '',
    status: article?.status ?? 'draft',
    meta_title: article?.meta_title ?? '',
    meta_description: article?.meta_description ?? '',
    published_at: toDatetimeLocal(article?.published_at),
  })

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setCoverUploading(true)
    setUploadFailure(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'covers')

    try {
      const { data: uploaded } = await api.post('/admin/upload', formData)
      setData('cover_image', uploaded.url)
    } catch {
      setUploadFailure('Gagal mengunggah gambar sampul.')
    } finally {
      setCoverUploading(false)
      event.target.value = ''
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const options = {
      onSuccess: () => {
        if (!isEditing) {
          // Setelah dibuat, controller akan mengarahkan balik ke index;
          // navigasi ke halaman ubah dilakukan lewat redirect server.
        }
      },
    }

    if (isEditing) {
      put(`/admin/articles/${article.slug}`, options)
    } else {
      post('/admin/articles', options)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Head title={isEditing ? 'Ubah Artikel' : 'Artikel Baru'} />

      <h1 className="font-display text-3xl font-light text-ink">{isEditing ? 'Ubah Artikel' : 'Artikel Baru'}</h1>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-8">
        <Field label="Judul" error={errors.title}>
          <input
            type="text"
            className={fieldClass}
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
          />
        </Field>

        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Kategori" error={errors.category_id}>
            <select
              className={fieldClass}
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" error={errors.status}>
            <select className={fieldClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
              <option value="draft">Draf</option>
              <option value="published">Terbit</option>
            </select>
          </Field>
        </div>

        <Field label="Ringkasan (opsional)" error={errors.excerpt}>
          <textarea
            rows={3}
            className={`${fieldClass} resize-none`}
            value={data.excerpt}
            onChange={(e) => setData('excerpt', e.target.value)}
          />
        </Field>

        <div>
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Gambar Sampul
          </span>

          {data.cover_image && (
            <img src={data.cover_image} alt="Pratinjau sampul" className="mb-3 h-40 w-full object-cover" />
          )}

          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverUpload} className="text-[13px]" />
          {coverUploading && <p className="mt-2 text-[12px] text-muted">Mengunggah…</p>}
          {uploadFailure && <p className="mt-2 text-[12px] text-gold">{uploadFailure}</p>}
        </div>

        <div>
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Isi Artikel
          </span>
          <RichTextEditor id="article-body" value={data.body} onChange={(value) => setData('body', value)} />
          {errors.body && <span className="mt-2 block text-[13px] text-gold">{errors.body}</span>}
        </div>

        <Field label="Terbit Pada (opsional)" error={errors.published_at}>
          <input
            type="datetime-local"
            className={fieldClass}
            value={data.published_at}
            onChange={(e) => setData('published_at', e.target.value)}
          />
        </Field>

        <fieldset className="grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-2">
          <Field label="Meta Title (SEO, opsional)" error={errors.meta_title}>
            <input
              type="text"
              className={fieldClass}
              value={data.meta_title}
              onChange={(e) => setData('meta_title', e.target.value)}
            />
          </Field>

          <Field label="Meta Description (SEO, opsional)" error={errors.meta_description}>
            <input
              type="text"
              className={fieldClass}
              value={data.meta_description}
              onChange={(e) => setData('meta_description', e.target.value)}
            />
          </Field>
        </fieldset>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="quiet" onClick={() => router.get('/admin/articles')}>
            Batal
          </Button>
          <Button type="submit" variant="solid" disabled={processing} className="disabled:opacity-50">
            {processing ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  )
}

ArticleForm.layout = (page) => <AdminLayout>{page}</AdminLayout>
