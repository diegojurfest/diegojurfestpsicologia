import { useState, useEffect } from 'react'
import { translations } from './translations'

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'es'
    } catch {
      return 'es'
    }
  })

  const t = translations[lang] || translations.es

  useEffect(() => {
    document.documentElement.lang = t.lang
    document.documentElement.dir = t.dir
    document.title = t.page_title
    try {
      localStorage.setItem('lang', lang)
    } catch {}
  }, [lang, t])

  const setLang = (newLang) => {
    if (translations[newLang]) setLangState(newLang)
  }

  // WhatsApp & email URLs
  const waUrl = `https://wa.me/59893383251?text=${encodeURIComponent(t.wa_msg)}`
  const mailUrl = `mailto:diegojurfest@gmail.com?subject=${encodeURIComponent(t.mail_subject)}&body=${encodeURIComponent(t.mail_body)}`

  return { lang, setLang, t, waUrl, mailUrl }
}

// Custom hook for scroll reveal
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' })

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
