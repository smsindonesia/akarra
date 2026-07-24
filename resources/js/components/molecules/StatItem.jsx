export default function StatItem({ value, label, tone = 'default', align = 'center' }) {
  const valueColor = tone === 'invert' ? 'text-accent-invert' : 'text-gold'
  const labelColor = tone === 'invert' ? 'text-ivory/60' : 'text-muted'

  return (
    <div className={align === 'left' ? 'text-left' : 'text-center'}>
      <div className={`font-display text-4xl font-light md:text-5xl ${valueColor}`}>{value}</div>
      <div className={`mt-3 text-[11px] font-medium uppercase tracking-[0.18em] ${labelColor}`}>
        {label}
      </div>
    </div>
  )
}
