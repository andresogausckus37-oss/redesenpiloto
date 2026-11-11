import { Helmet } from "react-helmet-async";
import LegalLayout from "../../componentes/LegalLayout";

const secciones = [
  { id: "que-es", titulo: "Qué es Redes en Piloto" },
  { id: "prueba", titulo: "Prueba gratis" },
  { id: "planes", titulo: "Planes y precios" },
  { id: "contenido", titulo: "Tu contenido" },
  { id: "limites", titulo: "Límites de las plataformas" },
  { id: "pagos", titulo: "Pagos, cancelación y reembolsos" },
  { id: "soporte", titulo: "Soporte" },
  { id: "contacto", titulo: "Contacto legal" },
];

const Bloque = ({ id, titulo, children }) => (
  <section className="border-b border-borde pb-10 last:border-0 last:pb-0">
    <h2 id={id} className="mb-3 scroll-mt-28 text-lg font-medium tracking-tight text-tinta">{titulo}</h2>
    <div className="space-y-3 text-sm leading-7 text-tinta-suave [&_strong]:font-medium [&_strong]:text-tinta">{children}</div>
  </section>
);

const WHATSAPP_URL = "https://wa.me/5493548619293?text=Hola%20Redes%20en%20Piloto%2C%20tengo%20una%20duda%20sobre%20t%C3%A9rminos%20y%20condiciones";

export default function Terminos() {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | Redes en Piloto</title>
        <meta name="description" content="Términos claros y en español neutro. Prueba 7 días gratis, planes semanales desde $6.990 ARS, sin letra chica." />
        <link rel="canonical" href="https://redesenpiloto.com.ar/terminos" />
      </Helmet>
      <LegalLayout
        titulo="Términos claros, sin letra chica."
        subtitulo="Usamos español neutro y ejemplos reales. Si no entiendes algo, te lo explica una persona, no un bot."
        actualizado="13 DE MAYO DE 2026"
        secciones={secciones}
        resumen={[
          "7 días gratis con 8 publicaciones automáticas. Sin tarjeta al inicio.",
          "Planes semanales: 1 red $6.990 ARS / 2 redes $10.990 ARS. Sin cobros automáticos ocultos.",
          "Tú mantienes la propiedad de tu contenido. Puedes cancelar cuando quieras desde tu panel.",
        ]}
      >
        <Bloque id="que-es" titulo="1. Qué es Redes en Piloto">
          <p>Redes en Piloto es una herramienta de programación automática de contenido para Instagram, Facebook y próximamente Threads, TikTok, YouTube Shorts, Pinterest, LinkedIn y más.</p>
          <p>No somos una agencia de marketing. No garantizamos viralidad, alcance ni ventas. Te ayudamos a mantener presencia constante mientras duermes.</p>
        </Bloque>

        <Bloque id="prueba" titulo="2. Prueba gratis de 7 días">
          <p>Al registrarte obtienes 7 días gratis con hasta 4 contenidos por red (8 si usas Instagram + Facebook). No pedimos tarjeta para iniciar.</p>
          <p>Al finalizar, te avisamos por email y WhatsApp. Si no contratas, tu contenido no se publica y tu cuenta queda inactiva, pero no se borra de inmediato.</p>
        </Bloque>

        <Bloque id="planes" titulo="3. Planes y precios">
          <p>Los precios se muestran primero en ARS y luego en USD como referencia para LATAM.</p>
          <p><strong>1 red social (Instagram o Facebook) por 1 semana: $6.990 ARS (USD 4). 2 redes (Instagram + Facebook) por 1 semana: $10.990 ARS (USD 6).</strong></p>
          <p>Es un pago por semana de servicio, no mensual. Puedes contratar semanas sueltas.</p>
        </Bloque>

        <Bloque id="contenido" titulo="4. Tu contenido y tu responsabilidad">
          <p>Tú eres 100% responsable del contenido que subes. No subas material que infrinja derechos de autor, que sea discriminatorio, que viole las Normas Comunitarias de Meta, TikTok o YouTube.</p>
          <p>Si subes un archivo dañado, nuestro equipo de revisión te pedirá corrección desde el panel de administración. Nos reservamos el derecho de no publicar contenido que pueda poner en riesgo tu cuenta.</p>
        </Bloque>

        <Bloque id="limites" titulo="5. Límites de las plataformas externas">
          <p>Instagram, Facebook, Threads, TikTok y YouTube pueden fallar, cambiar sus APIs o rechazar una publicación (por ejemplo, música con copyright en Reels).</p>
          <p>Si eso pasa, tu publicación queda marcada como &quot;Requiere atención&quot; en tu panel y te avisamos. No somos responsables por caídas de Meta o TikTok.</p>
        </Bloque>

        <Bloque id="pagos" titulo="6. Pagos, cancelación y reembolsos">
          <p>Pagos vía transferencia o PayPal. Puedes cancelar en cualquier momento desde tu panel. No hay cobros automáticos recurrentes ocultos.</p>
          <p>Si contrataste una semana y no usaste el servicio por un error nuestro, te reponemos la semana. No hay reembolso si ya se publicó el contenido.</p>
        </Bloque>

        <Bloque id="soporte" titulo="7. Soporte 100% humano">
          <p>Ofrecemos soporte humano por WhatsApp. No usamos bots que no entienden tu problema.</p>
          <p>Tiempo de respuesta promedio: menos de 24 horas hábiles. Horario: lunes a viernes 9 a 18 hs (Argentina GMT-3).</p>
          <p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-azul underline underline-offset-2">Hablar por WhatsApp con soporte →</a></p>
        </Bloque>

        <Bloque id="contacto" titulo="8. Contacto legal">
          <p>Para cualquier duda legal, escribinos por WhatsApp y te responde una persona real de nuestro equipo.</p>
          <p>Legislación aplicable: República Argentina. Si hay conflicto, intentaremos resolverlo de forma amistosa antes de cualquier instancia judicial.</p>
          <p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-azul underline underline-offset-2">Escribir por WhatsApp →</a></p>
        </Bloque>
      </LegalLayout>
    </>
  );
}
