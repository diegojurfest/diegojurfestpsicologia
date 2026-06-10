// Genera las páginas de la sección Recursos como HTML estático, con la marca del
// sitio. Uso: node tools/recursos/build.cjs   (salida en /public/recursos/<slug>/)
//
// PREVIEW=true -> robots noindex (mientras Diego revisa). Al lanzar de verdad,
// poné PREVIEW=false, regenerá, y agregá las URLs al sitemap + link en el menú.
const fs = require('fs');
const path = require('path');
const PUB = path.resolve(__dirname, '../../public');
const PREVIEW = true;

const WA = 'https://wa.me/59893383251?text=' +
  encodeURIComponent('Hola Diego, me gustaría que agendemos una primera consulta.');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>');
const blocks = arr => arr.map(b =>
  b.ul ? `<ul>${b.ul.map(li => `<li>${fmt(li)}</li>`).join('')}</ul>`
       : `<p>${fmt(b.p)}</p>`).join('\n      ');

const CSS = `
:root{--teal:#0F6E56;--teal-dark:#085041;--teal-soft:#9FE1CB;--cream:#FAF7F0;--paper:#FCFAF4;--ink:#1A2F26;--ink-soft:#4A5C53;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',-apple-system,sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--paper);color:var(--ink-soft);line-height:1.62;-webkit-font-smoothing:antialiased}
.top{position:sticky;top:0;background:rgba(252,250,244,.85);backdrop-filter:blur(12px);border-bottom:1px solid rgba(15,110,86,.08);padding:15px 24px;z-index:10}
.brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--teal-dark);font-family:var(--serif);font-size:19px;font-weight:500;letter-spacing:.5px}
.brand img{display:block;border-radius:8px}
.article{max-width:700px;margin:0 auto;padding:50px 24px 76px}
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
strong{color:var(--ink);font-weight:600}
em{font-style:italic}
.cta{display:inline-flex;align-items:center;gap:10px;margin:30px 0 6px;background:var(--teal);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:15px 28px;border-radius:40px;transition:background .25s}
.cta:hover{background:var(--teal-dark)}
.cta b{font-weight:600;transition:transform .25s}
.cta:hover b{transform:translateX(4px)}
.disclaimer{font-size:13px;opacity:.6;font-style:italic;margin-top:16px}
.back{display:inline-block;margin-top:38px;color:var(--teal);text-decoration:none;font-size:14px;font-weight:500}
.back:hover{text-decoration:underline}
@media(max-width:600px){.article{padding:36px 20px 60px}.top{padding:14px 18px}}`;

const page = a => `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.metaTitle)}</title>
<meta name="description" content="${esc(a.metaDesc)}">
<link rel="canonical" href="https://diegojurfestpsicologia.com/recursos/${a.slug}/">
<meta name="robots" content="${PREVIEW ? 'noindex,follow' : 'index,follow'}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.metaDesc)}">
<meta property="og:url" content="https://diegojurfestpsicologia.com/recursos/${a.slug}/">
<meta property="og:image" content="https://diegojurfestpsicologia.com/og-image.jpg">
<meta property="og:site_name" content="Diego Jurfest Psicología">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RB1GSBSK9W"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-RB1GSBSK9W');</script>
<style>${CSS}</style>
</head>
<body>
<header class="top">
  <a class="brand" href="/"><img src="/dj-monograma-teal.png" alt="" width="34" height="34"><span>Lic. Diego Jurfest</span></a>
</header>
<main class="article">
  <div class="eyebrow">Recursos</div>
  <h1>${esc(a.title)}</h1>
  <div class="byline">Lic. Diego Jurfest</div>
  <blockquote class="hook">${fmt(a.hook)}</blockquote>
  <p class="lead">${fmt(a.lead)}</p>
  ${a.sections.map(s => `<h2>${esc(s.h)}</h2>\n      ${blocks(s.body)}`).join('\n  ')}
  <a class="cta" href="${WA}" target="_blank" rel="noopener" onclick="if(window.gtag)gtag('event','whatsapp_click',{location:'recurso:${a.slug}'})">Agendá tu primera consulta <b>→</b></a>
  <p class="disclaimer">Este contenido es informativo y no reemplaza una consulta profesional.</p>
  <a class="back" href="/">← Volver al inicio</a>
</main>
</body>
</html>`;

const articles = [
  {
    slug: 'ansiedad-cuando-la-guerra-esta-cerca',
    title: 'Ansiedad cuando la guerra está cerca: cómo sostenerte',
    metaTitle: 'Ansiedad cuando la guerra está cerca: cómo sostenerte | Lic. Diego Jurfest',
    metaDesc: 'Si la guerra te tiene en alerta constante —de cerca o desde la distancia—, entendé por qué pasa y qué podés hacer para sostenerte.',
    hook: 'Hay miedos que no avisan. Se instalan de a poco: en el sueño que se vuelve liviano, en la mano que busca el teléfono antes que la luz del día, en esa sensación de estar siempre un paso adelante de algo que todavía no llegó. Si lo conocés, es importante entender algo muy simple para empezar: lo que sentís tiene todo el sentido del mundo.',
    lead: 'Si algo de esto te resuena, estés donde estés, quizás entender ese estado sea el primer paso para que pese menos.',
    sections: [
      { h: 'Tu cuerpo no está fallando: está haciendo su trabajo', body: [{ p: 'Frente a una amenaza real y prolongada, tu sistema nervioso se pone en guardia: sube la activación, la atención se estrecha, el cuerpo queda "listo". Es una respuesta **sana ante una situación que no lo es**. El problema no es que reacciones; es que, cuando la tensión se sostiene, el cuerpo se queda encendido incluso en los momentos de calma. A eso lo llamamos hipervigilancia, y cansa.' }] },
      { h: 'La distancia no siempre alivia', body: [{ p: 'Si no estás en tu casa, quizá estás cargando con algo extra: la culpa de estar "a salvo en otro lado", el impulso de estar pegado a las noticias para "acompañar desde donde estoy". Estar lejos no apaga el vínculo ni la preocupación; muchas veces la tensión se vive igual, pero en soledad y sin tu círculo cercano que entienda perfecto de qué hablás.' }] },
      { h: 'Qué podés hacer hoy', body: [{ ul: [
        '**Dale un lugar y un horario a las noticias.** Informarte no es lo mismo que vivir conectado al peor titular. Elegí momentos acotados y, fuera de eso, dejá el teléfono a un lado un rato.',
        '**Volvé al presente, con el cuerpo.** Cuando la mente se va al "¿y si…?", traela despacio al lugar en el que estés: respiración lenta, apoyá los pies, mirá alrededor. No es magia; es bajarle un poco el volumen a la alarma.',
        '**Cuidá lo básico.** Sueño, comida, algo de movimiento. Suena simple, y es lo que más te sostiene.',
        '**No lo lleves en silencio.** Poner en palabras lo que sentís —con alguien de confianza o un profesional— le saca peso al cuerpo.' ] }] },
      { h: 'Cuándo conviene buscar acompañamiento', body: [{ p: 'Si la ansiedad te está costando dormir, comer o concentrarte; si la angustia se vuelve muy intensa o el cuerpo no afloja en semanas; o si notás que estás dejando de hacer cosas que antes hacías — puede ser un buen momento para apoyarte en alguien. **No necesitás estar muy mal para empezar**: muchas veces, cuanto antes, más simple.' }] },
      { h: 'No tenés que sostenerlo solo', body: [{ p: 'Como psicólogo, acompaño a jóvenes y adultos que atraviesan esto, **en tu idioma y desde donde estés**. Si algo de esto resonó, conversemos: una primera charla, sin compromiso, para ver cómo puedo ayudarte.' }] },
    ],
  },
  {
    slug: 'elegir-psicologo-en-espanol-viviendo-lejos',
    title: 'Cómo elegir psicólogo en español si vivís lejos de casa',
    metaTitle: 'Cómo elegir psicólogo en español si vivís lejos de casa | Lic. Diego Jurfest',
    metaDesc: 'Vivís en el exterior y querés terapia en tu idioma. Qué mirar para elegir bien tu psicólogo online, y por qué tu idioma importa más de lo que parece.',
    hook: 'Buscar ayuda ya cuesta. Buscarla en otro país, en otro idioma, con otra moneda y otro huso horario, puede sentirse como una pared. Pero no tiene por qué serlo.',
    lead: 'Si estás lejos de donde creciste y sentís que necesitás un espacio para vos, esto es para ordenar la decisión sin que te pese tanto.',
    sections: [
      { h: 'Por qué tu idioma importa (más de lo que parece)', body: [{ p: 'Hay cosas que solo se dicen bien en el idioma en el que las viviste: un modismo, un chiste, una forma de nombrar el dolor. Hacer terapia en tu lengua no es un lujo: es poder hablar sin traducir, sin explicar de más, y que del otro lado **te entiendan de verdad**. Eso ahorra tiempo.' }] },
      { h: '¿La terapia online funciona igual?', body: [{ p: 'Sí. Para la mayoría de los motivos de consulta, la terapia por videollamada **puede ser tan efectiva como la presencial**. Lo que sostiene un proceso no es el lugar: es el vínculo y el trabajo. Y eso se transmite a través de tu pantalla.' }] },
      { h: 'Qué mirar al elegir', body: [{ ul: [
        '**Formación verificable.** Que sea psicólogo/a con un título que corrobore su formación y experiencia.',
        '**Que entienda tu contexto.** No es lo mismo que alguien "sepa" de migración a que entienda lo que es dejar tu casa, tu idioma, tu gente.',
        '**Encuadre claro.** Disponibilidad, duración, confidencialidad. Las reglas claras dan tranquilidad.',
        '**Que te sientas cómodo/a.** Las primeras charlas también sirven para ver si "enganchás". Es válido buscar hasta encontrar.' ] }] },
      { h: 'Lo práctico no debería frenarte', body: [{ p: 'Huso horario, moneda, medios de pago: son detalles que se resuelven. Un buen proceso se adapta a tu vida —tu zona horaria, tu rutina— y no al revés.' }] },
      { h: 'Dar el primer paso', body: [{ p: 'Si llegaste hasta acá, ya hiciste lo más difícil: registrar que querés un espacio. Si te hace sentido, **escribime y coordinamos una primera charla**. Sin compromiso: la idea es conocernos y ver si puedo serte útil.' }] },
    ],
  },
  {
    slug: 'hacer-alia-desafio-emocional',
    title: 'Hacer aliá: el desafío emocional que casi nadie te explica',
    metaTitle: 'Hacer aliá: el desafío emocional que casi nadie te explica | Lic. Diego Jurfest',
    metaDesc: 'Hacer aliá también es un proceso emocional: el duelo, la identidad, la brecha entre lo que imaginabas y los días reales — y cómo transitarlo con más calma.',
    hook: 'Lo dejaste todo para empezar de nuevo en el lugar que soñaste —o no—, y aun así, algunas noches extrañás cosas que ni eras consciente de que te importaban. Eso también es parte del viaje.',
    lead: 'Si estás en ese proceso —o lo estás pensando—, quiero contarte la parte de la que poco se habla: la emocional.',
    sections: [
      { h: 'El duelo que nadie nombra', body: [{ p: 'Hacer aliá, en muchos casos, se celebra —y está bien. En otros, se hace por necesidad, buscando un lugar más seguro o una vida mejor. Sea cual sea tu razón, todo comienzo nuevo lleva adentro una despedida: amigos, calles conocidas, la versión de vos que eras allá. Extrañar no significa haberte equivocado. Significa que dejaste cosas que importaban. **Las dos cosas pueden ser ciertas a la vez.**' }] },
      { h: 'La brecha entre lo que imaginabas y los días reales', body: [{ p: 'Imaginabas un lugar, y llegaste a una vida: trámites, idioma, códigos nuevos, reconstruir vínculos y trabajo desde cero. Que la realidad pese más que la postal no es un fracaso; es lo que le pasa a casi todos. Lo más difícil suele ser el principio, y está bien tener alguien que te acompañe también en ese proceso.' }] },
      { h: 'No es "no pertenecer": es estar en construcción', body: [{ p: 'Sentirte entre dos mundos —ni del todo de allá, ni todavía de acá— es incómodo, y es **transitorio**. La identidad no se rompe en la mudanza; se reacomoda. Lleva tiempo, y hacerlo solo puede resultar más complicado.' }] },
      { h: 'Qué ayuda en el camino', body: [{ ul: [
        'Darte permiso para extrañar **sin culpa**.',
        'Soltar el "tendría que estar feliz todo el tiempo".',
        'Construir rutina y vínculos de a poco, sin apurarte.',
        'Hablarlo con alguien que conozca este camino.' ] }] },
      { h: 'Por qué me conviene apoyarme en alguien', body: [{ p: 'Si te está costando de más arrancar el día, si sentís que te podés estar aislando más de lo habitual, si sentís que solo/a no estás pudiendo con esto, o simplemente querés charlarlo con alguien para "ver cómo estoy" — apoyarte en un profesional puede asegurar un proceso mucho más liviano.' }] },
      { h: 'No tenés por qué adaptarte solo', body: [{ p: 'Acompaño a personas que están en este camino, en tu idioma y entendiendo de cerca tus conceptos y lo que implican. Si algo de esto te hace sentido, estoy a un mensaje de distancia.' }] },
    ],
  },
  {
    slug: 'necesito-ir-al-psicologo',
    title: '¿Necesito ir al psicólogo? ¿Cómo me doy cuenta?',
    metaTitle: '¿Necesito ir al psicólogo? ¿Cómo me doy cuenta? | Lic. Diego Jurfest',
    metaDesc: '¿Cómo saber si es momento de empezar terapia? Señales simples, sin dramatismo, para decidir con más claridad.',
    hook: 'No hace falta que algo esté roto para cuidar que no se rompa. A veces alcanza con esa sensación de simplemente estar transitando los días: todo bien por fuera, —un poco— cansado por dentro.',
    lead: 'Mucha gente llega preguntándose a sí mismo si lo que pienso o siento "es para tanto". La idea es sacarte esa duda de encima, y llegar a una respuesta sin dramatizar la situación.',
    sections: [
      { h: 'La terapia no es solo para una crisis', body: [{ p: 'Creemos que el psicólogo es para cuando decís: "ya no doy más." Pero también sirve para entenderte; entender cómo y por qué tomar decisiones, frenar a tiempo, o simplemente tener un espacio solo para vos. No necesitás una duda existencial para merecer ese espacio.' }] },
      { h: 'Algunas señales que podrían ayudarte', body: [{ ul: [
        'Le das muchas vueltas a lo mismo sin terminar de encontrar una salida.',
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
      { h: 'Las primeras sesiones son para conocernos', body: [{ p: 'Al principio nos conocemos entendiendo qué te trae, qué buscás, en qué estás. No espero que me expliques nada rápido ni concreto. El espacio, como la confianza, se construye; no se exige.' }] },
      { h: 'Qué NO va a pasar', body: [{ p: 'No te voy a juzgar, ni a decirte qué hacer con tu vida, ni a tratarte bajo un diagnóstico. No hay respuestas correctas ni examen a rendir. Es tu espacio, y se trabaja a tu lado, no por encima.' }] },
      { h: '¿Y si siento que no es para mí?', body: [{ p: 'Es válido probar y ver. Las primeras charlas también sirven para que vos sientas si "enganchás" con el otro. Si no, está perfecto: lo importante es que encuentres tu lugar.' }] },
      { h: 'El primer paso puede ser el más simple', body: [{ p: 'Pensalo así: es solo escribir un mensaje y coordinar una charla. Sin compromisos y sin planificar nada de antemano. Cuando quieras dar ese paso, estoy de este lado.' }] },
    ],
  },
  {
    slug: 'como-es-una-sesion-de-terapia-online',
    title: 'Cómo es una sesión de terapia online',
    metaTitle: 'Cómo es una sesión de terapia online | Lic. Diego Jurfest',
    metaDesc: 'Si nunca hiciste terapia por videollamada, acá te cuento cómo es una sesión online, paso a paso, para que llegues sin dudas.',
    hook: 'Te imaginás como que es raro, frío o inútil, porque es a través de una pantalla. Y a los cinco minutos te olvidaste de la pantalla si lo que importa —que alguien te escuche como necesitás— sucede igual.',
    lead: 'Si nunca hiciste terapia online, esto es para ayudarte a que llegues sin dudas a tu primera sesión.',
    sections: [
      { h: '¿Qué es lo único que necesitás?', body: [{ p: 'Un lugar donde puedas mantenerte tranquilo/a, tus auriculares si no estás completamente solo y querés más privacidad, y conexión a internet. Nada más que eso. Todo lo demás está a un clic de distancia.' }] },
      { h: 'Cómo es una sesión vista desde dentro', body: [{ p: 'Es una conversación. Hablás, te escucho, y vamos entendiendo juntos qué te trajo a este espacio, qué necesitás. No hay cuestionario ni molde: cada sesión sigue el ritmo de lo que traés ese día, tu ritmo.' }] },
      { h: '¿Cómo es la privacidad?', body: [{ p: 'Es una sala de Google Meet creada especialmente para eso: con un link único por sesión, sin grabaciones, sin registros digitales. Lo que se habla queda en este espacio, entre vos y yo. Si por algún motivo preferís otra vía (por ejemplo, videollamada de WhatsApp), también existe esa posibilidad, ajustándonos a las configuraciones de privacidad correspondientes.' }] },
      { h: '¿Funciona igual que presencial?', body: [{ p: 'Por supuesto que todo espacio es diferente. Pero lo que ayuda no es el sillón, la ventana, ni los adornos de la sala: es el vínculo y el trabajo. Y eso se sostiene perfecto en nuestra videollamada, con la ventaja de hacerlo desde tu lugar seguro, sin traslados, demoras ni esperas.' }] },
      { h: 'La mejor forma de estar seguro es probarlo', body: [{ p: 'Si te da curiosidad pero te frena la duda, una primera charla la despeja en minutos. Contá con la disponibilidad que necesites: coordinamos cuando *a vos* te quede cómodo.' }] },
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
      { h: 'Por qué se enciende justo de noche', body: [{ p: 'Durante el día, mente y cuerpo están ocupados. En la noche, al momento de acostarse, no hay distracciones, entonces la mente aprovecha para procesar todo lo que está pendiente. No es que "estás pensando de más": es que recién ahí hay silencio real para hacerlo.' }] },
      { h: 'Qué podés probar', body: [{ ul: [
        '**Descargá la cabeza antes de la cama.** Anotá en tus notas (cuadernito, celular, tasks, lo que te quede cómodo) aquello que considerás "pendiente", o simplemente lo que te está resonando en la cabeza. Sacarlo de los pensamientos y ponerlo en palabras, ayuda.',
        '**Bajá las pantallas un rato antes.** La luz, el celular y el scroll mantienen el cerebro en "alerta". Dale una transición más tranquila.',
        '**No pelees con el "me cuesta dormirme".** Si no viene el sueño, no te quedes luchando: levantate un momento, hacé algo calmo y breve, y volvé cuando aflojes. Pelear contigo mismo solo lo empeora.',
        '**Cuidá los horarios.** Acostarte y levantarte a horas parecidas le ordena el reloj al cuerpo, y consecuentemente a la cabeza. Cumplir con una rutina es programarte para un mejor funcionamiento.' ] }] },
      { h: 'Cuándo puede haber "algo más"', body: [{ p: 'Si te cuesta dormir por muchas noches seguidas, de día te sentís más agotado o más inquieto, o sentís que tus horarios están desconfigurados, muchas veces el sueño es la punta de algo más (estrés, una preocupación sostenida). Abordar eso con mayor profundidad suele ayudar a mejorar el descanso, y quizás lo que anotaste antes de dormir se ordene mejor hablándolo con alguien.' }] },
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
      { h: 'No estás partido: estás hecho de las dos', body: [{ p: 'Tener dos idiomas, dos códigos, dos formas de ver el mundo no es una grieta: es una riqueza, aunque a veces incomode. No tenés que elegir una mitad —las dos hacen a lo que sos hoy.' }] },
      { h: 'El cansancio de "traducirte" todo el tiempo', body: [{ p: 'Adaptarte a códigos que no son los tuyos —el humor, las formas, las costumbres— puede ser cansador. Es normal extrañar lugares donde no tenías que explicar nada; reconocerlo alivia y es un gran primer paso.' }] },
      { h: 'Tu lugar no siempre es un país', body: [{ p: 'Muchas veces, lo que entendés como "tu lugar" es la gente que tenés alrededor en este momento. Construir y desarrollar esos vínculos —además de un espacio propio— puede pesar más que un mapa, y no significa que vayas a olvidar de dónde venís.' }] },
      { h: 'Un espacio en tu idioma', body: [{ p: 'Existe una sensación muy común de "no encajar", y muchas veces pesa, te aísla o te incomoda pensarlo. Lograr ponerlo en palabras con alguien que entienda el cruce entre culturas puede ordenar mucho estas sensaciones, y hacerlo en tu idioma y sin tener que explicar de más facilita el proceso. Si te identificás con algo de esto, te invito a que lo conversemos con claridad.' }] },
    ],
  },
];

let n = 0;
for (const a of articles) {
  const dir = path.join(PUB, 'recursos', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(a));
  n++;
}
console.log(`OK — ${n} páginas en /public/recursos/  (PREVIEW=${PREVIEW} -> robots ${PREVIEW ? 'noindex' : 'index'})`);
