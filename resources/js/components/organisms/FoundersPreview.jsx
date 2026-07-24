import { Link } from '@inertiajs/react'

import Figure from '../atoms/Figure'
import SectionHead from '../molecules/SectionHead'
import useReveal from '../../hooks/useReveal'

export default function FoundersPreview({ title, subtitle, people = [] }) {
  const ref = useReveal()

  if (people.length === 0) return null

  return (
    <section className="section bg-canvas">
      <div className="shell">
        <SectionHead title={title} body={subtitle} align="center" className="max-w-2xl" />

        <div ref={ref} className="reveal mx-auto mt-16 grid max-w-3xl gap-10 sm:grid-cols-2">
          {people.map((person) => (
            <Link key={person.name} href="/founders" className="group block">
              <Figure src={person.portrait} alt={person.name} ratio="aspect-[3/4]" />

              <h3 className="mt-8 font-display text-2xl font-medium text-gold transition-opacity group-hover:opacity-80">
                {person.name}
              </h3>

              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-body">
                {person.role}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
