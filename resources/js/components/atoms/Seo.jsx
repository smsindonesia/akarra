import { Head } from '@inertiajs/react'

import { useContent } from '../../hooks/useContent'
import { toAbsoluteUrl } from '../../lib/seo'

/**
 * Satu titik untuk semua tag SEO per halaman: judul, deskripsi, canonical,
 * Open Graph, Twitter Card, dan JSON-LD terstruktur. Dipakai di setiap
 * halaman publik supaya mesin pencari maupun crawler AI (yang membaca
 * meta tag dan structured data, bukan tampilan visual) mendapat data yang
 * sama lengkapnya di setiap halaman.
 *
 * `title` adalah judul singkat halaman (mis. "Services", judul artikel).
 * `app.jsx` sudah punya template global yang menambahkan " | AKARRA" ke tag
 * <title> — jadi jangan tambahkan nama situs lagi di sini, cukup kirim
 * judul polosnya. Untuk og:title/twitter:title, komponen ini meniru sufiks
 * yang sama supaya pratinjau share konsisten dengan tab browser.
 * `jsonLd` boleh satu objek schema.org atau array beberapa objek.
 */
export default function Seo({
  title,
  description,
  canonicalUrl,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  children,
}) {
  const { get } = useContent()
  const siteName = get('global', 'site_name', 'AKARRA')
  const rawImage = image || get('global', 'og_image', '')
  const twitterHandle = get('global', 'twitter_handle', '')
  // Foto/video yang diunggah admin disimpan sebagai path relatif (lihat
  // config/filesystems.php) supaya tetap benar di lokal maupun produksi,
  // tapi og:image/twitter:image wajib URL absolut per spesifikasinya —
  // jadi domainnya diambil dari canonicalUrl (yang memang selalu absolut).
  // toAbsoluteUrl dipakai bersama PublicLayout/Articles/Show supaya aturan
  // "relatif -> absolut" cuma punya satu implementasi.
  const absoluteImage = toAbsoluteUrl(rawImage, canonicalUrl)
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
  const fullTitle = title ? `${title} | ${siteName}` : siteName

  return (
    <Head title={title}>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="id_ID" />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}

      <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {children}
    </Head>
  )
}
