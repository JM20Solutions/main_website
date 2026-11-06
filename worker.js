// JM20 hub - markdown for agents.
// Runs ONLY for the homepage ("/"), see run_worker_first in wrangler.jsonc.
// Accept: text/markdown -> markdown copy of the homepage. Everyone else -> the normal static site.
// If you change the homepage text in index.html, update MARKDOWN below to match.

const MARKDOWN = `# JM20 — Tu socio de IA | Auditoría de negocio

JM20 identifica dónde pierde dinero tu negocio, calcula cuánto te cuesta y construye la solución con IA y automatización.

Versión en inglés: https://jm20aisolutions.com/en/index.html

## Tu negocio puede estar perdiendo dinero sin que lo veas.

En JM20 identificamos dónde pierde dinero tu negocio, calculamos cuánto te cuesta y lo solucionamos con automatización e inteligencia artificial.

No necesitas más herramientas. Necesitas que tu negocio funcione mejor.

## Pon precio a tu fuga

Calculadora de 30 segundos con cuatro fugas habituales. Introduces tus propios valores y la web suma el impacto económico potencial estimado, por mes y por año. Es una estimación orientativa, no una promesa de resultados: el cálculo real se hace junto con los números de tu negocio.

## Descubre lo que la IA podría hacer por tu negocio

Simulaciones ilustrativas de cómo podría funcionar una solución adaptada a cada empresa. No se consultan sistemas reales ni se ejecutan acciones reales.

## No se trata de instalar inteligencia artificial. Se trata de resolver problemas reales.

Cada negocio funciona de una manera diferente. Por eso JM20 no empieza recomendando una herramienta, un chatbot o una automatización: empieza entendiendo cómo funciona tu negocio.

A veces será una automatización sencilla. Otras, inteligencia artificial, conectar sistemas o una solución a medida. La tecnología se adapta a tu negocio, no al revés.

## ¿Cómo trabajamos?

Entender, identificar, calcular, resolver. No se empieza eligiendo herramientas, sino entendiendo dónde está el problema.

## Dos ejemplos de soluciones

### Noah — Asistente telefónico para barberías

Un asistente telefónico que atiende las llamadas, consulta la disponibilidad real de la agenda y permite reservar, modificar o cancelar citas durante la conversación.

https://noah.jm20aisolutions.com/

### Murph — Atención al cliente con IA para comercios y tiendas

Murph responde con la información del negocio, detecta lo que necesita atención humana y avisa al propietario con el contexto. Forma parte de un ecosistema de IA: Mowaat (panel para el propietario), Iggy y Sheetah (preguntas a tus gráficos y a tus datos).

https://murph.jm20aisolutions.com/

Estos son dos ejemplos. El proyecto adecuado dependerá de los problemas que se identifiquen en cada negocio.

## Empecemos por una auditoría de tu negocio

No necesitas saber qué tecnología necesitas. En una primera conversación nos cuentas cómo trabajas, identificamos dónde puedes estar perdiendo dinero y valoramos su impacto. Si no encontramos una mejora que justifique la inversión, también te lo diremos.

Contacto: formulario en https://jm20aisolutions.com/#contacto

## Enlaces

- Política de privacidad: https://jm20aisolutions.com/politica-de-privacidad.html
- Aviso legal: https://jm20aisolutions.com/terminos-de-servicio.html
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isRead = request.method === "GET" || request.method === "HEAD";
    const accept = request.headers.get("Accept") || "";

    if (isRead && url.pathname === "/" && /text\/markdown/i.test(accept)) {
      return new Response(request.method === "HEAD" ? null : MARKDOWN, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Vary": "Accept",
          "x-markdown-tokens": String(Math.ceil(MARKDOWN.length / 4)),
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    // Everyone else: the normal site, served by the static assets (keeps your _headers).
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.append("Vary", "Accept");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
