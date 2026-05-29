export default function Contact({ t, waUrl, mailUrl }) {
  return (
    <section className="contact" id="contact">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-eyebrow">{t.contact_eyebrow}</div>
          <h2 className="section-title">
            {t.contact_title_a}<em>{t.contact_title_b}</em>{t.contact_title_c}
          </h2>
          <p className="section-lead">{t.contact_lead}</p>
        </div>
        <div className="contact-buttons reveal">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-primary" onClick={() => window.gtag?.('event', 'whatsapp_click', { location: 'contact' })}>
            <span>{t.contact_btn_wa}</span>
            <span>→</span>
          </a>
          <a href={mailUrl} className="contact-btn contact-btn-secondary">
            <span>{t.contact_btn_mail}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
