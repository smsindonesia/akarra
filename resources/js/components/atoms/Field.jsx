/**
 * Field formulir. Kotak bergaris tipis (outline amber-100), sesuai referensi
 * Figma. Error tampil sebagai teks, bukan ikon merah, agar tidak memecah
 * ketenangan halaman.
 */
export default function Field({ label, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.18em] text-body">
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
  'w-full outline outline-1 outline-line bg-transparent px-4 py-3.5 text-[15px] text-ink transition-colors placeholder:text-muted focus:outline-2 focus:outline-gold focus:ring-0'
