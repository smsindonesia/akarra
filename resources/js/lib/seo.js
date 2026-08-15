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
