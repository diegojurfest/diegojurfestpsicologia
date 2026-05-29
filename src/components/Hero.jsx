import diegoPhoto from '../assets/diego-retrato.jpg'

function Leaf() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 4C24 18 12 44 18 78c2 11 9 18 18 18 30 0 46-34 46-72 0-8-1-15-3-20-9 6-20 8-29 0z" />
      <path d="M50 14c-14 18-22 40-22 64" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function Hero({ t, waUrl }) {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <div>
          <div className="hero-eyebrow">{t.hero_eyebrow}</div>
          <h1 className="hero-name">Diego <em>Jurfest</em></h1>
          <div className="hero-credential">{t.hero_credential}</div>
          <p className="hero-headline">{t.hero_headline}</p>
          <div className="hero-cta-wrap">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hero-cta" onClick={() => window.gtag?.('event', 'whatsapp_click', { location: 'hero' })}>
              <span>{t.hero_cta_text}</span>
              <span className="hero-cta-arrow">→</span>
            </a>
            <span className="hero-subcta">{t.hero_subcta}</span>
          </div>
        </div>
        <div className="hero-photo-wrap">
          <div className="hero-photo-ring">
            <span className="hero-leaf hero-leaf-1" aria-hidden="true"><Leaf /></span>
            <span className="hero-leaf hero-leaf-2" aria-hidden="true"><Leaf /></span>
            <span className="hero-leaf hero-leaf-3" aria-hidden="true"><Leaf /></span>
            <img className="hero-photo-img" src={diegoPhoto} alt="Diego Jurfest" />
          </div>
        </div>
      </div>
    </section>
  )
}
