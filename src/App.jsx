import { useLanguage, useScrollReveal } from './hooks'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Help from './components/Help'
import Approach from './components/Approach'
import FirstSession from './components/FirstSession'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const { lang, setLang, t, waUrl, mailUrl } = useLanguage()
  useScrollReveal()

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} waUrl={waUrl} />
      <About t={t} />
      <Help t={t} />
      <Approach t={t} />
      <FirstSession t={t} />
      <Contact t={t} waUrl={waUrl} mailUrl={mailUrl} />
      <Footer t={t} waUrl={waUrl} mailUrl={mailUrl} />
    </>
  )
}
