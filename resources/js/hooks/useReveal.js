import { useEffect, useRef } from 'react'

/**
 * Menandai elemen sebagai terlihat saat masuk viewport, sekali saja.
 * Animasinya sendiri diatur lewat kelas .reveal di app.css, yang sudah
 * menghormati prefers-reduced-motion.
 */
export default function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return ref
}
