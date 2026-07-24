/**
 * Kartu nilai — kotak bergaris tipis dengan ikon kecil, dipakai berulang di
 * referensi Figma (Excellence/Integrity/Innovation/Elegance, dan nilai-nilai
 * inti di halaman Ecosystem).
 */
export default function ValueCard({ title, label, body }) {
  return (
    <div className="flex flex-col gap-4 border border-line bg-canvas p-8 md:p-10">
      <span className="block h-6 w-6 bg-gold" aria-hidden="true" />

      <div>
        <h3 className="pt-2 font-display text-2xl font-medium leading-tight text-ink">{title}</h3>
        {label && <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-muted">{label}</span>}
      </div>

      <p className="text-[15px] leading-[1.7] text-body">{body}</p>
    </div>
  )
}
