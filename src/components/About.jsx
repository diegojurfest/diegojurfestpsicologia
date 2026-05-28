export default function About({ t }) {
  return (
    <section className="about" id="about">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-side reveal">
            <div className="section-eyebrow">{t.about_eyebrow}</div>
            <h2 className="section-title">
              {t.about_title_a}<em>{t.about_title_b}</em>{t.about_title_c}
            </h2>
            <div className="about-quote">{t.about_quote}</div>
          </div>
          <div className="about-text reveal">
            <p>{t.about_p1_a}<strong>{t.about_p1_b}</strong>{t.about_p1_c}</p>
            <p dangerouslySetInnerHTML={{ __html: t.about_p2 }} />
            <p dangerouslySetInnerHTML={{ __html: t.about_p3 }} />
            <div className="about-divider"></div>
            <p><strong>{t.about_p4}</strong></p>
            <p>{t.about_p5}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
