import { useState } from 'react'

import api from '../../lib/api'
import { isValidUploadResponse, validateUploadFile } from '../../lib/upload'

/**
 * Field gambar untuk panel admin: pratinjau, tombol unggah (langsung ke
 * /admin/upload folder=settings), dan tombol hapus. Dipakai baik untuk field
 * gambar tunggal maupun di dalam item terstruktur (lihat MediaListField).
 */
export default function ImageField({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Data lama kadang tersimpan sebagai string literal "null"/"undefined"
  // (bug di seeder/versi sebelumnya) — diperlakukan sebagai kosong di sini
  // supaya tidak dirender sebagai <img src="null"> yang patah.
  const hasValue = Boolean(value) && value !== 'null' && value !== 'undefined'

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
      const { data } = await api.post('/admin/upload', formData)

      // Server yang salah kirim (mis. redirect yang diam-diam diikuti axios
      // setelah masalah otentikasi/ukuran di server dev) bisa membuat request
      // ini "berhasil" tapi isinya bukan JSON unggahan. Kalau dipercaya
      // begitu saja, onChange(undefined) akan membuat key gambar ini hilang
      // total dari data tersimpan (JSON.stringify membuang value undefined).
      if (!isValidUploadResponse(data)) {
        setError('Gagal mengunggah gambar. Coba lagi.')
        return
      }

      onChange(data.url)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengunggah gambar.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="grid aspect-[4/3] w-36 shrink-0 place-items-center overflow-hidden border border-ink/10 bg-sand">
        {hasValue ? (
          <img src={value} alt={label ?? ''} className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-[11px] text-muted">Belum ada gambar</span>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 pt-1">
        <label className="inline-flex w-fit cursor-pointer items-center border-b border-gold/40 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold">
          {uploading ? 'Mengunggah…' : hasValue ? 'Ganti Foto' : 'Unggah Foto'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
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

        {error && <span className="text-[12px] text-gold">{error}</span>}
      </div>
    </div>
  )
}
