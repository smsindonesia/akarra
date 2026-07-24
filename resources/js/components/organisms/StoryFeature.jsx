import Button from '../atoms/Button'
import Display from '../atoms/Display'
import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

/**
 * Section bergambar lebar. Gambarnya melampaui lebar konten agar terasa
 * sinematik, sementara teksnya tetap di dalam kolom yang nyaman dibaca.
 */
export default function StoryFeature({ title, body, image, ctaLabel, ctaTo }) {
  const ref = useReveal()

  return (
    <section className="section">
      <div ref={ref} className="reveal">
        <div className="shell">
          <Figure src={image} alt={title} ratio="aspect-[16/9] md:aspect-[21/9]" />
        </div>

        <div className="shell mt-14 grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <Display size="md" className="md:sticky md:top-32 md:self-start">
            {title}
          </Display>

          <div>
            <Paragraph className="measure text-[17px] leading-[1.9]">{body}</Paragraph>

            {ctaLabel && (
              <div className="mt-10">
                <Button to={ctaTo ?? '/ecosystem'} variant="quiet">
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
