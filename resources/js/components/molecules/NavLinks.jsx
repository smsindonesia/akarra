import { Link, usePage } from '@inertiajs/react'

export default function NavLinks({ items, tone = 'ink', onNavigate }) {
  const { url } = usePage()
  const base = tone === 'invert' ? 'text-ivory/80' : 'text-ink/70'
  const active = tone === 'invert' ? 'text-ivory' : 'text-ink'

  return (
    <>
      {items.map((item) => {
        const isActive = url === item.path || url.startsWith(`${item.path}/`)

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={`relative text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:text-gold ${
              isActive ? `${active} after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-gold` : base
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
