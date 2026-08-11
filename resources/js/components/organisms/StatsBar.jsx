import StatItem from '../molecules/StatItem'

export default function StatsBar({ items = [] }) {
  if (items.length === 0) return null

  return (
    <section className="border-y border-line">
      <div className="shell grid grid-cols-2 gap-12 py-16 md:grid-cols-4">
        {items.map((item) => (
          <StatItem key={item.label} value={item.value} label={item.label} />
        ))}
      </div>
    </section>
  )
}
