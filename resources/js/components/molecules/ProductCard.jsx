import Figure from '../atoms/Figure'

/**
 * Kartu produk pada grid "Bespoke Collections" — gambar, nama, label kecil,
 * dan tag aksi (mis. RESERVE/EXPLORE) di kanan atas nama.
 */
export default function ProductCard({ name, label, image, tag, offset = false }) {
  return (
    <div className={offset ? 'md:pt-24' : 'md:pb-24'}>
      <Figure src={image} alt={name} ratio="aspect-[4/5]" />

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-medium text-ink">{name}</h3>
          {label && <span className="mt-1 block text-[13px] text-muted">{label}</span>}
        </div>

        {tag && (
          <span className="shrink-0 pt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            {tag}
          </span>
        )}
      </div>
    </div>
  )
}
