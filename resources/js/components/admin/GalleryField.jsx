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
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white">
      <div className="relative grid aspect-square w-full place-items-center overflow-hidden bg-sand/60">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 px-2 text-center text-[12px] text-muted">
            <span className="text-2xl leading-none text-ink/30">+</span>
            Tambah foto
          </span>
        )}

        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 text-[12px] font-medium text-ink">Mengunggah…</div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-2.5 py-2">
        <label className="cursor-pointer text-[12px] font-medium text-gold hover:underline">
          {uploading ? 'Mengunggah…' : src ? 'Ganti' : 'Pilih foto'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {src && (
          <button type="button" onClick={onRemove} className="text-[12px] font-medium text-ink/50 hover:text-red-700">
            Hapus
          </button>
        )}
      </div>

      {error && <span className="block px-2.5 pb-2 text-[12px] text-red-700">{error}</span>}
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
      <p className="mb-2 text-[12px] text-muted">
        {photos.length} dari maks. {MAX_PHOTOS} foto. Menghapus foto akan menggeser foto sesudahnya maju.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
