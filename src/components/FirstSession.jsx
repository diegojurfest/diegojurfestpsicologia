export default function FirstSession({ t }) {
  return (
    <section className="first-session" id="first-session">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-eyebrow">{t.first_eyebrow}</div>
          <h2 className="section-title">
            {t.first_title_a}<em>{t.first_title_b}</em>{t.first_title_c}
          </h2>
        </div>
        <div className="first-session-card reveal">
          <p className="first-session-headline">{t.first_headline}</p>
          <p className="first-session-body">
            {t.first_body_a}
            <span className="accent">{t.first_body_b}</span>
            {t.first_body_c}
          </p>
          <div className="first-session-steps">
            {t.first_steps.map((step, i) => (
              <div className="first-session-step" key={i}>
                <div className="first-session-step-num">{String(i + 1).padStart(2, '0')}</div>
                <p className="first-session-step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
