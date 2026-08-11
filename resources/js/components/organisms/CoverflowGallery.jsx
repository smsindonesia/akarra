import { useEffect, useRef, useState } from 'react'

import Figure from '../atoms/Figure'

const MAX_PHOTOS = 10
const SLIDE_INTERVAL_MS = 3000
const DRAG_THRESHOLD_PX = 50
const SPACING_PERCENT = 62

/** Jarak berputar terpendek (bisa negatif) dari `current` ke index `i`, hasilnya dipakai untuk transform tiap slide — inilah yang membuat loop dari foto terakhir ke foto pertama terasa mulus, bukan lompat. */
function circularOffset(i, current, length) {
  let diff = i - current
  const half = length / 2
  if (diff > half) diff -= length
  if (diff < -half) diff += length
  return diff
}

/**
 * Galeri "coverflow": satu foto besar di tengah, foto-foto lain mengintip
 * (peek) di kiri/kanan dengan skala, opacity, dan kemiringan 3D yang
 * berkurang sesuai jaraknya dari tengah. Auto-geser tiap 3 detik, infinite
 * loop, dan bisa digeser manual lewat drag/swipe atau tombol panah.
 *
 * Maksimal 10 foto pertama dari `images` yang ditampilkan — bukan sumber
 * data baru, hanya cara menampilkan array yang sama.
 */
export default function CoverflowGallery({ images = [], alt = '' }) {
  const photos = images.slice(0, MAX_PHOTOS)

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragPercent, setDragPercent] = useState(0)
  const dragRef = useRef({ startX: 0, width: 1 })
  const containerRef = useRef(null)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Reset ke slide pertama kalau daftar gambarnya berganti (mis. admin baru
  // saja mengubah galeri, atau berpindah halaman).
  useEffect(() => {
    setIndex(0)
  }, [images])

  useEffect(() => {
    if (photos.length <= 1 || paused || reducedMotionRef.current) return undefined

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % photos.length)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(id)
  }, [photos.length, paused])

  if (photos.length === 0) return null

  const goTo = (next) => {
    setIndex(((next % photos.length) + photos.length) % photos.length)
  }

  const endDrag = (deltaXOverride) => {
    const deltaX = deltaXOverride ?? (dragPercent / 100) * dragRef.current.width

    if (deltaX <= -DRAG_THRESHOLD_PX) {
      goTo(index + 1)
    } else if (deltaX >= DRAG_THRESHOLD_PX) {
      goTo(index - 1)
    }

    setDragging(false)
    setDragPercent(0)
    setPaused(false)
  }

  const onPointerDown = (e) => {
    if (photos.length <= 1) return
    dragRef.current = { startX: e.clientX, width: containerRef.current?.offsetWidth || 1 }
    setDragging(true)
    setPaused(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    const deltaX = e.clientX - dragRef.current.startX
    setDragPercent((deltaX / dragRef.current.width) * 100)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1)
    if (e.key === 'ArrowRight') goTo(index + 1)
  }

  const showControls = photos.length > 1
  const liveOffset = dragging ? dragPercent / 100 : 0

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={alt}
      tabIndex={0}
      className="relative w-full touch-pan-y select-none overflow-hidden outline-none [perspective:1400px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false)
        if (dragging) endDrag(0)
      }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => endDrag()}
      onPointerCancel={() => endDrag(0)}
    >
      <div
        className="relative mx-auto aspect-[16/10] [transform-style:preserve-3d]"
        style={{ width: 'clamp(220px, 62%, 620px)' }}
      >
        {photos.map((src, i) => {
          const v = circularOffset(i, index, photos.length) - liveOffset
          const abs = Math.min(Math.abs(v), 3)
          const scale = Math.max(1 - abs * 0.22, 0.56)
          const opacity = Math.max(1 - abs * 0.45, 0)
          const rotateY = -Math.sign(v) * Math.min(Math.abs(v), 1) * 22
          const translateX = v * SPACING_PERCENT
          const isCenter = Math.abs(v) < 0.5

          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden={!isCenter}
              onClick={() => !isCenter && goTo(i)}
              className={`absolute inset-0 ${isCenter ? 'cursor-default' : 'cursor-pointer'}`}
              style={{
                transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex: Math.round(100 - abs * 10),
                transition: dragging
                  ? 'none'
                  : 'transform 0.7s var(--ease-editorial), opacity 0.7s var(--ease-editorial)',
                pointerEvents: opacity < 0.05 ? 'none' : 'auto',
              }}
            >
              <Figure src={src} alt={`${alt} ${i + 1}`} ratio="h-full" className="h-full shadow-[0_20px_45px_-20px_rgba(28,25,23,0.35)]" />
            </button>
          )
        })}
      </div>

      {showControls && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Foto sebelumnya"
            className="absolute left-1 top-1/2 z-[200] grid h-9 w-9 -translate-y-1/2 place-items-center border border-ink/20 bg-canvas/80 text-ink backdrop-blur-sm transition-colors hover:bg-canvas md:left-3"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Foto berikutnya"
            className="absolute right-1 top-1/2 z-[200] grid h-9 w-9 -translate-y-1/2 place-items-center border border-ink/20 bg-canvas/80 text-ink backdrop-blur-sm transition-colors hover:bg-canvas md:right-3"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}
