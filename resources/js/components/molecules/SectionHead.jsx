import Display from '../atoms/Display'
import Eyebrow from '../atoms/Eyebrow'
import Paragraph from '../atoms/Paragraph'
import useReveal from '../../hooks/useReveal'

export default function SectionHead({
  eyebrow,
  title,
  emphasis,
  body,
  align = 'left',
  tone = 'default',
  className = '',
}) {
  const ref = useReveal()
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left'

  return (
    <div ref={ref} className={`reveal flex flex-col ${alignment} ${className}`}>
      {eyebrow && <Eyebrow tone={tone === 'invert' ? 'invert' : 'gold'}>{eyebrow}</Eyebrow>}

      <Display
        size="md"
        emphasis={emphasis}
        className={`${eyebrow ? 'mt-5' : ''} ${tone === 'invert' ? 'text-ivory' : 'text-ink'}`}
      >
        {title}
      </Display>

      {body && (
        <Paragraph
          tone={tone === 'invert' ? 'invert' : 'default'}
          className={`measure mt-6 ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {body}
        </Paragraph>
      )}
    </div>
  )
}
