import Eyebrow from '../atoms/Eyebrow'
import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

export default function FounderCard({ name, role, body, portrait, reverse = false }) {
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
        <h3 className="mt-4 font-display text-3xl font-light md:text-4xl">{name}</h3>

        {body ? (
          <Paragraph className="measure mt-6">{body}</Paragraph>
        ) : (
          <Paragraph tone="muted" className="measure mt-6 italic">
            Deskripsi belum tersedia.
          </Paragraph>
        )}
      </div>
    </div>
  )
}
