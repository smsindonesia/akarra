import Display from '../atoms/Display'
import Eyebrow from '../atoms/Eyebrow'
import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

export default function NarrativeSplit({
  eyebrow,
  title,
  emphasis,
  body,
  image,
  imageAlt,
  reverse = false,
  quote,
  quoteAttribution,
  badge,
  children,
}) {
  const ref = useReveal()

  return (
    <section className="section">
      <div
        ref={ref}
        className={`reveal shell grid gap-12 md:grid-cols-2 md:items-center md:gap-20 ${
          reverse ? 'md:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="relative">
          <Figure src={image} alt={imageAlt ?? title} ratio="aspect-[4/5]" />

          {badge && (
            <div className="absolute -bottom-8 -left-8 hidden max-w-[12rem] border border-gold/20 bg-canvas/70 p-6 backdrop-blur-sm md:block">
              <span className="font-display text-2xl font-medium text-gold">{badge}</span>
            </div>
          )}
        </div>

        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <Display size="md" emphasis={emphasis} className={eyebrow ? 'mt-5' : ''}>
            {title}
          </Display>

          <Paragraph className="measure mt-6">{body}</Paragraph>

          {quote && (
            <blockquote className="measure mt-8 border-l-2 border-gold py-2 pl-8">
              <p className="text-[15px] leading-[1.85] text-ink">&ldquo;{quote}&rdquo;</p>
              {quoteAttribution && (
                <cite className="mt-4 block text-[11px] font-medium not-italic uppercase tracking-[0.18em] text-gold">
                  — {quoteAttribution}
                </cite>
              )}
            </blockquote>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
