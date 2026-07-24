import { Link } from '@inertiajs/react'

import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'

export default function SolutionCard({ title, body, image, to = '/products' }) {
  return (
    <Link href={to} className="group block">
      <Figure src={image} alt={title} ratio="aspect-[4/5]" />

      <h3 className="mt-6 font-display text-2xl font-light text-ink transition-colors group-hover:text-gold">
        {title}
      </h3>

      <Paragraph className="mt-3">{body}</Paragraph>
    </Link>
  )
}
