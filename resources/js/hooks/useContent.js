import { useMemo } from 'react'
import { usePage } from '@inertiajs/react'

import { fallbackContent } from '../content/fallback'
import { useLanguage } from '../context/LanguageContext'

/**
 * Menimpa nilai cadangan dengan nilai dari `settings` (dibagikan lewat
 * Inertia di setiap kunjungan), per grup. Nilai kosong diabaikan agar
 * halaman tidak berubah jadi bolong ketika ada field yang belum diisi admin.
 */
function merge(base, incoming) {
  if (!incoming) return base

  const result = {}

  for (const group of Object.keys(base)) {
    result[group] = { ...base[group] }

    for (const [key, value] of Object.entries(incoming[group] ?? {})) {
      const isEmpty =
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

      if (!isEmpty) result[group][key] = value
    }
  }

  // Grup baru dari backend yang belum ada di fallback tetap dibawa.
  for (const group of Object.keys(incoming)) {
    if (!result[group]) result[group] = incoming[group]
  }

  return result
}

/**
 * Pengganti ContentProvider React Query lama. Karena `settings` sudah hadir
 * di payload halaman pertama (dibagikan oleh HandleInertiaRequests), tidak
 * ada lagi status loading terpisah — kontennya selalu tersedia begitu
 * halaman dirender.
 *
 * `settings` dibagikan lengkap untuk kedua bahasa (`{ id: {...}, en: {...} }`)
 * supaya toggle ID/EN instan tanpa kunjungan baru ke server — hook ini
 * tinggal memilih bagian yang sesuai `language` dari LanguageContext.
 */
export function useContent() {
  const { settings } = usePage().props
  const { language } = useLanguage()

  return useMemo(() => {
    const content = merge(fallbackContent, settings?.[language])

    return {
      content,

      /** get('home', 'hero_title') */
      get: (group, key, fallback = '') => content[group]?.[key] ?? fallback,

      /** list('services', 'pillars') — selalu mengembalikan array */
      list: (group, key) => {
        const value = content[group]?.[key]
        return Array.isArray(value) ? value : []
      },
    }
  }, [settings, language])
}
