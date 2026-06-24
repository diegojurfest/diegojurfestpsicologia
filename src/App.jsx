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
  // Recursos y FAQ están escritos solo en español por ahora. En inglés/hebreo
  // se ocultan para no mezclar idiomas (traducción pendiente).
  const recursosEs = RECURSOS_LIVE && lang === 'es'

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} showRecursos={recursosEs} />
      <Hero t={t} waUrl={waUrl} />
      <About t={t} />
      <Help t={t} />
      <Approach t={t} />
      {recursosEs && <HomeRecursos />}
      <FirstSession t={t} />
      <Contact t={t} waUrl={waUrl} mailUrl={mailUrl} />
      {recursosEs && <FAQ />}
      <Footer t={t} waUrl={waUrl} mailUrl={mailUrl} />
      {RECURSOS_LIVE && <FloatingWhatsApp waUrl={waUrl} />}
    </>
  )
}
