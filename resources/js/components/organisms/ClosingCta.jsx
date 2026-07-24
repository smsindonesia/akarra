import Button from '../atoms/Button'
import Display from '../atoms/Display'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

/**
 * CTA penutup halaman dalam. Semuanya bermuara ke formulir yang sama di
 * beranda — pada desain Figma tidak ada halaman kontak terpisah.
 *
 * `tone="light"` dipakai ketika CTA berada di section terang (mis. Products'
 * "Ready to redefine your baseline?"); default `dark` untuk section
 * zinc-800 seperti "Join the Inner Circle".
 */
export default function ClosingCta({
  title,
  subtitle,
  label,
  to = '/#kolaborasi',
  secondaryLabel,
  secondaryTo,
  tone = 'dark',
}) {
  const ref = useReveal()
  const isDark = tone === 'dark'

  return (
    <section className={isDark ? 'bg-dark text-ivory' : 'bg-canvas text-ink'}>
      <div ref={ref} className="reveal shell section text-center">
        <Display size="lg" className={`mx-auto max-w-3xl ${isDark ? 'text-ivory' : 'text-ink'}`}>
          {title}
        </Display>

        {subtitle && (
          <Paragraph tone={isDark ? 'invert' : 'default'} className="measure mx-auto mt-6">
            {subtitle}
          </Paragraph>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Button to={to} variant="solid">
            {label}
          </Button>

          {secondaryLabel && (
            <Button to={secondaryTo ?? to} variant={isDark ? 'outlineInvert' : 'outlineMuted'}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
