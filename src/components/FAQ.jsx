const faqs = [
  { q: '¿Cómo son las sesiones?', a: 'Son 100% online, por videollamada en una sala privada de Google Meet. Desde donde estés: solo necesitás conexión y un lugar tranquilo.' },
  { q: '¿En qué idiomas atendés?', a: 'En español e inglés — el idioma en el que te sientas más vos.' },
  { q: '¿Es confidencial?', a: 'Totalmente. Sala privada con link único, sin grabaciones ni registros, y todo bajo secreto profesional. Lo que se habla queda entre nosotros.' },
  { q: '¿Cómo coordinamos los horarios?', a: 'Con disponibilidad amplia que respeta tu zona horaria. Estés en Israel, Europa, América o donde sea, buscamos un horario que te sirva.' },
  { q: '¿Cómo puedo pagar?', a: 'Con medios de pago locales de Israel y métodos internacionales, en la moneda que te quede cómoda, sin complicaciones de conversión.' },
  { q: '¿Cómo es la primera consulta?', a: 'Es una primera charla para conocernos y ver si puedo ayudarte. Sin compromiso: conversamos y después decidís vos.' },
]

export default function FAQ() {
  return (
    <section className="faq" id="faq">
      <div className="section-inner">
        <div className="section-eyebrow">Preguntas frecuentes</div>
        <h2 className="section-title">Lo que solés <em>preguntarte</em>.</h2>
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
