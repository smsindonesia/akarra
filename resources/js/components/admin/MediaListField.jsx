import GalleryField from './GalleryField'
import ImageField from './ImageField'
import { fieldClass } from '../atoms/Field'

const IMAGE_KEY_PATTERN = /image|photo|portrait|logo|favicon|cover/i

export function isImageKey(key) {
  return IMAGE_KEY_PATTERN.test(key)
}

/**
 * Data JSON dianggap "berisi media" kalau merupakan objek tunggal, atau daftar
 * objek, yang salah satu field-nya cocok dengan pola nama field gambar. Field
 * seperti ini dirender sebagai kartu per item (lihat ItemFields), bukan
 * textarea JSON mentah.
 */
export function isMediaJson(value) {
  const hasImageField = (obj) =>
    obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).some(isImageKey)

  if (Array.isArray(value)) {
    return value.length > 0 && value.every((item) => item && typeof item === 'object' && !Array.isArray(item)) && value.some(hasImageField)
  }

  return hasImageField(value)
}

/**
 * Data JSON dianggap "bisa dirender terstruktur" kalau ItemFields/MediaListField
 * sanggup menampilkannya sebagai kartu tanpa jatuh ke textarea JSON mentah di
 * level atas: objek tunggal, daftar objek (non-kosong), atau daftar string
 * (non-kosong). Bentuk lain (array kosong, array angka/campuran, array
 * bersarang, null, dsb.) tetap memakai textarea mentah.
 */
export function isStructurable(value) {
  const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

  if (Array.isArray(value)) {
    if (value.length === 0) return false
    if (value.every(isPlainObject)) return true
    if (value.every((v) => typeof v === 'string')) return true
    return false
  }

  return isPlainObject(value)
}

/** Field sederhana (bukan gambar, bukan daftar) di dalam satu item. */
function PlainField({ label, value, onChange }) {
  const isLong = typeof value === 'string' && value.length > 80

  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{label}</span>
      {isLong ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldClass} resize-none`}
        />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass} />
      )}
    </div>
  )
}

/** Daftar string sederhana (mis. bullet points), satu baris per nilai. */
function StringListField({ label, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {label ? `${label} ` : ''}(satu per baris)
      </span>
      <textarea
        rows={Math.max(2, value.length)}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        className={`${fieldClass} resize-y`}
      />
    </div>
  )
}

/** Fallback untuk bentuk data yang tidak dikenali: JSON mentah per field. */
function RawJsonField({ label, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{label}</span>
      <textarea
        rows={4}
        defaultValue={JSON.stringify(value, null, 2)}
        onBlur={(e) => {
          try {
            onChange(JSON.parse(e.target.value))
          } catch {
            // Nilai tidak diubah kalau JSON yang diketik tidak valid.
          }
        }}
        className={`${fieldClass} font-mono text-[13px] resize-y`}
      />
    </div>
  )
}

/** Field satu item (objek): merender tiap propertinya sesuai bentuknya. */
function ItemFields({ item, onChange }) {
  return (
    <div className="grid gap-5">
      {Object.entries(item).map(([subKey, subValue]) => {
        const set = (next) => onChange({ ...item, [subKey]: next })

        if (typeof subValue === 'string' && isImageKey(subKey)) {
          return (
            <div key={subKey}>
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                {subKey}
              </span>
              <ImageField value={subValue} onChange={set} label={subKey} />
            </div>
          )
        }

        if (typeof subValue === 'string') {
          return <PlainField key={subKey} label={subKey} value={subValue} onChange={set} />
        }

        // Galeri foto pilar: field spesifik ini butuh UI multi-slot dengan
        // unggah/ganti/hapus per foto, beda dari daftar string biasa.
        if (subKey === 'gallery' && Array.isArray(subValue)) {
          return <GalleryField key={subKey} value={subValue} onChange={set} />
        }

        if (Array.isArray(subValue) && subValue.every((v) => typeof v === 'string')) {
          return <StringListField key={subKey} label={subKey} value={subValue} onChange={set} />
        }

        if (Array.isArray(subValue) && subValue.every((v) => v && typeof v === 'object' && !Array.isArray(v))) {
          return (
            <div key={subKey} className="border-t border-ink/10 pt-5">
              <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                {subKey}
              </span>
              <div className="grid gap-4">
                {subValue.map((nested, i) => (
                  <div key={i} className="border border-ink/10 p-4">
                    <ItemFields
                      item={nested}
                      onChange={(next) => {
                        const nextList = subValue.slice()
                        nextList[i] = next
                        set(nextList)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return <RawJsonField key={subKey} label={subKey} value={subValue} onChange={set} />
      })}
    </div>
  )
}

/**
 * Editor terstruktur untuk field JSON yang berisi gambar: daftar objek
 * (mis. solutions, pillars, people) dirender sebagai kartu per item; objek
 * tunggal (mis. whitepaper) dirender sebagai satu kartu.
 */
export default function MediaListField({ value, onChange }) {
  // Daftar string polos (mis. mission): satu textarea, bukan kartu per item —
  // ItemFields mengasumsikan tiap item objek, dan Object.entries pada string
  // memecahnya jadi satu field per karakter.
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return (
      <div className="border border-ink/10 p-5">
        <StringListField label="" value={value} onChange={onChange} />
      </div>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div className="grid gap-6">
        {value.map((item, i) => (
          <div key={i} className="border border-ink/10 p-5">
            <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-gold">
              Item {i + 1}
              {item.name || item.title ? ` (${item.name ?? item.title})` : ''}
            </p>
            <ItemFields
              item={item}
              onChange={(next) => {
                const nextList = value.slice()
                nextList[i] = next
                onChange(nextList)
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="border border-ink/10 p-5">
      <ItemFields item={value} onChange={onChange} />
    </div>
  )
}
