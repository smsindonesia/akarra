import { useState } from 'react'

import api from '../../lib/api'
import { isValidUploadResponse, validateUploadVideoFile } from '../../lib/upload'

/**
 * Field video untuk panel admin: pratinjau bisa diputar, tombol unggah
 * (langsung ke /admin/upload type=video folder=settings), dan tombol hapus.
 * Sepasang dengan ImageField, tapi validasi dan endpoint mengarah ke jalur
 * video di backend (batas ukuran jauh lebih besar dari gambar).
 */
export default function VideoField({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const hasValue = Boolean(value) && value !== 'null' && value !== 'undefined'

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const sizeError = validateUploadVideoFile(file)
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
    formData.append('type', 'video')

    try {
      const { data } = await api.post(route('admin.upload'), formData)

      if (!isValidUploadResponse(data)) {
        setError('Gagal mengunggah video. Coba lagi.')
        return
      }

      onChange(data.url)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengunggah video.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="max-w-sm">
      <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg border border-ink/10 bg-sand/60">
        {hasValue ? (
          <video src={value} controls className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-[12px] text-muted">Belum ada video</span>
        )}

        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 text-[12px] font-medium text-ink">Mengunggah…</div>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-md border border-gold/50 bg-white px-3 py-1.5 text-[12px] font-medium text-gold transition hover:bg-gold hover:text-ivory">
          {uploading ? 'Mengunggah…' : hasValue ? 'Ganti video' : 'Unggah video'}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {hasValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium text-ink/60 transition hover:bg-red-50 hover:text-red-700"
          >
            Hapus
          </button>
        )}

        <span className="text-[11px] text-muted">MP4/WEBM/MOV, maks. 50 MB</span>
      </div>

      {error && <p className="mt-1.5 text-[12px] text-red-700">{error}</p>}
    </div>
  )
}
