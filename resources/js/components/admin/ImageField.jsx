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
      const { data } = await api.post(route('admin.upload'), formData)

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
    <div className="max-w-sm">
      <div className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-lg border border-ink/10 bg-sand/60">
        {hasValue ? (
          <img src={value} alt={label ?? ''} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-muted">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-ink/25" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="2" />
              <path d="M21 16l-5-5-9 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[12px]">Belum ada foto</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 text-[12px] font-medium text-ink">Mengunggah…</div>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gold/50 bg-white px-3 py-1.5 text-[12px] font-medium text-gold transition hover:bg-gold hover:text-ivory">
          {uploading ? 'Mengunggah…' : hasValue ? 'Ganti foto' : 'Unggah foto'}
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
            className="rounded-md px-3 py-1.5 text-[12px] font-medium text-ink/60 transition hover:bg-red-50 hover:text-red-700"
          >
            Hapus
          </button>
        )}

        <span className="text-[11px] text-muted">JPG/PNG/WEBP, maks. 2 MB</span>
      </div>

      {error && <p className="mt-1.5 text-[12px] text-red-700">{error}</p>}
    </div>
  )
}
