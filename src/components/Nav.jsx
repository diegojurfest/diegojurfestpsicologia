export default function Nav({ t, lang, setLang }) {
  return (
    <nav className="nav">
      <div className="nav-brand">Lic. Diego Jurfest</div>
      <div className="nav-links">
        <a href="#about">{t.nav_about}</a>
        <a href="#help">{t.nav_help}</a>
        <a href="#approach">{t.nav_approach}</a>
        <a href="#first-session">{t.nav_first}</a>
        <a href="#contact">{t.nav_contact}</a>
      </div>
      <div className="lang-toggle">
        <button
          className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
          onClick={() => setLang('es')}
        >ES</button>
        <button
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
        >EN</button>
        <button
          className={`lang-btn ${lang === 'he' ? 'active' : ''}`}
          onClick={() => setLang('he')}
        >עב</button>
      </div>
    </nav>
  )
}
