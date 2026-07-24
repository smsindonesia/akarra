export default function Paragraph({ children, className = '', tone = 'default', ...props }) {
  const tones = {
    default: 'text-body',
    muted: 'text-muted',
    invert: 'text-ivory-soft',
  }

  return (
    <p className={`text-[15px] leading-[1.85] ${tones[tone]} ${className}`} {...props}>
      {children}
    </p>
  )
}
