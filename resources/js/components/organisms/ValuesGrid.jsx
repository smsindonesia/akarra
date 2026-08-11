import SectionHead from '../molecules/SectionHead'
import ValueCard from '../molecules/ValueCard'

/**
 * Baris kartu nilai. Dipakai di beranda (4 nilai inti) dan halaman Ecosystem
 * (nilai inti / filosofi logo) — satu implementasi, jumlah kolom menyesuaikan
 * panjang `items`.
 */
export default function ValuesGrid({ eyebrow, title, subtitle, items = [], align = 'left', columns = 4 }) {
  if (items.length === 0) return null

  const cols = {
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  }

  return (
    <div>
      {(eyebrow || title) && (
        <SectionHead eyebrow={eyebrow} title={title} body={subtitle} align={align} />
      )}

      <div className={`mt-12 grid gap-6 ${cols[columns] ?? cols[4]}`}>
        {items.map((item) => (
          <ValueCard
            key={item.name ?? item.title}
            title={item.name ?? item.title}
            label={item.label}
            body={item.body}
          />
        ))}
      </div>
    </div>
  )
}
