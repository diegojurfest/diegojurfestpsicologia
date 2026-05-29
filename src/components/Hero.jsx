import diegoPhoto from '../assets/diego-retrato.jpg'

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
            <img className="hero-photo-img" src={diegoPhoto} alt="Diego Jurfest" />
          </div>
        </div>
      </div>
    </section>
  )
}
