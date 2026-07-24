import Eyebrow from '../atoms/Eyebrow'
import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

export default function FounderCard({
  name,
  role,
  body,
  portrait,
  reverse = false,
  quote,
  legacyTitle,
  legacyBody,
}) {
  const ref = useReveal()

  return (
    <div
      ref={ref}
      className={`reveal grid gap-10 md:grid-cols-2 md:items-center md:gap-16 ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <Figure src={portrait} alt={name} ratio="aspect-[4/5]" />

      <div>
        <Eyebrow>{role}</Eyebrow>
        <h3 className="mt-4 font-display text-3xl font-light md:text-5xl">{name}</h3>

        {body ? (
          <Paragraph className="measure mt-6">{body}</Paragraph>
        ) : (
          <Paragraph tone="muted" className="measure mt-6 italic">
            Deskripsi belum tersedia.
          </Paragraph>
        )}

        {quote && (
          <blockquote className="measure mt-8 border-l-2 border-gold py-1 pl-8">
            <p className="font-display text-xl font-normal leading-snug text-ink">&ldquo;{quote}&rdquo;</p>
          </blockquote>
        )}

        {legacyTitle && (
          <div className="mt-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
              {legacyTitle}
            </span>
            <Paragraph className="measure mt-3">{legacyBody}</Paragraph>
          </div>
        )}
      </div>
    </div>
  )
}
