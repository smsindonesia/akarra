import Button from '../atoms/Button'
import SectionHead from '../molecules/SectionHead'
import ServiceCard from '../molecules/ServiceCard'
import useReveal from '../../hooks/useReveal'

export default function ServicesEcosystem({ title, subtitle, pillars = [], ctaLabel }) {
  const ref = useReveal()

  return (
    <section id="layanan" className="section bg-ivory">
      <div className="shell">
        <SectionHead title={title} body={subtitle} />

        <div ref={ref} className="reveal mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {pillars.map((pillar, index) => (
            <ServiceCard
              key={pillar.name}
              index={index}
              name={pillar.name}
              label={pillar.label}
              body={pillar.body}
            />
          ))}
        </div>

        {ctaLabel && (
          <div className="mt-16">
            <Button to="/services" variant="quiet">
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
