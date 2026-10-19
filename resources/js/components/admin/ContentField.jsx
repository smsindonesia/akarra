import { useState } from 'react'

import GalleryField from './GalleryField'
import ImageField from './ImageField'
import VideoField from './VideoField'

export const adminInputClass =
  'w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-ink placeholder:text-ink/35 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

/** Label + keterangan di atas sebuah input. */
export function FieldShell({ label, help, children }) {
  return (
    <div>
      {label && <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>}
      {children}
      {help && <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{help}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={adminInputClass}
    />
  )
}

function TextArea({ value, onChange, placeholder }) {
  const text = value ?? ''
  // Tinggi menyesuaikan panjang isi supaya paragraf panjang terbaca utuh
  // tanpa harus menggulir di dalam kotak kecil.
  const rows = Math.min(10, Math.max(3, Math.ceil(text.length / 70) + text.split('\n').length - 1))

  return (
    <textarea
      rows={rows}
      value={text}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${adminInputClass} resize-y`}
    />
  )
}

/** Daftar teks pendek, satu per baris (mis. poin/bullet, misi). */
function LinesInput({ value, onChange }) {
  const lines = Array.isArray(value) ? value : []

  return (
    <textarea
      rows={Math.max(3, lines.length + 1)}
      value={lines.join('\n')}
      onChange={(e) => onChange(e.target.value.split('\n'))}
      className={`${adminInputClass} resize-y`}
    />
  )
}

function IconButton({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-md border border-ink/10 bg-white text-ink/60 transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'hover:border-red-300 hover:bg-red-50 hover:text-red-700' : 'hover:border-gold/50 hover:text-gold'
      }`}
    >
      {children}
    </button>
  )
}

const chevron = (direction) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d={direction === 'up' ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Field-field satu kartu (objek), mengikuti `fields` di schema. */
function ObjectFields({ fields, value, onChange }) {
  const item = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const media = fields.filter((field) => field.type === 'image' || field.type === 'video')
  const rest = fields.filter((field) => !media.includes(field))

  const renderField = (field) => (
    <ContentField
      key={field.key}
      field={field}
      value={item[field.key]}
      onChange={(next) => onChange({ ...item, [field.key]: next })}
    />
  )

  // Foto di kolom kiri, teks di kanan — kartu bergambar jadi mirip
  // tampilannya di situs dan lebih mudah dikenali.
  if (media.length > 0) {
    return (
      <div className="grid gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <div className="grid content-start gap-5">{media.map(renderField)}</div>
        <div className="grid content-start gap-4">{rest.map(renderField)}</div>
      </div>
    )
  }

  return <div className="grid gap-4">{rest.map(renderField)}</div>
}

/** Daftar kartu yang bisa ditambah, dihapus, dan diurutkan. */
function ListEditor({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  // Daftar pendek langsung terbuka semua; daftar panjang tertutup supaya
  // admin bisa melihat urutannya sekilas lalu membuka yang perlu diubah.
  const [open, setOpen] = useState(() => new Set(items.length <= 2 ? items.map((_, i) => i) : []))

  const toggle = (index) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })

  const update = (index, next) => {
    const copy = items.slice()
    copy[index] = next
    onChange(copy)
  }

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const copy = items.slice()
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    onChange(copy)
    setOpen((prev) => {
      const next = new Set(prev)
      const a = prev.has(index)
      const b = prev.has(target)
      a ? next.add(target) : next.delete(target)
      b ? next.add(index) : next.delete(index)
      return next
    })
  }

  const remove = (index) => {
    const title = items[index]?.[field.titleKey]
    if (!window.confirm(`Hapus ${field.itemLabel.toLowerCase()} ${index + 1}${title ? ` "${title}"` : ''}?`)) return
    onChange(items.filter((_, i) => i !== index))
    setOpen((prev) => new Set([...prev].filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))))
  }

  const add = () => {
    onChange([...items, structuredClone(field.newItem ?? {})])
    setOpen((prev) => new Set(prev).add(items.length))
  }

  return (
    <div className="grid gap-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink/15 px-4 py-6 text-center text-[13px] text-muted">
          Belum ada {field.itemLabel.toLowerCase()}.
        </p>
      )}

      {items.map((item, index) => {
        const title = item?.[field.titleKey]
        const isOpen = open.has(index)

        return (
          <div key={index} className="overflow-hidden rounded-lg border border-ink/10 bg-canvas/60">
            <div className="flex items-center gap-3 px-4 py-2.5">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-ink px-1.5 text-[11px] font-semibold text-ivory">
                  {index + 1}
                </span>
                <span className="truncate text-[14px] font-medium text-ink">
                  {title || <span className="italic text-muted">{field.itemLabel} tanpa judul</span>}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`ml-auto h-4 w-4 shrink-0 text-ink/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="flex shrink-0 items-center gap-1.5">
                <IconButton label="Pindah ke atas" onClick={() => move(index, -1)} disabled={index === 0}>
                  {chevron('up')}
                </IconButton>
                <IconButton label="Pindah ke bawah" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                  {chevron('down')}
                </IconButton>
                <IconButton label={`Hapus ${field.itemLabel.toLowerCase()}`} onClick={() => remove(index)} danger>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </IconButton>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-ink/10 bg-white p-4 md:p-5">
                {typeof item === 'object' && item !== null ? (
                  <>
                    <ObjectFields fields={field.fields} value={item} onChange={(next) => update(index, next)} />
                    <ExtraKeys fields={field.fields} value={item} onChange={(next) => update(index, next)} />
                  </>
                ) : (
                  <TextInput value={String(item ?? '')} onChange={(next) => update(index, next)} />
                )}
              </div>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gold/40 px-4 py-3 text-[13px] font-medium text-gold transition hover:border-gold hover:bg-gold/5"
      >
        <span className="text-lg leading-none">+</span> Tambah {field.itemLabel.toLowerCase()}
      </button>
    </div>
  )
}

/**
 * Properti item yang tidak tercantum di schema (mis. data lama) — tetap
 * ditampilkan sebagai teks supaya tidak hilang diam-diam dan masih bisa diubah.
 */
function ExtraKeys({ fields, value, onChange }) {
  const known = new Set(fields.map((field) => field.key))
  const extras = Object.entries(value).filter(([key, v]) => !known.has(key) && (typeof v === 'string' || Array.isArray(v)))

  if (extras.length === 0) return null

  return (
    <div className="mt-5 grid gap-4 border-t border-dashed border-ink/10 pt-4">
      <p className="text-[12px] text-muted">Data tambahan</p>
      {extras.map(([key, v]) => (
        <ContentField
          key={key}
          field={{ key, label: key, type: Array.isArray(v) ? 'lines' : 'text' }}
          value={v}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  )
}

/** Merender satu field schema sesuai tipenya. */
export default function ContentField({ field, value, onChange }) {
  let input

  switch (field.type) {
    case 'textarea':
      input = <TextArea value={value} onChange={onChange} placeholder={field.placeholder} />
      break
    case 'image':
      input = <ImageField value={value} onChange={onChange} label={field.label} />
      break
    case 'video':
      input = <VideoField value={value} onChange={onChange} label={field.label} />
      break
    case 'gallery':
      input = <GalleryField value={Array.isArray(value) ? value : []} onChange={onChange} />
      break
    case 'lines':
      input = <LinesInput value={value} onChange={onChange} />
      break
    case 'list':
      input = <ListEditor field={field} value={value} onChange={onChange} />
      break
    case 'object':
      input = (
        <div className="rounded-lg border border-ink/10 bg-white p-4 md:p-5">
          <ObjectFields fields={field.fields} value={value} onChange={onChange} />
        </div>
      )
      break
    default:
      input = <TextInput value={value} onChange={onChange} placeholder={field.placeholder} />
  }

  return (
    <FieldShell label={field.label} help={field.help}>
      {input}
    </FieldShell>
  )
}
