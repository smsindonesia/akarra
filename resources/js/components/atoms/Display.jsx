/**
 * Judul display dengan penekanan italic pada satu kata.
 *
 * Di Figma, headline memiringkan tepat satu kata ("Ecosystem of *Excellence*").
 * Detail kecil ini yang membuat tipografinya terasa mahal, jadi dijadikan
 * komponen supaya konsisten di semua halaman dan bisa diatur dari CMS lewat
 * field `*_emphasis` — admin tidak perlu menyentuh HTML.
 */
export default function Display({
  as: Tag = 'h2',
  children,
  emphasis,
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'text-3xl md:text-4xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-[2.75rem] leading-[1.08] md:text-7xl',
  }

  const base = `font-display font-light tracking-[-0.01em] leading-[1.12] ${sizes[size]} ${className}`
  const text = typeof children === 'string' ? children : ''

  if (!emphasis || !text || !text.includes(emphasis)) {
    return <Tag className={base}>{children}</Tag>
  }

  const index = text.indexOf(emphasis)
  const before = text.slice(0, index)
  const after = text.slice(index + emphasis.length)

  return (
    <Tag className={base}>
      {before}
      <em className="italic font-normal">{emphasis}</em>
      {after}
    </Tag>
  )
}
