/**
 * Mengubah path relatif menjadi URL absolut.
 *
 * Media sengaja disimpan relatif (/storage/...) di database supaya tidak
 * terkunci ke satu domain. Tapi og:image, twitter:image, dan Organization.logo
 * di JSON-LD semuanya mensyaratkan URL absolut — scraper WhatsApp/Facebook dan
 * Google Rich Results tidak me-resolve path relatif. Konversinya dilakukan saat
 * render, dengan origin diambil dari URL kanonik halaman.
 */
export function toAbsoluteUrl(value, base) {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  if (!base) return value

  try {
    return new URL(value, base).toString()
  } catch {
    return value
  }
}

/** JSON-LD BreadcrumbList — dipakai di semua halaman dalam untuk membantu
 *  mesin pencari dan crawler AI memahami posisi halaman dalam struktur situs. */
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
