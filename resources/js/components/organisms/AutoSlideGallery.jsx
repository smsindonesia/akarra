import { useEffect, useRef, useState } from 'react'

import Figure from '../atoms/Figure'

const SLIDE_INTERVAL_MS = 4000

/**
 * Galeri foto satu-gambar-besar yang bergeser otomatis, dipakai pada pilar
 * layanan yang punya beberapa foto (lihat pillar.gallery). Berhenti otomatis
 * bergeser saat kursor/hover atau fokus keyboard berada di dalam komponen ini,
 * dan tidak bergeser otomatis sama sekali kalau prefers-reduced-motion aktif —
 * navigasi manual (panah/dot) tetap berfungsi dalam kedua kasus.
 */
export default function AutoSlideGallery({ images = [], alt = '', ratio = 'aspect-[4/5]' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Reset ke slide pertama kalau daftar gambarnya berganti (mis. admin baru
  // saja mengubah galeri di panel lain / navigasi halaman).
  useEffect(() => {
    setIndex(0)
  }, [images])

  useEffect(() => {
    if (images.length <= 1 || paused || reducedMotionRef.current) return undefined

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(id)
  }, [images.length, paused])

  if (images.length === 0) return null

  const showControls = images.length > 1

  const goTo = (next) => {
    setIndex(((next % images.length) + images.length) % images.length)
  }

  return (
    <div
      className={`${ratio} relative overflow-hidden bg-sand`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-[var(--ease-editorial)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="h-full w-full shrink-0">
            <Figure src={src} alt={images.length > 1 ? `${alt} ${i + 1}` : alt} ratio="h-full" className="h-full" />
          </div>
        ))}
      </div>

      {showControls && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-ivory/40 bg-dark/30 text-ivory backdrop-blur-sm transition-colors hover:bg-dark/60"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-ivory/40 bg-dark/30 text-ivory backdrop-blur-sm transition-colors hover:bg-dark/60"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ke foto ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-ivory' : 'bg-ivory/50 hover:bg-ivory/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
