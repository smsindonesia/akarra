import { useEffect, useRef, useState } from 'react'
import { Head, router } from '@inertiajs/react'

import GalleryField from '../../../components/admin/GalleryField'
import ImageField from '../../../components/admin/ImageField'
import VideoField from '../../../components/admin/VideoField'
import MediaListField, { isImageKey, isVideoKey, isGalleryKey, isStructurable } from '../../../components/admin/MediaListField'
import Button from '../../../components/atoms/Button'
import { fieldClass } from '../../../components/atoms/Field'
import AdminLayout from '../../../Layouts/AdminLayout'
import { SETTING_GROUP_LABELS as groupLabels } from '../../../lib/settingGroups'

function classify(value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'integer'
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return 'json'
  return 'string'
}

/** Membangun draft field-field yang bisa disunting untuk satu grup. */
function buildDraft(groupData) {
  const draft = {}

  Object.entries(groupData ?? {}).forEach(([key, value]) => {
    const type = classify(value)
    draft[key] = {
      type,
      value: type === 'json' ? JSON.stringify(value, null, 2) : value,
      error: null,
    }
  })

  return draft
}

/** Merender satu field sesuai bentuk datanya: gambar, JSON terstruktur, atau input biasa. */
function FieldEditor({ fieldKey, field, onUpdate }) {
  const [rawMode, setRawMode] = useState(false)

  if (field.type === 'string' && isImageKey(fieldKey)) {
    return <ImageField value={field.value} onChange={(url) => onUpdate({ value: url })} label={fieldKey} />
  }

  if (field.type === 'string' && isVideoKey(fieldKey)) {
    return <VideoField value={field.value} onChange={(url) => onUpdate({ value: url })} label={fieldKey} />
  }

  if (field.type === 'json' && isGalleryKey(fieldKey)) {
    let photos = []
    try {
      const parsed = JSON.parse(field.value)
      if (Array.isArray(parsed)) photos = parsed
    } catch {
      photos = []
    }

    return (
      <GalleryField
        value={photos}
        onChange={(next) => onUpdate({ value: JSON.stringify(next, null, 2), error: null })}
      />
    )
  }

  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-[14px] text-ink">
        <input
          type="checkbox"
          checked={Boolean(field.value)}
          onChange={(e) => onUpdate({ value: e.target.checked })}
          className="accent-gold"
        />
        Aktif
      </label>
    )
  }

  if (field.type === 'integer') {
    return (
      <input
        type="number"
        value={field.value}
        onChange={(e) => onUpdate({ value: Number(e.target.value) })}
        className={fieldClass}
      />
    )
  }

  if (field.type === 'string') {
    return String(field.value).length > 80 ? (
      <textarea
        rows={3}
        value={field.value}
        onChange={(e) => onUpdate({ value: e.target.value })}
        className={`${fieldClass} resize-none`}
      />
    ) : (
      <input type="text" value={field.value} onChange={(e) => onUpdate({ value: e.target.value })} className={fieldClass} />
    )
  }

  // field.type === 'json' dari sini
  let parsed = null
  try {
    parsed = JSON.parse(field.value)
  } catch {
    parsed = null
  }

  const structured = parsed !== null && isStructurable(parsed)

  if (structured && !rawMode) {
    return (
      <div>
        <MediaListField value={parsed} onChange={(next) => onUpdate({ value: JSON.stringify(next, null, 2), error: null })} />
        <button
          type="button"
          onClick={() => setRawMode(true)}
          className="mt-3 text-[11px] uppercase tracking-[0.1em] text-ink/40 hover:text-gold hover:underline"
        >
          Edit sebagai JSON mentah
        </button>
      </div>
    )
  }

  return (
    <div>
      <textarea
        rows={8}
        value={field.value}
        onChange={(e) => onUpdate({ value: e.target.value })}
        spellCheck={false}
        className={`${fieldClass} font-mono text-[13px] resize-y`}
      />
      {structured && (
        <button
          type="button"
          onClick={() => setRawMode(false)}
          className="mt-3 text-[11px] uppercase tracking-[0.1em] text-ink/40 hover:text-gold hover:underline"
        >
          Kembali ke tampilan terstruktur
        </button>
      )}
    </div>
  )
}

function NewFieldForm({ onAdd }) {
  const [key, setKey] = useState('')
  const [type, setType] = useState('string')

  const submit = (event) => {
    event.preventDefault()
    if (!key.trim()) return

    const defaults = { string: '', integer: 0, boolean: false, json: '[]' }
    onAdd(key.trim(), type, defaults[type])
    setKey('')
    setType('string')
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 border-t border-ink/10 pt-6">
      <div>
        <span className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-muted">Field Baru</span>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="nama_field"
          className={`${fieldClass} w-56`}
        />
      </div>

      <select value={type} onChange={(e) => setType(e.target.value)} className={`${fieldClass} w-32`}>
        <option value="string">Teks</option>
        <option value="integer">Angka</option>
        <option value="boolean">Ya/Tidak</option>
        <option value="json">JSON</option>
      </select>

      <Button type="submit" variant="quiet">
        Tambah Field
      </Button>
    </form>
  )
}

const LOCALES = [
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'English' },
]

export default function SettingsIndex({ settings, activeGroup, activeLocale }) {
  const [draft, setDraft] = useState(() => buildDraft(settings[activeGroup]))
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(null)
  const [saveError, setSaveError] = useState(false)

  // Foto/video ter-upload ke server begitu dipilih (lihat ImageField/VideoField),
  // tapi baru benar-benar melekat ke konten setelah "Simpan" ditekan — draft di
  // React ini murni lokal sampai saat itu. Sudah pernah kejadian: admin
  // mengunggah gambar, pratinjaunya tampil, lalu pindah tab/grup tanpa
  // menyimpan — berkasnya ada di server tapi tidak pernah tersambung ke
  // field manapun. lastSavedDraft menjadi acuan "tersimpan" supaya kita bisa
  // mendeteksi dan memperingatkan sebelum itu terulang.
  const lastSavedDraftRef = useRef(draft)
  const isDirty = JSON.stringify(draft) !== JSON.stringify(lastSavedDraftRef.current)
  const isDirtyRef = useRef(false)
  isDirtyRef.current = isDirty
  // Request PUT simpan itu sendiri adalah "navigasi" Inertia — penjaga di
  // bawah harus membiarkannya lewat, bukan menganggapnya sebagai upaya
  // meninggalkan halaman dengan perubahan yang belum disimpan.
  const savingRef = useRef(false)

  // Inertia tidak me-remount komponen halaman saat navigasi ?group= dari
  // sidebar (komponen sama, props baru) — jadi draft harus dibangun ulang
  // tiap kali activeGroup (dan datanya) berganti, bukan hanya sekali di awal.
  useEffect(() => {
    const fresh = buildDraft(settings[activeGroup])
    setDraft(fresh)
    lastSavedDraftRef.current = fresh
    setSavedMessage(null)
    setSaveError(false)
  }, [activeGroup, settings])

  // Tutup/refresh tab, atau navigasi Inertia ke halaman lain (ganti grup,
  // ganti bahasa, ke menu lain, atau logout) — semua dicegat kalau ada
  // perubahan yang belum disimpan.
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirtyRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    const removeInertiaGuard = router.on('before', () => {
      if (!isDirtyRef.current || savingRef.current) return true
      return window.confirm('Ada perubahan yang belum disimpan. Tinggalkan halaman ini dan buang perubahan?')
    })

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      removeInertiaGuard()
    }
  }, [])

  // Unggah gambar berjalan async (lihat ImageField) — kalau admin sempat
  // pindah grup dari sidebar sebelum unggahan selesai, callback-nya masih
  // membawa nama field dari grup lama. Tanpa penjaga ini, hasilnya bisa
  // menimpa field bernama sama di grup baru (mis. "hero_image" ada di
  // beberapa grup) atau menyelipkan field asing yang tidak pernah tersimpan.
  const activeGroupRef = useRef(activeGroup)
  activeGroupRef.current = activeGroup
  const activeLocaleRef = useRef(activeLocale)
  activeLocaleRef.current = activeLocale

  const updateField = (group, locale, key, patch) => {
    if (group !== activeGroupRef.current || locale !== activeLocaleRef.current) return
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  const addField = (key, type, value) => {
    setDraft((prev) => ({ ...prev, [key]: { type, value, error: null } }))
  }

  const handleSave = () => {
    const items = []
    let hasError = false

    Object.entries(draft).forEach(([key, field]) => {
      if (field.type !== 'json') {
        items.push({ group: activeGroup, locale: activeLocale, key, value: field.value, type: field.type })
        return
      }

      try {
        const parsed = JSON.parse(field.value)
        items.push({ group: activeGroup, locale: activeLocale, key, value: parsed, type: 'json' })
        updateField(activeGroup, activeLocale, key, { error: null })
      } catch {
        updateField(activeGroup, activeLocale, key, { error: 'JSON tidak valid.' })
        hasError = true
      }
    })

    if (hasError) return

    setSaving(true)
    savingRef.current = true
    setSavedMessage(null)
    setSaveError(false)

    router.put(
      route('admin.settings.update'),
      { settings: items },
      {
        preserveScroll: true,
        onSuccess: () => {
          lastSavedDraftRef.current = draft
          setSavedMessage(
            `Perubahan grup ${groupLabels[activeGroup] ?? activeGroup} (${activeLocale === 'en' ? 'English' : 'Indonesia'}) tersimpan.`,
          )
        },
        onError: () => setSaveError(true),
        onFinish: () => {
          setSaving(false)
          savingRef.current = false
        },
      },
    )
  }

  return (
    <div>
      <Head title="Pengaturan" />

      <h1 className="font-display text-3xl font-light text-ink">
        Pengaturan <span className="text-gold">/ {groupLabels[activeGroup] ?? activeGroup}</span>
      </h1>
      <p className="mt-2 text-[14px] text-muted">
        Konten setiap halaman publik. Perubahan langsung tayang setelah disimpan.
      </p>

      <div className="mt-6 flex gap-6 border-b border-ink/10">
        {LOCALES.map((locale) => (
          <button
            key={locale.value}
            type="button"
            onClick={() => router.get(route('admin.settings.index', { group: activeGroup, locale: locale.value }))}
            className={`border-b-2 pb-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
              activeLocale === locale.value ? 'border-gold text-gold' : 'border-transparent text-body hover:text-gold'
            }`}
          >
            {locale.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6">
        {Object.keys(draft).length === 0 && <p className="text-[14px] text-muted">Belum ada field pada grup ini.</p>}

        {Object.entries(draft).map(([key, field]) => (
          <div key={key}>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {key}
            </span>

            {key === 'whatsapp' && (
              <p className="mb-2 text-[13px] text-muted">
                Dipakai untuk tombol WhatsApp di formulir kontak. Isi dengan kode negara, tanpa tanda{' '}
                <code>+</code> dan tanpa angka 0 di depan — contoh: <code>6281234567890</code>. Kalau
                dikosongkan, tombolnya tidak akan muncul di situs.
              </p>
            )}

            <FieldEditor fieldKey={key} field={field} onUpdate={(patch) => updateField(activeGroup, activeLocale, key, patch)} />

            {field.error && <span className="mt-2 block text-[13px] text-gold">{field.error}</span>}
          </div>
        ))}

        <NewFieldForm onAdd={addField} />

        {savedMessage && (
          <div role="status" className="border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
            {savedMessage}
          </div>
        )}

        {saveError && (
          <div role="alert" className="border-l-2 border-gold bg-sand px-4 py-3 text-[13px] text-ink/80">
            Gagal menyimpan perubahan.
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          {isDirty && !saving && (
            <span className="text-[13px] text-gold">Ada perubahan yang belum disimpan.</span>
          )}

          <Button
            type="button"
            variant="solid"
            onClick={handleSave}
            disabled={saving}
            className="disabled:opacity-50"
          >
            {saving ? 'Menyimpan…' : `Simpan ${groupLabels[activeGroup] ?? activeGroup}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

SettingsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
