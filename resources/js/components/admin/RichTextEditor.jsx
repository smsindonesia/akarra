import { useEffect, useRef } from 'react'
import 'trix'
import 'trix/dist/trix.css'

import api from '../../lib/api'
import { isValidUploadResponse, validateUploadFile } from '../../lib/upload'

/**
 * Pembungkus React untuk Trix (web component asli, bukan komponen React).
 *
 * Nilai awal dimuat lewat editor.loadHTML begitu tersedia, sekali saja —
 * artikel yang sedang diedit datang dari props Inertia, jadi `value` sering
 * berubah dari '' ke isi sebenarnya setelah trix-editor sudah ter-inisialisasi.
 * Sesudah pemuatan pertama, ketikan pengguna tidak pernah ditimpa lagi.
 */
export default function RichTextEditor({ id, value, onChange }) {
  const trixRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const loadedRef = useRef(false)

  onChangeRef.current = onChange

  useEffect(() => {
    const editorElement = trixRef.current
    if (!editorElement) return undefined

    const handleChange = () => {
      // Begitu pengguna mengetik, tidak ada lagi nilai awal (async) yang perlu
      // dimuat. Tanpa baris ini, efek di bawah bisa menganggap value yang baru
      // saja diketik sebagai "nilai awal yang akhirnya tiba" dan memanggil
      // loadHTML di atas ketikan yang sedang berlangsung, merusak isi editor.
      loadedRef.current = true
      onChangeRef.current(editorElement.innerHTML)
    }

    const handleAttachmentAdd = async (event) => {
      const { attachment } = event
      if (!attachment.file) return

      if (validateUploadFile(attachment.file)) {
        attachment.remove()
        return
      }

      const formData = new FormData()
      formData.append('file', attachment.file)
      formData.append('folder', 'articles')

      try {
        const { data } = await api.post('/admin/upload', formData, {
          onUploadProgress: (progress) => {
            if (progress.total) {
              attachment.setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
            }
          },
        })

        // Jangan percaya bentuk respons begitu saja — lihat komentar di
        // lib/upload.js. Lampiran dengan url undefined lebih baik dibuang
        // daripada menyisipkan referensi gambar yang patah ke isi artikel.
        if (!isValidUploadResponse(data)) {
          attachment.remove()
          return
        }

        attachment.setAttributes({ url: data.url, href: data.url })
      } catch {
        attachment.remove()
      }
    }

    editorElement.addEventListener('trix-change', handleChange)
    editorElement.addEventListener('trix-attachment-add', handleAttachmentAdd)

    return () => {
      editorElement.removeEventListener('trix-change', handleChange)
      editorElement.removeEventListener('trix-attachment-add', handleAttachmentAdd)
    }
  }, [])

  useEffect(() => {
    if (loadedRef.current || !value) return undefined

    const editorElement = trixRef.current
    if (!editorElement) return undefined

    const loadValue = () => {
      editorElement.editor.loadHTML(value)
      loadedRef.current = true
    }

    if (editorElement.editor) {
      loadValue()
      return undefined
    }

    editorElement.addEventListener('trix-initialize', loadValue, { once: true })
    return () => editorElement.removeEventListener('trix-initialize', loadValue)
  }, [value])

  return (
    <div className="admin-trix">
      <input type="hidden" id={id} />
      <trix-editor ref={trixRef} input={id} />
    </div>
  )
}
