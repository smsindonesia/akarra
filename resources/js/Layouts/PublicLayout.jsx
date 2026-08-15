import { useEffect } from 'react'
import { Head, usePage } from '@inertiajs/react'

import Footer from '../components/organisms/Footer'
import Navbar from '../components/organisms/Navbar'
import { LanguageProvider, useLanguage } from '../context/LanguageContext'
import { useContent } from '../hooks/useContent'

/**
 * Kerangka halaman publik: Top Navigation Bar -> Main -> Footer,
 * persis susunan layer tiap frame di Figma.
 */
export default function PublicLayout({ children }) {
  return (
    <LanguageProvider>
      <PublicLayoutBody>{children}</PublicLayoutBody>
    </LanguageProvider>
  )
}

function PublicLayoutBody({ children }) {
  const { url } = usePage()
  const { t } = useLanguage()
  const { get, list } = useContent()
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

  // Identitas organisasi berlaku di seluruh situs, jadi cukup dipasang sekali
  // di sini — bukan diulang per halaman — supaya crawler (termasuk AI) selalu
  // punya konteks siapa pemilik situs ini di halaman mana pun.
  const siteName = get('global', 'site_name', 'AKARRA')
  const socialLinks = list('global', 'social')
    .map((item) => item.url)
    .filter(Boolean)
  const logo = get('global', 'og_image', '')

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: route('home'),
    description: get('global', 'description', ''),
    ...(logo && { logo }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: route('home'),
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </Head>

      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-dark focus:px-5 focus:py-3 focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-ivory"
      >
        {t('skipToContent')}
      </a>

      <Navbar />

      <main id="konten" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}
