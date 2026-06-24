export default function FAQ({ t }) {
  const faqs = t.faq_items
  return (
    <section className="faq" id="faq">
      <div className="section-inner">
        <div className="section-eyebrow">{t.faq_eyebrow}</div>
        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.faq_title }} />
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </section>
  )
}
