export default function Paragraph({ children, className = '', tone = 'default', ...props }) {
  const tones = {
    default: 'text-ink/75',
    muted: 'text-muted',
    invert: 'text-ivory/70',
  }

  return (
    <p className={`text-[15px] leading-[1.85] ${tones[tone]} ${className}`} {...props}>
      {children}
    </p>
  )
}
