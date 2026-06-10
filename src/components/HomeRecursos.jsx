const featured = [
  { slug: 'necesito-ir-al-psicologo', title: '¿Necesito ir al psicólogo?', desc: 'Señales simples, sin dramatismo, para darte cuenta.', min: 2 },
  { slug: 'mitos-que-conviene-dejar-atras', title: 'Mitos que (te) conviene dejar atrás', desc: 'Ideas muy instaladas sobre la terapia y el bienestar que te están frenando.', min: 4 },
  { slug: 'dormir-mejor-cuando-cuesta-apagar-la-cabeza', title: 'Dormir mejor cuando cuesta apagar la cabeza', desc: 'Por qué pasa y qué podés hacer, con herramientas realistas.', min: 3 },
]

export default function HomeRecursos() {
  return (
    <section className="recursos-home" id="recursos">
      <div className="section-inner">
        <div className="section-eyebrow">Recursos</div>
        <h2 className="section-title">Para leer y pensar<em>te</em>.</h2>
        <p className="section-lead">Textos breves para acompañarte estés donde estés.</p>
        <div className="recursos-cards">
          {featured.map((a) => (
            <a key={a.slug} className="recursos-card" href={`/recursos/${a.slug}/`}>
              <div className="recursos-card-meta">{a.min} min de lectura</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <span className="recursos-card-go">Leer →</span>
            </a>
          ))}
        </div>
        <a className="recursos-all" href="/recursos/">Ver todos los recursos →</a>
      </div>
    </section>
  )
}
