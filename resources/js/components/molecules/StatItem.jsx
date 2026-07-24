export default function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-light text-gold md:text-5xl">{value}</div>
      <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
    </div>
  )
}
