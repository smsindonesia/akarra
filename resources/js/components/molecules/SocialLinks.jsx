export default function SocialLinks({ items = [] }) {
  const available = items.filter((item) => item.url)

  if (available.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {available.map((item) => (
        <li key={item.platform}>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-ivory-soft transition-colors hover:text-accent-invert"
          >
            {item.label ?? item.platform}
          </a>
        </li>
      ))}
    </ul>
  )
}
