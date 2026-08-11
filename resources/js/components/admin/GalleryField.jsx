import { useState } from 'react'

import api from '../../lib/api'
import { isValidUploadResponse, validateUploadFile } from '../../lib/upload'

const MAX_PHOTOS = 10

/** Satu slot foto galeri: pratinjau, ganti, hapus — state unggahnya sendiri-sendiri. */
function GallerySlot({ src, onReplace, onRemove }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const sizeError = validateUploadFile(file)
    if (sizeError) {
      setError(sizeError)
      event.target.value = ''
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'settings')

    try {
      const { data } = await api.post(route('admin.upload'), formData)

      if (!isValidUploadResponse(data)) {
        setError('Gagal mengunggah gambar. Coba lagi.')
        return
      }

      onReplace(data.url)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengunggah gambar.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="border border-ink/10 p-3">
      <div className="grid aspect-square w-full place-items-center overflow-hidden bg-sand">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-[11px] text-muted">Belum ada gambar</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="inline-flex w-fit cursor-pointer items-center border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold">
          {uploading ? 'Mengunggah…' : src ? 'Ganti' : 'Unggah'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {src && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[11px] uppercase tracking-[0.1em] text-ink/50 hover:text-gold hover:underline"
          >
            Hapus
          </button>
        )}
      </div>

      {error && <span className="mt-2 block text-[12px] text-gold">{error}</span>}
    </div>
  )
}

/**
 * Editor galeri foto (mis. pillar.gallery): hingga 10 foto, tiap slot punya
 * unggah/ganti/hapus sendiri. Menghapus menggeser slot berikutnya naik
 * (splice pada array), bukan menyisakan slot kosong di tengah.
 */
export default function GalleryField({ value = [], onChange }) {
  const photos = Array.isArray(value) ? value : []

  const replaceAt = (index, url) => {
    const next = photos.slice()
    next[index] = url
    onChange(next)
  }

  const removeAt = (index) => {
    const next = photos.slice()
    next.splice(index, 1)
    onChange(next)
  }

  const addPhoto = (url) => {
    onChange([...photos, url])
  }

  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        Galeri Foto ({photos.length}/{MAX_PHOTOS} foto)
      </span>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((src, i) => (
          <GallerySlot
            key={i}
            src={src}
            onReplace={(url) => replaceAt(i, url)}
            onRemove={() => removeAt(i)}
          />
        ))}

        {photos.length < MAX_PHOTOS && (
          <GallerySlot src={null} onReplace={addPhoto} onRemove={() => {}} />
        )}
      </div>
    </div>
  )
}
