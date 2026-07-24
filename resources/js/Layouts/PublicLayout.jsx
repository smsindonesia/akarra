import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'

import Footer from '../components/organisms/Footer'
import Navbar from '../components/organisms/Navbar'

/**
 * Kerangka halaman publik: Top Navigation Bar -> Main -> Footer,
 * persis susunan layer tiap frame di Figma.
 */
export default function PublicLayout({ children }) {
  const { url } = usePage()
  const [path, hash] = url.split('#')

  // Berpindah halaman harus mengembalikan posisi ke atas, kecuali saat menuju
  // anchor tertentu seperti #kolaborasi.
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [path, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-ink focus:px-5 focus:py-3 focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-ivory"
      >
        Lompat ke konten
      </a>

      <Navbar />

      <main id="konten" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}
