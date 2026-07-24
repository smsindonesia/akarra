import { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'

import Button from '../../../components/atoms/Button'
import Field, { fieldClass } from '../../../components/atoms/Field'
import Modal from '../../../components/admin/Modal'
import AdminLayout from '../../../Layouts/AdminLayout'

function CategoryFormModal({ category, onClose }) {
  const isEditing = Boolean(category)

  const { data, setData, post, put, processing, errors } = useForm({
    name: category?.name ?? '',
    description: category?.description ?? '',
  })

  const onSubmit = (event) => {
    event.preventDefault()

    const options = { preserveScroll: true, onSuccess: onClose }

    if (isEditing) {
      put(`/admin/categories/${category.slug}`, options)
    } else {
      post('/admin/categories', options)
    }
  }

  return (
    <Modal title={isEditing ? 'Ubah Kategori' : 'Kategori Baru'} onClose={onClose} size="sm">
      <form onSubmit={onSubmit} noValidate className="grid gap-6">
        <Field label="Nama" error={errors.name}>
          <input
            type="text"
            className={fieldClass}
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
        </Field>

        <Field label="Deskripsi (opsional)" error={errors.description}>
          <textarea
            rows={3}
            className={`${fieldClass} resize-none`}
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="quiet" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="solid" disabled={processing} className="disabled:opacity-50">
            {processing ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function DeleteCategoryModal({ category, onClose }) {
  const { delete: destroy, processing, errors } = useForm()

  const submit = () => {
    destroy(`/admin/categories/${category.slug}`, { preserveScroll: true, onSuccess: onClose })
  }

  return (
    <Modal title="Hapus Kategori" onClose={onClose} size="sm">
      <p className="text-[14px] text-ink/80">
        Yakin ingin menghapus kategori <strong>{category.name}</strong>?
      </p>

      {errors.category && (
        <p role="alert" className="mt-4 border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
          {errors.category}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="quiet" onClick={onClose}>
          Batal
        </Button>
        <Button
          type="button"
          variant="solid"
          onClick={submit}
          disabled={processing}
          className="disabled:opacity-50"
        >
          {processing ? 'Menghapus…' : 'Hapus'}
        </Button>
      </div>
    </Modal>
  )
}

export default function CategoriesIndex({ categories }) {
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)

  return (
    <div>
      <Head title="Kategori" />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-light text-ink">Kategori</h1>
        <Button variant="solid" onClick={() => setCreating(true)}>
          Kategori Baru
        </Button>
      </div>

      <div className="mt-8">
        {categories.length === 0 && <p className="text-[14px] text-muted">Belum ada kategori.</p>}

        {categories.length > 0 && (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/15 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                <th className="pb-3">Nama</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3">Artikel</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {categories.map((category) => (
                <tr key={category.id} className="text-[14px] text-ink">
                  <td className="py-3 pr-4">{category.name}</td>
                  <td className="py-3 pr-4 text-muted">{category.slug}</td>
                  <td className="py-3 pr-4">{category.articles_count}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(category)}
                      className="mr-4 text-[11px] uppercase tracking-[0.1em] text-gold hover:underline"
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(category)}
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
      </div>

      {creating && <CategoryFormModal onClose={() => setCreating(false)} />}
      {editing && <CategoryFormModal category={editing} onClose={() => setEditing(null)} />}
      {deleting && <DeleteCategoryModal category={deleting} onClose={() => setDeleting(null)} />}
    </div>
  )
}

CategoriesIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
