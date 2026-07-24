/**
 * Field formulir. Bergaris bawah saja, tanpa kotak — mengikuti karakter
 * editorial situs. Error tampil sebagai teks, bukan ikon merah, agar tidak
 * memecah ketenangan halaman.
 */
export default function Field({ label, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-[13px] text-gold">
          {error}
        </span>
      )}
    </label>
  )
}

export const fieldClass =
  'w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-[15px] text-ink transition-colors placeholder:text-ink/30 focus:border-gold focus:outline-none focus:ring-0'
