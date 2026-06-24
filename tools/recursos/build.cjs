// Genera la sección Recursos (índice + 8 artículos) como HTML estático con la marca.
// Uso: node tools/recursos/build.cjs   (salida en /public/recursos/)
//
// PREVIEW=true -> robots noindex (mientras se revisa). Al lanzar de verdad,
// poné PREVIEW=false, regenerá, y agregá las URLs al sitemap.
const fs = require('fs');
const path = require('path');
const PUB = path.resolve(__dirname, '../../public');
const PREVIEW = true;
const DATE_ISO = '2026-06-10';
const DATE_HUMAN = 'Junio, 2026';
const SITE = 'https://diegojurfestpsicologia.com';

const WA = 'https://wa.me/59893383251?text=' +
  encodeURIComponent('Hola Diego, me gustaría que agendemos una primera consulta.');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>');
const blocks = arr => arr.map(b =>
  b.ul ? `<ul>${b.ul.map(li => `<li>${fmt(li)}</li>`).join('')}</ul>`
       : `<p>${fmt(b.p)}</p>`).join('\n      ');

// orden de aparición en el índice (los de más enganche arriba)
const ORDER = [
  'necesito-ir-al-psicologo', 'mitos-que-conviene-dejar-atras',
  'dormir-mejor-cuando-cuesta-apagar-la-cabeza',
  'empezar-terapia-por-primera-vez', 'como-es-una-sesion-de-terapia-online',
  'elegir-psicologo-en-espanol-viviendo-lejos', 'ansiedad-cuando-la-guerra-esta-cerca',
  'hacer-alia-desafio-emocional', 'vivir-entre-dos-culturas',
];
// "Seguí leyendo" — 2 artículos relacionados por cada uno
const RELATED = {
  'ansiedad-cuando-la-guerra-esta-cerca': ['dormir-mejor-cuando-cuesta-apagar-la-cabeza', 'necesito-ir-al-psicologo'],
  'elegir-psicologo-en-espanol-viviendo-lejos': ['como-es-una-sesion-de-terapia-online', 'empezar-terapia-por-primera-vez'],
  'hacer-alia-desafio-emocional': ['vivir-entre-dos-culturas', 'elegir-psicologo-en-espanol-viviendo-lejos'],
  'necesito-ir-al-psicologo': ['mitos-que-conviene-dejar-atras', 'empezar-terapia-por-primera-vez'],
  'mitos-que-conviene-dejar-atras': ['necesito-ir-al-psicologo', 'como-es-una-sesion-de-terapia-online'],
  'empezar-terapia-por-primera-vez': ['como-es-una-sesion-de-terapia-online', 'necesito-ir-al-psicologo'],
  'como-es-una-sesion-de-terapia-online': ['empezar-terapia-por-primera-vez', 'elegir-psicologo-en-espanol-viviendo-lejos'],
  'dormir-mejor-cuando-cuesta-apagar-la-cabeza': ['ansiedad-cuando-la-guerra-esta-cerca', 'necesito-ir-al-psicologo'],
  'vivir-entre-dos-culturas': ['hacer-alia-desafio-emocional', 'elegir-psicologo-en-espanol-viviendo-lejos'],
};

const wordsOf = a => (a.hook + ' ' + a.lead + ' ' +
  a.sections.map(s => s.h + ' ' + s.body.map(b => b.ul ? b.ul.join(' ') : b.p).join(' ')).join(' '))
  .split(/\s+/).length;
const readMin = a => Math.max(2, Math.ceil(wordsOf(a) / 170));

const CSS = `
:root{--teal:#0F6E56;--teal-dark:#085041;--teal-soft:#9FE1CB;--teal-faint:#E1F5EE;--cream:#FAF7F0;--paper:#FCFAF4;--ink:#1A2F26;--ink-soft:#4A5C53;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',-apple-system,sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--paper);color:var(--ink-soft);line-height:1.62;-webkit-font-smoothing:antialiased}
.top{position:sticky;top:0;background:rgba(252,250,244,.85);backdrop-filter:blur(12px);border-bottom:1px solid rgba(15,110,86,.08);padding:15px 24px;z-index:10}
.brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--teal-dark);font-family:var(--serif);font-size:19px;font-weight:500;letter-spacing:.5px}
.brand img{display:block;border-radius:8px}
.wrap{max-width:700px;margin:0 auto;padding:50px 24px 76px}
.eyebrow{font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--teal);margin-bottom:16px}
h1{font-family:var(--serif);font-weight:600;font-size:clamp(32px,5.5vw,45px);line-height:1.12;color:var(--ink);letter-spacing:-.5px;margin-bottom:10px}
.byline{font-size:14px;color:var(--ink-soft);opacity:.7;margin-bottom:24px}
.hook{font-family:var(--serif);font-style:italic;font-size:clamp(20px,3vw,24px);line-height:1.46;color:var(--teal-dark);border-left:3px solid var(--teal-soft);padding:3px 0 3px 22px;margin:0 0 20px}
.lead{font-size:18px;color:var(--ink);margin-bottom:22px}
h2{font-family:var(--serif);font-weight:600;font-size:clamp(22px,3.2vw,27px);color:var(--ink);margin:28px 0 8px;letter-spacing:-.3px}
p{font-size:16.5px;margin-bottom:12px}
ul{margin:2px 0 12px;list-style:none}
li{font-size:16.5px;margin-bottom:8px;padding-left:22px;position:relative}
li::before{content:'';position:absolute;left:0;top:11px;width:7px;height:7px;border-radius:50%;background:var(--teal-soft)}
strong{color:var(--ink);font-weight:600}em{font-style:italic}.hl{color:var(--teal)}
.cta{display:inline-flex;align-items:center;gap:10px;margin:30px 0 6px;background:var(--teal);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:15px 28px;border-radius:40px;transition:background .25s}
.cta:hover{background:var(--teal-dark)}
.cta b{font-weight:600;transition:transform .25s}.cta:hover b{transform:translateX(4px)}
.disclaimer{font-size:13px;opacity:.6;font-style:italic;margin-top:16px}
.more{margin-top:46px;border-top:1px solid rgba(15,110,86,.12);padding-top:24px}
.more-t{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--teal);margin-bottom:16px}
.more-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.rcard{display:block;text-decoration:none;background:var(--cream);border:1px solid rgba(15,110,86,.1);border-radius:14px;padding:16px 18px;transition:transform .25s,border-color .25s}
.rcard:hover{transform:translateY(-3px);border-color:var(--teal-soft)}
.rcard h3{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);line-height:1.2;margin-bottom:5px}
.rcard span{font-size:13px;color:var(--teal)}
.back{display:inline-block;margin-top:34px;color:var(--teal);text-decoration:none;font-size:14px;font-weight:500}.back:hover{text-decoration:underline}
/* índice */
.intro{font-size:18px;color:var(--ink-soft);margin-bottom:34px;max-width:600px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.card{display:flex;flex-direction:column;text-decoration:none;background:var(--cream);border:1px solid rgba(15,110,86,.1);border-radius:16px;padding:24px;transition:transform .25s,border-color .25s}
.card:hover{transform:translateY(-4px);border-color:var(--teal-soft)}
.card-meta{font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--teal);opacity:.8;margin-bottom:10px}
.card h2{font-family:var(--serif);font-size:23px;font-weight:600;color:var(--ink);line-height:1.16;margin:0 0 9px}
.card p{font-size:15px;color:var(--ink-soft);margin:0 0 14px;flex:1}
.card .read{font-size:14px;font-weight:600;color:var(--teal)}
.card-cta{background:var(--teal);border-color:var(--teal)}
.card-cta:hover{border-color:var(--teal-dark)}
.card-cta .card-meta{color:var(--teal-soft);opacity:1}
.card-cta h2{color:#fff}
.card-cta p{color:var(--teal-faint);font-size:15.5px;line-height:1.55}
.card-cta .read{color:#fff}
@media(max-width:600px){.wrap{padding:36px 20px 60px}.top{padding:14px 18px}.grid,.more-grid{grid-template-columns:1fr}}`;

const head = (title, desc, url, extra = '') => `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${PREVIEW ? 'noindex,follow' : 'index,follow'}">
<meta property="og:type" content="${extra ? 'article' : 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta property="og:site_name" content="Diego Jurfest Psicología">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RB1GSBSK9W"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-RB1GSBSK9W');</script>${extra}
<style>${CSS}</style>`;

const topbar = `<header class="top"><a class="brand" href="/"><img src="/dj-monograma-teal.png" alt="" width="34" height="34"><span>Lic. Diego Jurfest</span></a></header>`;

function articlePage(a, bySlug) {
  const url = `${SITE}/recursos/${a.slug}/`;
  const rt = readMin(a);
  const schema = '\n<script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title,
    description: a.metaDesc, author: { '@type': 'Person', name: 'Lic. Diego Jurfest' },
    publisher: { '@type': 'Person', name: 'Lic. Diego Jurfest' },
    datePublished: DATE_ISO, dateModified: DATE_ISO, image: `${SITE}/og-image.jpg`,
    inLanguage: 'es', mainEntityOfPage: url,
  }) + '</script>';
  const rel = (RELATED[a.slug] || []).map(s => bySlug[s]).filter(Boolean);
  const more = rel.length ? `\n  <div class="more"><div class="more-t">Seguí leyendo</div><div class="more-grid">${
    rel.map(r => `<a class="rcard" href="/recursos/${r.slug}/"><h3>${r.titleHtml || esc(r.title)}</h3><span>Leer →</span></a>`).join('')
  }</div></div>` : '';
  return `<!doctype html>
<html lang="es">
<head>
${head(a.metaTitle, a.metaDesc, url, schema)}
</head>
<body>
${topbar}
<main class="wrap">
  <div class="eyebrow">Recursos</div>
  <h1>${a.titleHtml || esc(a.title)}</h1>
  <div class="byline">Lic. Diego Jurfest · ${rt} min de lectura · ${DATE_HUMAN}</div>
  <blockquote class="hook">${fmt(a.hook)}</blockquote>
  <p class="lead">${fmt(a.lead)}</p>
  ${a.sections.map(s => `<h2>${esc(s.h)}</h2>\n      ${blocks(s.body)}`).join('\n  ')}
  <a class="cta" href="${WA}" target="_blank" rel="noopener" onclick="if(window.gtag)gtag('event','whatsapp_click',{location:'recurso:${a.slug}'})">Agendá tu primera consulta <b>→</b></a>
  <p class="disclaimer">Este contenido es informativo y no reemplaza una consulta profesional.</p>${more}
  <a class="back" href="/recursos/">← Volver a Recursos</a>
</main>
</body>
</html>`;
}

function indexPage(bySlug) {
  const url = `${SITE}/recursos/`;
  const cards = ORDER.map(s => bySlug[s]).filter(Boolean).map(a =>
    `<a class="card" href="/recursos/${a.slug}/"><div class="card-meta">${readMin(a)} min de lectura</div><h2>${a.titleHtml || esc(a.title)}</h2><p>${esc(a.metaDesc)}</p><span class="read">Leer →</span></a>`).join('\n      ');
  const ctaCard = `<a class="card card-cta" href="${WA}" target="_blank" rel="noopener" onclick="if(window.gtag)gtag('event','whatsapp_click',{location:'recursos-index-cta'})"><div class="card-meta">El primer paso</div><p>Si alguno de estos textos te mueve de alguna forma, o te sentiste identificado en algún sentido, quizás sea un buen momento para generar ese espacio: una primera charla sin compromiso para que evalúes si esto puede ser útil para vos.</p><span class="read">Agendá tu primera consulta →</span></a>`;
  return `<!doctype html>
<html lang="es">
<head>
${head('Recursos | Lic. Diego Jurfest, Psicólogo', 'Textos breves para pensar, entender y encontrar herramientas: ansiedad, adaptación, vínculos, empezar terapia y más. Escritos por el Lic. Diego Jurfest.', url)}
</head>
<body>
${topbar}
<main class="wrap">
  <div class="eyebrow">Recursos</div>
  <h1>Un espacio para tomarse el momento de hacer algo muy simple y complejo a la vez: <em class="hl">Pensar.</em></h1>
  <p class="intro">Textos rápidos sobre lo que muchos atravesamos —ansiedad, adaptación, vínculos, empezar terapia— pensados y escritos para acompañarte y reflexionar unos minutos, estés donde estés.</p>
  <div class="grid">
      ${cards}
      ${ctaCard}
  </div>
  <a class="back" href="/">← Volver al inicio</a>
</main>
</body>
</html>`;
}

const articles = [
  {
    slug: 'ansiedad-cuando-la-guerra-esta-cerca',
    title: 'Ansiedad cuando la guerra está cerca: cómo sostenerte',
    metaTitle: 'Ansiedad cuando la guerra está cerca: cómo sostenerte | Lic. Diego Jurfest',
    metaDesc: 'Si la guerra te tiene en alerta constante —de cerca o desde la distancia—, entendé por qué pasa y qué podés hacer para sostenerte.',
    hook: 'Hay miedos que no avisan. Se instalan de a poco: en el sueño que se vuelve liviano, en la mano que busca el teléfono antes que la luz del día, en esa sensación de estar siempre un paso adelante de algo que todavía no llegó. Si lo conocés, es importante entender algo muy simple para empezar: lo que sentís tiene todo el sentido del mundo.',
    lead: 'Si algo de esto te resuena, estés donde estés, quizás entender ese estado sea el primer paso para que pese menos.',
    sections: [
      { h: 'Tu cuerpo no está fallando: está haciendo su trabajo', body: [{ p: 'Frente a una amenaza real y prolongada, tu sistema nervioso se pone en guardia: sube la activación, la atención se estrecha, el cuerpo queda "listo" para lo que viene. **Es una respuesta sana del cuerpo y la mente ante una situación que no lo es.** El problema no es que reacciones; es que cuando la tensión se sostiene, el cuerpo queda "encendido" o "alerta" incluso en los momentos de calma. A eso lo llamamos hipervigilancia; cansa, y es normal.' }] },
      { h: 'La distancia no siempre alivia', body: [{ p: 'Si no estás en el lugar de los hechos, quizás estás cargando con algo extra: la culpa de estar "a salvo en otro lado", el impulso de estar pegado a las noticias para "acompañar desde donde estoy". Estar lejos no apaga el vínculo ni la preocupación; muchas veces la tensión se vive igual, pero de una manera más solitaria y sin tu círculo de siempre, ese que entiende perfecto de qué hablás.' }] },
      { h: 'Qué podés hacer hoy', body: [{ ul: [
        '**Dale un lugar y un horario a las noticias.** Informarte no es lo mismo que vivir conectado a los titulares de las noticias. Elegí momentos acotados y específicos, y fuera de eso, intentá dejar la temática a un lado.',
        '**Volvé al presente, con el cuerpo.** Cuando la mente se va al "¿y si…?", traela despacio al lugar en el que estés: respiración lenta, apoyá los pies, mirá alrededor. No es magia; es bajarle un poco el volumen a la alarma.',
        '**Cuidá lo básico.** Sueño, comida, algo de movimiento. Suena simple, y es lo que más te sostiene.',
        '**No lo lleves en silencio.** Poner en palabras lo que sentís —con alguien de confianza o un profesional— le saca peso al cuerpo.' ] }] },
      { h: 'Cuándo conviene buscar acompañamiento', body: [{ p: 'Existen señales típicas ante este tipo de situaciones: dificultad para dormir, comer o concentrarte. Si la ansiedad o la angustia se intensifica, o pasan los días y sentís que el cuerpo no afloja; si notás que estás dejando de hacer cosas que antes hacías —y te hacían bien—, entonces puede que sea un buen momento para apoyarte en alguien más. No es necesario sentir que "estás mal" para empezar; muchas veces, cuanto antes lo hagas, más simple puede ser.' }] },
      { h: 'Romper esa barrera: no tenés que sostenerlo solo', body: [{ p: 'Como psicólogo, acompaño a jóvenes y adultos que atraviesan situaciones de este tipo; en tu idioma y desde donde estés. Si algo de esto te resuena, conversar puede ser el primer paso para ayudarte a vos mismo.' }] },
    ],
  },
  {
    slug: 'elegir-psicologo-en-espanol-viviendo-lejos',
    title: 'Cómo elegir psicólogo en español si vivís lejos de casa',
    metaTitle: 'Cómo elegir psicólogo en español si vivís lejos de casa | Lic. Diego Jurfest',
    metaDesc: 'Vivís en el exterior y querés terapia en tu idioma. Qué mirar para elegir bien tu psicólogo online, y por qué tu idioma importa más de lo que parece.',
    hook: 'Buscar ayuda de por sí no es algo sencillo. Buscarla en otro país, en otro idioma, con otra moneda y otro huso horario, puede sentirse como una pared. Pero no tiene por qué serlo.',
    lead: 'Si estás lejos de donde creciste y sentís que necesitás un espacio para vos, donde logres sentirte "como en casa", esto es para ordenar la decisión sin que te pese tanto.',
    sections: [
      { h: 'Por qué tu idioma importa (más de lo que parece)', body: [{ p: 'Hay cosas que solo se dicen bien en el idioma en el que las viviste: desde un modismo o un chiste hasta una manera de nombrar el estrés o el dolor. Hacer terapia en tu lengua no es un lujo: es poder hablar sin traducir, sin explicar de más, y que del otro lado **te entiendan de verdad**. Eso genera una sensación de libertad, y ahorra energía y tiempo.' }] },
      { h: 'Para vos que estás lejos, lo virtual también suma', body: [{ p: 'Estar a distancia puede dejar de ser un obstáculo: elegir al profesional por afinidad y no por cercanía geográfica y sostener el proceso aunque te mudes o viajes puede ser más importante que estar en una misma sala. No dependés de quién esté cerca de tu barrio o tu ciudad — y romper esa barrera para elegir con quién querés trabajar ya es un gran avance.' }] },
      { h: 'Qué mirar al elegir', body: [{ ul: [
        '**Formación verificable.** Que sea psicólogo/a con un título que corrobore su formación y experiencia.',
        '**Que entienda tu contexto.** No es lo mismo que alguien "sepa" de migración a que entienda lo que es dejar tu casa, tu idioma, tu gente.',
        '**Encuadre claro.** Disponibilidad, duración, confidencialidad. Las reglas claras desde el principio dan tranquilidad y confianza.',
        '**Que te sientas cómodo/a.** Las primeras charlas también sirven para ver si te "enganchás": es válido probar y buscar hasta encontrar tu lugar. Sentirte cómodo en tu espacio es fundamental para que este sea efectivo.' ] }] },
      { h: 'Preguntá lo que necesites antes de empezar', body: [{ p: 'Es válido preguntar cómo trabaja, cuánto dura una sesión o cómo maneja la confidencialidad. Un buen profesional responde con claridad y sin que te sientas incómodo/a; esas respuestas también te ayudan a decidir.' }] },
      { h: 'Lo práctico no debería frenarte', body: [{ p: 'Huso horario, moneda, medios de pago: son detalles que se resuelven. Un buen proceso se adapta a tu vida —tu zona horaria, tu rutina— y no al revés.' }] },
      { h: 'Dar el primer paso', body: [{ p: 'Si llegaste hasta acá, ya hiciste lo más difícil: registrar que querés un espacio. Si te hace sentido, escribime y coordinamos una primera charla. No hay un compromiso a futuro: la idea es conocernos y evaluar si puede ser útil para vos.' }] },
    ],
  },
  {
    slug: 'hacer-alia-desafio-emocional',
    title: 'Hacer aliá: el desafío emocional que casi nadie te explica',
    metaTitle: 'Hacer aliá: el desafío emocional que casi nadie te explica | Lic. Diego Jurfest',
    metaDesc: 'Hacer aliá también es un proceso emocional: el duelo, la identidad, la brecha entre lo que imaginabas y los días reales — y cómo transitarlo con más calma.',
    hook: 'Lo dejaste todo para empezar de nuevo en el lugar que soñaste —o no—, y aun así, algunas noches extrañás cosas que ni eras consciente de que te importaban. Eso también es parte del viaje.',
    lead: 'Si estás en ese proceso, o lo estás pensando, quiero contarte una parte de la que poco se habla: la emocional.',
    sections: [
      { h: 'El duelo que nadie nombra', body: [{ p: 'Hacer aliá en muchos casos se celebra —y está perfecto. Pero a veces es una decisión que pasa por otros motivos: buscando un nuevo lugar, una nueva oportunidad, una vida mejor, o simplemente cambiar. Sea cual sea ese motivo, todo comienzo nuevo conlleva también una despedida: amigos, calles conocidas, tu versión en ese lugar. Extrañar algo de eso no significa que te estés equivocando; significa que te separaste de algunas cosas que te importaban. Y las dos cosas pueden ser ciertas a la vez.' }] },
      { h: 'No es "no pertenecer": es estar en construcción', body: [{ p: 'Sentirte entre dos mundos —ni del todo de allá, ni todavía de acá— es incómodo, y es **transitorio**. La identidad no se rompe en la mudanza; se reacomoda. Lleva tiempo, y hacerlo solo puede resultar más complicado.' }] },
      { h: 'Qué ayuda en el camino', body: [{ ul: [
        'Darte permiso para extrañar **sin culpa**.',
        'Soltar el "tendría que estar feliz todo el tiempo".',
        'Construir rutina y vínculos de a poco, sin apurarte.',
        'Hablarlo con alguien que conozca este camino.' ] }] },
      { h: 'La brecha entre la imaginación y la realidad', body: [{ p: 'Imaginabas un lugar y te encontrás con una vida: trámites, idioma, nuevos códigos, reconstruir vínculos y trabajos desde cero. Que la realidad pese más que la postal no es un fracaso; es lo que le pasa a casi todos. Lo más difícil suele ser el principio, y está bien contar con alguien que te acompañe en este proceso: no tenés por qué adaptarte solo. Transitar este camino con alguien que te pueda apoyar en tu propio idioma, entendiendo de cerca tus conceptos, tus ideas y lo que implican, está a tan solo un mensaje de distancia.' }] },
      { h: 'Por qué me conviene apoyarme en alguien', body: [{ p: 'Si te está costando de más arrancar el día, si sentís que te podés estar aislando más de lo habitual, si sentís que solo/a no estás pudiendo con esto, o simplemente querés charlarlo con alguien para "ver cómo estoy" — apoyarte en un profesional puede asegurar un proceso mucho más liviano.' }] },
    ],
  },
  {
    slug: 'necesito-ir-al-psicologo',
    title: '¿Necesito ir al psicólogo? ¿Cómo me doy cuenta?',
    metaTitle: '¿Necesito ir al psicólogo? ¿Cómo me doy cuenta? | Lic. Diego Jurfest',
    metaDesc: '¿Cómo saber si es momento de empezar terapia? Señales simples, sin dramatismo, para decidir con más claridad.',
    hook: 'No hace falta que algo esté roto para cuidar que no se rompa. A veces alcanza con esa sensación de simplemente estar transitando los días: todo bien por fuera, —un poco— cansado por dentro.',
    lead: 'Mucha gente llega preguntándose a sí mismo si lo que pienso o siento "es para tanto". La idea es sacarte esa duda y tener mayor claridad, sin dramatizar la situación.',
    sections: [
      { h: 'La terapia no es solo para una crisis', body: [{ p: 'Creemos que el psicólogo es para cuando decís "ya no doy más". La realidad es que hacer terapia sirve para entenderte mejor: cómo y por qué tomás decisiones, frenar a tiempo, o simplemente tener un espacio de confianza solo para vos. Y lo más importante que debemos entender es que no necesitás una duda existencial ni un problema específico para merecer esto.' }] },
      { h: 'Algunas señales que podrían ayudarte', body: [{ ul: [
        'Le das muchas vueltas a lo mismo sin llegar a una conclusión, sin encontrar respuestas claras.',
        'Algo que antes manejabas con más facilidad, hoy te cuesta más.',
        'Estás más irritable, cansado/a o desconectado/a de lo habitual o de tu día a día.',
        'Tenés una decisión grande por delante y querés pensarla con alguien más.',
        'Simplemente tenés ganas de conocerte mejor a vos mismo.' ] }] },
      { h: '"¿No debería poder solo?"', body: [{ p: 'Pedir ayuda no es debilidad; es de las cosas más sensatas que podés hacer. Despejar esa duda es simple cuando una primera charla no te obliga a nada; si te quedaste pensando en esto, escribime y lo charlamos con calma.' }] },
    ],
  },
  {
    slug: 'empezar-terapia-por-primera-vez',
    title: 'Empezar terapia por primera vez: qué esperar (y qué no)',
    metaTitle: 'Empezar terapia por primera vez: qué esperar (y qué no) | Lic. Diego Jurfest',
    metaDesc: '¿Primera vez en terapia? Qué esperar de las primeras sesiones, qué no, y cómo es empezar sin presión ni juicios.',
    hook: 'No sabés qué cosas se dicen, ni cómo se empieza, ni si vas a "hacerlo bien"; o a hacerte bien. Tranquilo, nadie llega sabiendo. Empezar es, justamente, no tener que saber.',
    lead: 'Si nunca hiciste terapia o no fue lo que esperabas, esto es para que llegues con una idea clara —y por sobre todo sin presión.',
    sections: [
      { h: 'Las primeras sesiones son para conocerte', body: [{ p: 'Al principio lo importante es conocernos, entender qué te hizo llegar a este espacio, qué buscás, en qué estás. No se espera que me expliques toda tu vida rápidamente ni de forma concreta y concisa. Justamente el espacio, así como la confianza, se construye, no se exige.' }] },
      { h: 'Qué NO va a pasar', body: [{ p: 'No vas a ser juzgado, no van a decirte qué hacer y qué no, ni vas a ser tratado bajo un diagnóstico. No hay respuestas correctas ni un examen a rendir, no hay calificaciones, aprobar o desaprobar. Es *tu* espacio seguro, y se trabaja a tu lado, en conjunto; nunca por encima.' }] },
      { h: '¿Y si siento que no es para mí?', body: [{ p: 'Es más que válido probar e ir viendo. Las primeras charlas también sirven para que vos evalúes si te sentís cómodo, si te "enganchás" con el otro. Y si no lo hacés, está perfecto: lo importante es que logres encontrar tu lugar.' }] },
      { h: 'El primer paso puede ser el más simple', body: [{ p: 'Pensalo de esta manera: comenzar es solo escribir un mensaje y coordinar una charla. No tenés compromisos, no es necesario que planifiques nada, ni que te anticipes a determinada situación. Dar ese primer paso no siempre es fácil, pero simplificarlo a veces puede ser la solución. Agendar esa reunión ya es un gran avance.' }] },
    ],
  },
  {
    slug: 'como-es-una-sesion-de-terapia-online',
    title: 'Cómo es una sesión de terapia online',
    metaTitle: 'Cómo es una sesión de terapia online | Lic. Diego Jurfest',
    metaDesc: 'Si nunca hiciste terapia por videollamada, acá te cuento cómo es una sesión online, paso a paso, para que llegues sin dudas.',
    hook: 'Te imaginás como que es raro, frío o inútil, solo porque es a través de una pantalla. Pero a los cinco minutos ya te olvidaste de la computadora o el celular si lo que realmente importa —que alguien te escuche como lo necesitás— sucede igual.',
    lead: 'Si nunca hiciste terapia online, esto es para ayudarte a que llegues con menos dudas a tu primera sesión.',
    sections: [
      { h: '¿Qué es lo único que necesitás?', body: [{ p: 'Un lugar donde puedas mantenerte tranquilo/a, tus auriculares si no estás completamente solo y querés más privacidad, y conexión a internet. Nada más que eso. Todo lo demás está a un clic de distancia.' }] },
      { h: 'Cómo es una sesión vista desde dentro', body: [{ p: 'Es una conversación. Hablás, te escucho, y vamos entendiendo juntos qué te trajo a este espacio, qué necesitás. No hay cuestionario ni molde: cada sesión sigue el ritmo de lo que traigas ese día; *tu* ritmo.' }] },
      { h: '¿Cómo es la privacidad?', body: [{ p: 'Es una sala de Google Meet creada especialmente para eso: con un link único por sesión, sin grabaciones, sin registros digitales. Lo que se habla queda en este espacio, entre vos y yo. Si por algún motivo preferís otra vía (por ejemplo, videollamada de WhatsApp), también existe esa posibilidad, ajustándonos a las configuraciones de privacidad correspondientes.' }] },
      { h: '¿Funciona igual que presencial?', body: [{ p: 'Por supuesto que todo espacio es diferente. Pero lo que ayuda a que sea útil y efectivo no es el sillón, la ventana, ni los adornos de la sala: es el vínculo y el trabajo. Y eso se sostiene perfecto en nuestra videollamada, con la ventaja de hacerlo desde tu lugar seguro, sin traslados, demoras ni esperas.' }] },
      { h: 'La mejor forma de estar seguro es probarlo', body: [{ p: 'Si te da curiosidad pero te frena la duda, una primera charla la despeja en minutos. Contás con la disponibilidad que vos necesites: coordinamos cuando *a vos* te quede cómodo, ajustándonos a tu rutina.' }] },
    ],
  },
  {
    slug: 'dormir-mejor-cuando-cuesta-apagar-la-cabeza',
    title: 'Dormir mejor cuando cuesta apagar la cabeza',
    metaTitle: 'Dormir mejor cuando cuesta apagar la cabeza | Lic. Diego Jurfest',
    metaDesc: '¿Te acostás y la cabeza no para? Por qué pasa y qué podés hacer para dormir mejor, con herramientas simples y realistas.',
    hook: 'Sin darte cuenta, cuando apagás la luz se enciende la cabeza: lo pendiente, lo inconcluso, lo que se viene. El cuerpo cansado y la mente a mil, como si recién ahí tuviera el tiempo y el momento de hablarte.',
    lead: 'Primero que nada entendé que no estás solo — y hay cosas concretas que ayudan. Vamos a ellas.',
    sections: [
      { h: 'Por qué se enciende justo de noche', body: [{ p: 'Durante el día, mente y cuerpo están ocupados. En la noche, al momento de acostarse, no hay distracciones, entonces la mente aprovecha para procesar todo lo que está pendiente. No es que "estás pensando de más": es que recién ahí tenemos el silencio real para que esto suceda.' }] },
      { h: 'Qué podés probar', body: [{ ul: [
        '**Descargá la cabeza antes de la cama.** Anotá en tus notas (cuadernito, celular, tasks, lo que te quede cómodo) aquello que considerás "pendiente", o simplemente lo que te está resonando en la cabeza. Sacarlo de los pensamientos y ponerlo en palabras, ayuda.',
        '**Bajá las pantallas un rato antes.** La luz, el celular y el scroll mantienen el cerebro en "alerta". Dale una transición más tranquila: leer unas páginas, una ducha tibia, una música suave, o simplemente bajar las luces un rato antes de la cama.',
        '**No pelees con el "me cuesta dormirme".** Si no viene el sueño, no te quedes luchando: probá levantarte un momento, ir al baño, hacer algo calmo, breve, y volvé cuando termines. Pelear contigo mismo no es una solución, y solo lo empeora.',
        '**Cuidá los horarios.** Acostarte y levantarte a horas parecidas le ordena el reloj al cuerpo, y consecuentemente a la cabeza. Cumplir con una rutina es programarte para un mejor funcionamiento.' ] }] },
      { h: 'Lo que no ayuda (aunque lo parezca)', body: [{ ul: [
        '**Mirar la hora.** Calcular "cuántas horas me quedan" enciende la ansiedad. Si podés, evitá mirar el reloj en ese momento.',
        '**La cafeína de la tarde.** Café, mate o energizantes después del mediodía pueden seguir teniendo efecto a la noche, y no ayudan a que dejes de dar vueltas en la cama.',
        '**Las siestas largas.** Una siesta corta, si estás cansado, no te va a hacer mal; una de varias horas puede desordenar el sueño a la noche.' ] }] },
      { h: 'Cuándo puede haber "algo más"', body: [{ p: 'Si te cuesta dormir por varias noches seguidas, si de día te sentís muy cansado o inquieto, o sentís que tus horarios están desconfigurados, muchas veces el sueño es una pequeña señal de algo más (estrés, una preocupación sostenida, u otra cosa que capaz no estás detectando). Abordar eso con mayor profundidad suele ayudar a mejorar el descanso, y quizás lo que anotaste —o simplemente estuviste pensando— antes de dormir pueda ordenarse mejor al conversarlo con alguien más que tu almohada o tus amigos.' }] },
    ],
  },
  {
    slug: 'vivir-entre-dos-culturas',
    title: 'Vivir entre dos culturas: encontrar tu lugar',
    metaTitle: 'Vivir entre dos culturas: encontrar tu lugar | Lic. Diego Jurfest',
    metaDesc: 'Crecer en un lado y vivir en otro deja una sensación de estar entre dos mundos. Cómo encontrar tu lugar sin perder de dónde venís.',
    hook: 'A veces sentís que en todos lados sos "el de afuera": el de allá cuando estás acá, el de acá cuando volvés allá. Como si tu lugar quedara siempre un poco más lejos.',
    lead: 'Si creciste en una cultura y hacés tu vida en otra, esta sensación te va a sonar. Hablemos de ella.',
    sections: [
      { h: 'No estás partido: estás hecho de las dos', body: [{ p: 'Tener dos idiomas, dos códigos, dos formas de ver el mundo no es una grieta: es una riqueza, aunque a veces resulte incómodo. No tenés que estar eligiendo una de las dos, porque las dos hacen a lo que sos hoy.' }] },
      { h: 'El cansancio de "traducirte" todo el tiempo', body: [{ p: 'Adaptarte a códigos que no son los tuyos —el humor, las formas, las costumbres— puede ser cansador. Es normal extrañar lugares donde no tenías que explicar nada; reconocerlo alivia y es un gran primer paso.' }] },
      { h: 'Tu lugar no siempre es un país', body: [{ p: 'Muchas veces, lo que entendés como "tu lugar" es la gente que tenés alrededor en este momento. Construir y desarrollar esos vínculos —además de un espacio propio— puede pesar más que un mapa, y no significa que vayas a olvidar de dónde venís.' }] },
      { h: 'Un espacio en tu idioma', body: [{ p: 'Existe una sensación muy común de "no encajar", y muchas veces pesa, te aísla o te incomoda pensarlo. Lograr ponerlo en palabras con alguien que entienda el cruce entre culturas puede ordenar mucho estas sensaciones, y hacerlo en tu idioma y sin tener que explicar de más facilita el proceso. Si te identificás con algo de esto, te invito a que lo conversemos con claridad.' }] },
    ],
  },
  {
    slug: 'mitos-que-conviene-dejar-atras',
    title: 'Mitos que (te) conviene dejar atrás',
    titleHtml: 'Mitos que <span class="hl">(te)</span> conviene dejar atrás',
    metaTitle: 'Mitos sobre la terapia y la salud mental que conviene dejar atrás | Lic. Diego Jurfest',
    metaDesc: 'Ideas muy instaladas sobre la terapia, la ansiedad y el bienestar que, sin darte cuenta, te están frenando. Las desarmamos una por una.',
    hook: 'Todos crecimos escuchando algunas frases tantas veces que dejamos de cuestionarlas: "a tu edad ya tendrías que…", "eso no es necesario", "ya se te va a pasar". Y algunas de esas ideas, repetidas sin pensar, pueden terminar pesando más que el problema en sí.',
    lead: 'Vamos a profundizar en algunos mitos muy instalados sobre la terapia, la ansiedad y el bienestar — y por qué quizás te convenga soltarlos.',
    sections: [
      { h: '"Ir al psicólogo es para cuando estás mal"', body: [{ p: 'Es el mito más instalado, y el que más frena. Pero no hace falta sentirte "al límite" para que la terapia tenga un impacto positivo: también es un espacio para prevenir, para conocerte mejor o para atravesar un cambio con más herramientas. Esperar a "estar mal" es, justamente, lo que a veces agranda una situación que al principio era más simple.' }] },
      { h: '"Eso no es necesario"', body: [{ p: 'Es una idea que conviene dar vuelta. Registrar que algo te pasa, entenderlo —y entenderte— dándole un sentido, y animarte a empezar un proceso es una fortaleza, no un lujo, y mucho menos una debilidad. Lo que de verdad cuesta es soltar el convencimiento de que "primero tendría que poder solo": esa exigencia que aplicamos a todo, desde rendir el examen que más nervios da hasta afrontar la situación más difícil. Por eso, cuando algo te está pasando —sea algo nuevo o algo de siempre; más importante o al parecer no tanto—, es natural que buscar acompañamiento no parezca "necesario". Pero quizás la verdadera pregunta no sea si es necesario, sino por qué esperaríamos a estar mal para permitírnoslo.' }] },
      { h: '"A mi edad ya tendría que tener todo resuelto"', body: [{ p: 'Hay ideas que parecen leyes de la naturaleza: que a los 20 hay que estar estudiando, que a los 30 hay que tener un trabajo y una pareja con el rumbo claro. Frases hechas, tan instaladas como vacías. La realidad es que todos atravesamos, en algún momento u otro, una etapa de construcción: de probar, equivocarse y también volver a empezar. El problema no es no tenerlo resuelto; es la vara imaginaria con la que te comparás día a día —esa que, en el fondo, no te mide: te desordena— y solo te deja una sensación de culpa por no estar donde "deberías".' }] },
      { h: '"La ansiedad se va sola, lo mejor es ignorarla"', body: [{ p: 'Ojalá fuera así. Pero ignorar lo que sentís suele agrandarlo, no achicarlo: lo que se esquiva tiende a aparecer por otro lado, y a veces más fuerte. La ansiedad no es algo que se "aguanta" a fuerza de voluntad; se entiende, se trabaja y se le baja el volumen, con herramientas concretas y aprendiendo qué es lo que la enciende. Mirarla de frente, con calma y sin pelearte con ella, es lo que de verdad la afloja con el tiempo. Pero recordá que es un proceso: ni ignorarla ni atacarla como si fuera una batalla personal van a hacer que desaparezca.' }] },
      { h: '"La terapia online no funciona de verdad"', body: [{ p: 'Es una de las dudas más comunes, y de las más entendibles. La evidencia es consistente: para muchos de los motivos de consulta más frecuentes —estrés, ansiedad, estados de ánimo, cambios en tu vida— la terapia por videollamada puede funcionar tan bien como la presencial. En la práctica, lo que sostiene un proceso en el tiempo no es el sillón en el que te sentás ni los adornos de la sala: es el vínculo y el trabajo entre dos personas. Y eso hoy viaja perfecto por una pantalla, con la ventaja extra de hacerlo desde tu lugar seguro, sin traslados ni esperas.' }] },
      { h: '"Si igual lo hablo con amigos, no necesito terapia"', body: [{ p: 'Los amigos son oro, y hablar siempre ayuda. Pero un espacio profesional es otra cosa: ahí no tenés que cuidar al otro, ni devolver el favor, ni preocuparte por cómo cae lo que decís, lo que pensás, o lo que hacés y dejás de hacer. Es un lugar pensado y trabajado especialmente para vos, sin juicios y con alguien formado y dedicado a ayudarte, entenderte y trabajar en profundidad lo que sea que *vos* decidas traer. No se trata de dejar de charlar con la gente que tenés cerca; se trata de que ambos espacios no compitan, sino que se complementen.' }] },
      { h: '"Lo que veo en las redes no me afecta"', body: [{ p: 'Pasamos horas del día frente a vidas editadas, pensadas para mostrar solo el mejor ángulo, y a veces creemos que a nosotros no nos toca. Pero la comparación constante con esas postales va erosionando el ánimo de a poco, casi sin que lo notemos. Así aparece esa sensación extraña de estar "siempre un paso atrás", de que "todavía tendría que irte mejor". Vale la pena hacer el ejercicio de darte cuenta de que estás comparando tu detrás de escena con la película editada de otro; y solo eso ya cambia cómo lo mirás.' }] },
      { h: '"Soltar estos mitos ya genera movimiento"', body: [{ p: 'Cuestionar lo que dabas por hecho —sobre vos, sobre pedir ayuda, sobre "cómo deberías estar" en cada momento— es, en sí mismo, el primer paso. No hace falta creerte todo lo que leíste acá de golpe; alcanza con plantearte un primer cuestionamiento, una primera duda. Y si alguno de estos temas te resonó, quizás valga la pena darle una vuelta más, esta vez acompañado.' }] },
    ],
  },
];

const bySlug = Object.fromEntries(articles.map(a => [a.slug, a]));
let n = 0;
for (const a of articles) {
  const dir = path.join(PUB, 'recursos', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), articlePage(a, bySlug));
  n++;
}
fs.writeFileSync(path.join(PUB, 'recursos', 'index.html'), indexPage(bySlug));
console.log(`OK — índice + ${n} artículos en /public/recursos/  (PREVIEW=${PREVIEW} -> ${PREVIEW ? 'noindex' : 'index'})`);
