import Icon, { pickIcon } from '../atoms/Icon'

/**
 * Kartu nilai — kotak bergaris tipis dengan ikon kecil, dipakai berulang di
 * referensi Figma (Excellence/Integrity/Innovation/Elegance, dan nilai-nilai
 * inti di halaman Ecosystem).
 */
export default function ValueCard({ title, label, body }) {
  return (
    <div className="flex flex-col items-center gap-4 border border-line bg-canvas p-8 text-center md:p-10">
      <Icon name={pickIcon(`${title ?? ''} ${label ?? ''}`)} className="h-10 w-10 text-gold md:h-12 md:w-12" />

      <div>
        <h3 className="pt-2 font-display text-2xl font-medium leading-tight text-ink">{title}</h3>
        {label && <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-muted">{label}</span>}
      </div>

      <p className="w-full text-[15px] leading-[1.7] text-body">{body}</p>
    </div>
  )
}
