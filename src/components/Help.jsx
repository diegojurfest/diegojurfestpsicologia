export default function Help({ t }) {
  return (
    <section className="help" id="help">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-eyebrow">{t.help_eyebrow}</div>
          <h2 className="section-title">
            {t.help_title_a}<em>{t.help_title_b}</em>{t.help_title_c}
          </h2>
          <p className="section-lead">{t.help_lead}</p>
        </div>
        <div className="help-grid">
          {t.help_items.map(([name, desc], i) => (
            <div className="help-item reveal" key={i}>
              <div className="help-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="help-name">{name}</h3>
              <p className="help-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
