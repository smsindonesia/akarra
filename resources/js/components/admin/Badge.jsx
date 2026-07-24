const tones = {
  gold: 'bg-gold/15 text-gold',
  ink: 'bg-ink/10 text-ink/70',
  muted: 'bg-ink/5 text-muted',
}

export default function Badge({ children, tone = 'ink' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${tones[tone]}`}>
      {children}
    </span>
  )
}
