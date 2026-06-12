import { useState, useEffect } from 'react'
import { useLanguage, useScrollReveal } from './hooks'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Help from './components/Help'
import Approach from './components/Approach'
import FirstSession from './components/FirstSession'
import HomeRecursos from './components/HomeRecursos'
import FAQ from './components/FAQ'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Recursos en vivo para todo el público.
const RECURSOS_LIVE = true

export default function App() {
  const { lang, setLang, t, waUrl, mailUrl } = useLanguage()
  useScrollReveal()
  const [showRecursos, setShowRecursos] = useState(RECURSOS_LIVE)
  useEffect(() => {
    if (RECURSOS_LIVE) return
    try {
      if (new URLSearchParams(window.location.search).get('preview') === 'recursos') {
        localStorage.setItem('rec_prev', '1')
      }
      if (localStorage.getItem('rec_prev') === '1') setShowRecursos(true)
    } catch { /* almacenamiento no disponible (modo privado) */ }
  }, [])

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} showRecursos={showRecursos} />
      <Hero t={t} waUrl={waUrl} />
      <About t={t} />
      <Help t={t} />
      <Approach t={t} />
      {showRecursos && <HomeRecursos />}
      <FirstSession t={t} />
      <Contact t={t} waUrl={waUrl} mailUrl={mailUrl} />
      {showRecursos && <FAQ />}
      <Footer t={t} waUrl={waUrl} mailUrl={mailUrl} />
      {showRecursos && <FloatingWhatsApp waUrl={waUrl} />}
    </>
  )
}
