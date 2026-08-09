import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { translations } from '../i18n/translations'

const STORAGE_KEY = 'akarra-lang'

const LanguageContext = createContext(null)

function readInitialLanguage() {
  if (typeof window === 'undefined') return 'id'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' || stored === 'id' ? stored : 'id'
}

/**
 * Menerjemahkan teks UI statis (menu, tombol, label form, dll). Konten yang
 * dikelola admin lewat panel Settings tidak ikut diterjemahkan di sini.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readInitialLanguage)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => {
    const t = (key) => translations[key]?.[language] ?? translations[key]?.id ?? key

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'id' ? 'en' : 'id')),
      t,
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
