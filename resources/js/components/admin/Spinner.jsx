export default function Spinner({ className = 'h-6 w-6' }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      className={`inline-block animate-spin rounded-full border-2 border-ink/15 border-t-gold ${className}`}
    />
  )
}
