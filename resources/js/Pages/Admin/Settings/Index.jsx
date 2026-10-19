import { useEffect, useRef, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'

import ContentField, { FieldShell, adminInputClass } from '../../../components/admin/ContentField'
import MediaListField, { isStructurable } from '../../../components/admin/MediaListField'
import AdminLayout from '../../../Layouts/AdminLayout'
import { SETTING_GROUPS, SETTING_GROUP_LABELS as groupLabels } from '../../../lib/settingGroups'
import { SETTING_SCHEMA, emptyValueFor, schemaKeys } from '../../../lib/settingSchema'

const LOCALES = [
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'English' },
]

const JSON_FIELD_TYPES = ['list', 'lines', 'gallery', 'object']

function classify(value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'integer'
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return 'json'
  return 'string'
}

/** Baris kosong di daftar teks (sisa tombol Enter) dibuang sebelum disimpan. */
function clean(value) {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) return value.filter((v) => v.trim() !== '')
    return value.map(clean)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]))
  }

  return value
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/** Field yang tidak dipetakan schema: teks biasa, atau JSON mentah sebagai jalan terakhir. */
function AdvancedField({ fieldKey, value, onChange }) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2))
  const [error, setError] = useState(null)

  if (typeof value === 'string' || value === null || value === undefined) {
    return (
      <FieldShell label={fieldKey}>
        <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={adminInputClass} />
      </FieldShell>
    )
  }

  if (isStructurable(value)) {
    return (
      <FieldShell label={fieldKey}>
        <MediaListField value={value} onChange={onChange} />
      </FieldShell>
    )
  }

  return (
    <FieldShell label={fieldKey} help={error ?? 'Format JSON. Perubahan diterapkan saat kotak ditinggalkan.'}>
      <textarea
        rows={6}
        value={raw}
        spellCheck={false}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => {
          try {
            onChange(JSON.parse(raw))
            setError(null)
          } catch {
            setError('JSON tidak valid — perubahan belum diterapkan.')
          }
        }}
        className={`${adminInputClass} font-mono text-[13px]`}
      />
    </FieldShell>
  )
}

function SectionCard({ index, id, title, description, dirty, children }) {
  return (
    <section id={`bagian-${id}`} className="scroll-mt-36 rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <header className="flex items-start gap-4 border-b border-ink/10 px-5 py-4 md:px-7 md:py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/10 text-[14px] font-semibold text-gold">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                Belum disimpan
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>}
        </div>
      </header>
      <div className="px-5 py-5 md:px-7 md:py-6">{children}</div>
    </section>
  )
}

export default function SettingsIndex({ settings, activeGroup, activeLocale }) {
  const schema = SETTING_SCHEMA[activeGroup] ?? { title: groupLabels[activeGroup] ?? activeGroup, sections: [] }
  const groupData = settings[activeGroup] ?? {}

  const [draft, setDraft] = useState(() => structuredClone(groupData))
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(null)
  const [saveError, setSaveError] = useState(false)

  // Foto/video ter-upload ke server begitu dipilih (lihat ImageField/VideoField),
  // tapi baru benar-benar melekat ke konten setelah "Simpan" ditekan — draft di
  // React ini murni lokal sampai saat itu. Sudah pernah kejadian: admin
  // mengunggah gambar, pratinjaunya tampil, lalu pindah tab/grup tanpa
  // menyimpan — berkasnya ada di server tapi tidak pernah tersambung ke
  // field manapun. savedRef menjadi acuan "tersimpan" supaya kita bisa
  // mendeteksi dan memperingatkan sebelum itu terulang.
  const savedRef = useRef(groupData)
  const isDirty = !same(draft, savedRef.current)
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
    const fresh = settings[activeGroup] ?? {}
    setDraft(structuredClone(fresh))
    savedRef.current = fresh
    setSaveError(false)
  }, [activeGroup, activeLocale, settings])

  useEffect(() => {
    setSavedMessage(null)
  }, [activeGroup, activeLocale])

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

  const setField = (group, locale, key) => (value) => {
    if (group !== activeGroupRef.current || locale !== activeLocaleRef.current) return
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const fieldTypes = {}
  schema.sections.forEach((section) => section.fields.forEach((field) => (fieldTypes[field.key] = field)))

  const handleSave = () => {
    if (saving || !isDirty) return

    const items = Object.entries(draft).map(([key, value]) => {
      const schemaField = fieldTypes[key]
      const type = schemaField ? (JSON_FIELD_TYPES.includes(schemaField.type) ? 'json' : 'string') : classify(value)

      return { group: activeGroup, locale: activeLocale, key, value: clean(value), type }
    })

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
          savedRef.current = draft
          setSavedMessage(`Tersimpan. Halaman ${schema.title} (${activeLocale === 'en' ? 'English' : 'Indonesia'}) sudah diperbarui di situs.`)
        },
        onError: () => setSaveError(true),
        onFinish: () => {
          setSaving(false)
          savingRef.current = false
        },
      },
    )
  }

  const handleReset = () => {
    if (!window.confirm('Batalkan semua perubahan yang belum disimpan?')) return
    setDraft(structuredClone(savedRef.current))
  }

  // Ctrl/Cmd + S untuk menyimpan, kebiasaan yang sudah umum di aplikasi lain.
  const saveRef = useRef(handleSave)
  saveRef.current = handleSave
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const mappedKeys = schemaKeys(activeGroup)
  const extraKeys = Object.keys(draft).filter((key) => !mappedKeys.has(key))
  const valueOf = (field) => (field.key in draft ? draft[field.key] : emptyValueFor(field))

  return (
    <div className="mx-auto max-w-5xl">
      <Head title={`Kelola Halaman — ${schema.title}`} />

      {/* Pilihan halaman */}
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">Kelola Halaman</p>
      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        {SETTING_GROUPS.map((group) => {
          const active = group === activeGroup
          return (
            <Link
              key={group}
              href={route('admin.settings.index', { group, locale: activeLocale })}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                active ? 'border-ink bg-ink text-ivory' : 'border-ink/15 bg-white text-ink/70 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {SETTING_SCHEMA[group]?.title ?? groupLabels[group] ?? group}
            </Link>
          )
        })}
      </div>

      {/* Judul halaman yang sedang disunting */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-normal text-ink md:text-4xl">{schema.title}</h1>
          {schema.description && <p className="mt-1 text-[14px] text-muted">{schema.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {schema.path && (
            <a
              href={schema.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition hover:border-gold/50 hover:text-gold"
            >
              Lihat halaman
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Bahasa konten */}
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3">
        <span className="text-[13px] font-medium text-ink">Bahasa yang sedang diubah:</span>
        <div className="inline-flex rounded-lg bg-canvas p-1">
          {LOCALES.map((locale) => (
            <button
              key={locale.value}
              type="button"
              onClick={() => router.get(route('admin.settings.index', { group: activeGroup, locale: locale.value }))}
              className={`rounded-md px-4 py-1.5 text-[13px] font-medium transition ${
                activeLocale === locale.value ? 'bg-white text-gold shadow-sm' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {locale.label}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-muted">Teks diisi terpisah per bahasa. Foto & video otomatis dipakai di kedua bahasa.</span>
      </div>

      {/* Lompat ke bagian */}
      {schema.sections.length > 1 && (
        <nav
          aria-label="Bagian halaman"
          className="sticky top-0 z-20 -mx-6 mt-6 flex gap-2 overflow-x-auto border-b border-ink/10 bg-canvas/95 px-6 py-3 backdrop-blur lg:-mx-10 lg:px-10"
        >
          {schema.sections.map((section, i) => (
            <a
              key={section.id}
              href={`#bagian-${section.id}`}
              className="shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium text-ink/60 transition hover:bg-white hover:text-gold"
            >
              <span className="mr-1 text-gold">{i + 1}.</span>
              {section.title}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-6 grid gap-6">
        {schema.sections.map((section, i) => {
          const dirty = section.fields.some((field) => !same(draft[field.key], savedRef.current[field.key]))

          return (
            <SectionCard key={section.id} index={i + 1} {...section} dirty={dirty}>
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className={field.wide || ['list', 'object', 'gallery', 'lines'].includes(field.type) ? 'md:col-span-2' : ''}
                  >
                    <ContentField
                      key={`${activeGroup}-${activeLocale}-${field.key}`}
                      field={field}
                      value={valueOf(field)}
                      onChange={setField(activeGroup, activeLocale, field.key)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          )
        })}

        {extraKeys.length > 0 && (
          <details className="group rounded-2xl border border-dashed border-ink/15 bg-white/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 md:px-7">
              <div>
                <p className="text-[15px] font-semibold text-ink">Pengaturan lanjutan</p>
                <p className="mt-0.5 text-[13px] text-muted">
                  {extraKeys.length} isian lain yang saat ini tidak tampil di situs. Biasanya tidak perlu diubah.
                </p>
              </div>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="grid gap-5 border-t border-ink/10 px-5 py-5 md:px-7">
              {extraKeys.map((key) => (
                <AdvancedField
                  key={`${activeGroup}-${activeLocale}-${key}`}
                  fieldKey={key}
                  value={draft[key]}
                  onChange={setField(activeGroup, activeLocale, key)}
                />
              ))}
            </div>
          </details>
        )}

        {schema.sections.length === 0 && extraKeys.length === 0 && (
          <p className="text-[14px] text-muted">Belum ada isian pada halaman ini.</p>
        )}
      </div>

      {/* Bilah simpan: selalu terlihat di bawah layar */}
      <div className="sticky bottom-4 z-30 mt-8">
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-lg transition md:px-5 ${
            isDirty ? 'border-amber-200 bg-amber-50' : 'border-ink/10 bg-white'
          }`}
        >
          <p role="status" className="text-[13px] text-ink/80">
            {saving
              ? 'Menyimpan…'
              : saveError
                ? <span className="text-red-700">Gagal menyimpan. Periksa koneksi lalu coba lagi.</span>
                : isDirty
                  ? 'Ada perubahan yang belum disimpan.'
                  : (savedMessage ?? 'Semua perubahan sudah tersimpan.')}
          </p>

          <div className="flex items-center gap-2">
            {isDirty && !saving && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-ink/60 transition hover:bg-white hover:text-ink"
              >
                Batalkan
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="rounded-lg bg-gold px-5 py-2 text-[13px] font-semibold text-ivory transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

SettingsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
