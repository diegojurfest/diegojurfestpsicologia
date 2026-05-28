export default function Approach({ t }) {
  return (
    <section className="approach" id="approach">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-eyebrow">{t.approach_eyebrow}</div>
          <h2 className="section-title">
            {t.approach_title_a}<em>{t.approach_title_b}</em>{t.approach_title_c}
          </h2>
          <p className="section-lead" style={{ color: 'var(--teal-faint)' }}>{t.approach_lead}</p>
        </div>
        <div className="approach-grid">
          {t.approach_items.map(([title, text], i) => (
            <div className="approach-item reveal" key={i}>
              <h3 className="approach-item-title">{title}</h3>
              <p className="approach-item-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
