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
        <Figure src={image} alt={imageAlt ?? title} ratio="aspect-[4/5]" />

        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <Display size="md" emphasis={emphasis} className={eyebrow ? 'mt-5' : ''}>
            {title}
          </Display>

          <Paragraph className="measure mt-6">{body}</Paragraph>

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
