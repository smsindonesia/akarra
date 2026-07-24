import { Link } from '@inertiajs/react'

import Figure from '../atoms/Figure'
import Paragraph from '../atoms/Paragraph'

export default function SolutionCard({ title, body, image, to = '/products' }) {
  return (
    <Link href={to} className="group block border border-line bg-canvas p-1 transition-colors hover:border-gold/50">
      <Figure src={image} alt={title} ratio="aspect-[16/9]" />

      <div className="p-6">
        <h3 className="font-display text-2xl font-medium text-ink transition-colors group-hover:text-gold">
          {title}
        </h3>

        <Paragraph className="mt-2 text-[15px] leading-[1.6]">{body}</Paragraph>
      </div>
    </Link>
  )
}
