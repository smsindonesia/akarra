import { useEffect, useMemo, useState } from 'react'

import SectionHead from '../molecules/SectionHead'
import SolutionCard from '../molecules/SolutionCard'

/**
 * "Curated Solutions" — grid dengan tab kategori (Fashion/Creative/
 * Advertising) di atasnya, sesuai referensi. Tab hanya muncul bila item
 * punya lebih dari satu kategori; jika tidak, semua item tetap tampil.
 */
export default function SolutionsGrid({ title, subtitle, items = [] }) {
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))],
    [items],
  )
  const [active, setActive] = useState(categories[0] ?? null)

  useEffect(() => {
    if (!categories.includes(active)) {
      setActive(categories[0] ?? null)
    }
  }, [categories, active])

  if (items.length === 0) return null

  const visible = active ? items.filter((item) => item.category === active) : items

  return (
    <section className="section">
      <div className="shell">
        <SectionHead title={title} body={subtitle} align="center" />

        {categories.length > 1 && (
          <div className="mt-12 flex justify-center gap-8 border-b border-line md:gap-12">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={`border-b-2 px-1 pb-6 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  active === category ? 'border-gold text-gold' : 'border-transparent text-body hover:text-gold'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-10">
          {visible.map((item) => (
            <SolutionCard key={item.title} title={item.title} body={item.body} image={item.image} />
          ))}
        </div>
      </div>
    </section>
  )
}
