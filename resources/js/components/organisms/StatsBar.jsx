import StatItem from '../molecules/StatItem'
import useReveal from '../../hooks/useReveal'

export default function StatsBar({ items = [] }) {
  const ref = useReveal()

  if (items.length === 0) return null

  return (
    <section className="border-y border-ink/10">
      <div ref={ref} className="reveal shell grid grid-cols-2 gap-12 py-16 md:grid-cols-4">
        {items.map((item) => (
          <StatItem key={item.label} value={item.value} label={item.label} />
        ))}
      </div>
    </section>
  )
}
