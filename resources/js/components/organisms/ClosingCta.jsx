import Button from '../atoms/Button'
import Display from '../atoms/Display'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

/**
 * CTA penutup halaman dalam. Semuanya bermuara ke formulir yang sama di
 * beranda — pada desain Figma tidak ada halaman kontak terpisah.
 */
export default function ClosingCta({ title, subtitle, label, to = '/#kolaborasi' }) {
  const ref = useReveal()

  return (
    <section className="bg-ink text-ivory">
      <div ref={ref} className="reveal shell section text-center">
        <Display size="lg" className="mx-auto max-w-3xl text-ivory">
          {title}
        </Display>

        {subtitle && (
          <Paragraph tone="invert" className="measure mx-auto mt-6">
            {subtitle}
          </Paragraph>
        )}

        <div className="mt-12 flex justify-center">
          <Button to={to} variant="solid">
            {label}
          </Button>
        </div>
      </div>
    </section>
  )
}
