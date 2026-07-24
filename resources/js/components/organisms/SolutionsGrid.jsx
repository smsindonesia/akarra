import SectionHead from '../molecules/SectionHead'
import SolutionCard from '../molecules/SolutionCard'
import useReveal from '../../hooks/useReveal'

export default function SolutionsGrid({ title, subtitle, items = [] }) {
  const ref = useReveal()

  if (items.length === 0) return null

  return (
    <section className="section">
      <div className="shell">
        <SectionHead title={title} body={subtitle} />

        <div ref={ref} className="reveal mt-16 grid gap-10 md:grid-cols-2 md:gap-14">
          {items.map((item) => (
            <SolutionCard key={item.title} title={item.title} body={item.body} image={item.image} />
          ))}
        </div>
      </div>
    </section>
  )
}
