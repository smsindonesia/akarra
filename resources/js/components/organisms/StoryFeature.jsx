import Button from '../atoms/Button'
import Figure from '../atoms/Figure'
import SectionHead from '../molecules/SectionHead'
import useReveal from '../../hooks/useReveal'

/**
 * Section video lebar dengan judul & subjudul rata tengah di atasnya, dan
 * tombol putar bundar mengambang di tengah gambar — sesuai referensi Figma.
 */
export default function StoryFeature({ title, body, image, ctaLabel, ctaTo }) {
  const ref = useReveal()

  return (
    <section className="section">
      <div ref={ref} className="reveal shell">
        <SectionHead title={title} body={body} align="center" />

        <div className="relative mt-16 overflow-hidden">
          <Figure src={image} alt={title} ratio="aspect-[16/9] md:aspect-[16/9.5]" />

          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="grid size-20 place-items-center rounded-xl border-2 border-ivory/40 bg-ink/10 backdrop-blur-[2px]">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-ivory">
                <path d="M6 4l14 8-14 8V4z" />
              </svg>
            </span>
          </div>
        </div>

        {ctaLabel && (
          <div className="mt-10 flex justify-center">
            <Button to={ctaTo ?? '/ecosystem'} variant="quiet">
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
