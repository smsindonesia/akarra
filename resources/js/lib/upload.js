/**
 * Batas ukuran unggahan gambar, harus sama dengan config('akarra.upload_max_size')
 * (backend/.env UPLOAD_MAX_SIZE, dalam KB). Dicek di sisi klien dulu supaya
 * berkas yang jelas kelebihan ukuran tidak pernah dikirim ke server sama sekali —
 * server dev PHP bawaan (`php artisan serve`) diamati gagal menangani unggahan
 * multipart yang melebihi `upload_max_filesize` PHP dengan bersih: request-nya
 * malah dianggap belum login (redirect ke halaman masuk) alih-alih error
 * validasi biasa, dan axios diam-diam mengikuti redirect itu sehingga
 * `onChange` bisa terpanggil dengan data yang salah bentuk.
 */
export const MAX_UPLOAD_SIZE_KB = 2048
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_KB * 1024

export function validateUploadFile(file) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return `Ukuran gambar melebihi batas ${Math.round(MAX_UPLOAD_SIZE_KB / 1024)} MB.`
  }

  return null
}

/**
 * Server yang bermasalah (redirect, proxy salah konfigurasi, dsb.) bisa
 * membuat axios "berhasil" dengan isi respons yang bukan JSON unggahan yang
 * diharapkan. Jangan pernah percaya bentuknya begitu saja — field seperti
 * `image` di data terstruktur akan diam-diam hilang kalau `onChange`
 * dipanggil dengan `undefined`, karena JSON.stringify membuang key bernilai
 * undefined tanpa peringatan.
 */
export function isValidUploadResponse(data) {
  return Boolean(data) && typeof data === 'object' && typeof data.url === 'string' && data.url.length > 0
}
