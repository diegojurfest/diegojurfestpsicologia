import { useState } from 'react'

export default function Nav({ t, lang, setLang, showRecursos }) {
  const [open, setOpen] = useState(false)

  const links = [
    ['#about', t.nav_about],
    ['#help', t.nav_help],
    ['#approach', t.nav_approach],
    ['#first-session', t.nav_first],
    ...(showRecursos ? [['/recursos/', t.nav_recursos]] : []),
    ['#contact', t.nav_contact],
  ]

  return (
    <nav className="nav">
      <a className="nav-brand" href="#top">
        <img className="nav-logo" src="/dj-monograma-teal.png" alt="" aria-hidden="true" />
        <span className="nav-brand-text"><span className="nav-brand-prefix">Lic. </span>Diego Jurfest</span>
      </a>

      <div className="nav-links">
        {links.map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </div>

      <div className="nav-right">
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>ES</button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn ${lang === 'he' ? 'active' : ''}`} onClick={() => setLang('he')}>עב</button>
        </div>

        <button
          className={`nav-burger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menú"
          aria-expanded={open}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </div>
    </nav>
  )
}
