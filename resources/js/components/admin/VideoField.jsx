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
    <div className="flex items-start gap-4">
      <div className="grid aspect-[4/3] w-48 shrink-0 place-items-center overflow-hidden border border-ink/10 bg-sand">
        {hasValue ? (
          <video src={value} controls className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-[11px] text-muted">Belum ada video</span>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 pt-1">
        <label className="inline-flex w-fit cursor-pointer items-center border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold">
          {uploading ? 'Mengunggah…' : hasValue ? 'Ganti Video' : 'Unggah Video'}
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
            className="text-[11px] uppercase tracking-[0.1em] text-ink/50 hover:text-gold hover:underline"
          >
            Hapus
          </button>
        )}

        <span className="text-[11px] text-muted">MP4, WEBM, atau MOV. Maks. 50 MB.</span>

        {error && <span className="text-[12px] text-gold">{error}</span>}
      </div>
    </div>
  )
}
