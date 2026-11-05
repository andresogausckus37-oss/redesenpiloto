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
        <h2 id="que-es">1. Qué es Redes en Piloto</h2>
        <p>Redes en Piloto es una herramienta de programación automática de contenido para Instagram, Facebook y próximamente Threads, TikTok, YouTube Shorts, Pinterest, LinkedIn y más. No somos una agencia de marketing. No garantizamos viralidad, alcance ni ventas. Te ayudamos a mantener presencia constante mientras duermes.</p>

        <h2 id="prueba">2. Prueba gratis de 7 días</h2>
        <p>Al registrarte obtienes 7 días gratis con hasta 4 contenidos por red (8 si usas Instagram + Facebook). No pedimos tarjeta para iniciar. Al finalizar, te avisamos por email y WhatsApp. Si no contratas, tu contenido no se publica y tu cuenta queda inactiva, pero no se borra de inmediato.</p>

        <h2 id="planes">3. Planes y precios</h2>
        <p>Los precios se muestran primero en ARS y luego en USD como referencia para LATAM. <strong>1 red social (Instagram o Facebook) por 1 semana: $6.990 ARS (USD 4). 2 redes (Instagram + Facebook) por 1 semana: $10.990 ARS (USD 6).</strong> Es un pago por semana de servicio, no mensual. Puedes contratar semanas sueltas.</p>

        <h2 id="contenido">4. Tu contenido y tu responsabilidad</h2>
        <p>Tú eres 100% responsable del contenido que subes. No subas material que infrinja derechos de autor, que sea discriminatorio, que viole las Normas Comunitarias de Meta, TikTok o YouTube. Si subes un archivo dañado, nuestro equipo de revisión te pedirá corrección desde el panel de administración. Nos reservamos el derecho de no publicar contenido que pueda poner en riesgo tu cuenta.</p>

        <h2 id="limites">5. Límites de las plataformas externas</h2>
        <p>Instagram, Facebook, Threads, TikTok y YouTube pueden fallar, cambiar sus APIs o rechazar una publicación (por ejemplo, música con copyright en Reels). Si eso pasa, tu publicación queda marcada como "Requiere atención" en tu panel y te avisamos. No somos responsables por caídas de Meta o TikTok.</p>

        <h2 id="pagos">6. Pagos, cancelación y reembolsos</h2>
        <p>Pagos vía transferencia o PayPal. Puedes cancelar en cualquier momento desde tu panel. No hay cobros automáticos recurrentes ocultos. Si contrataste una semana y no usaste el servicio por un error nuestro, te reponemos la semana. No hay reembolso si ya se publicó el contenido.</p>

        <h2 id="soporte">7. Soporte 100% humano</h2>
        <p>Ofrecemos soporte humano por email y WhatsApp. No usamos bots que no entienden tu problema. Tiempo de respuesta promedio: menos de 24 horas hábiles. Horario: lunes a viernes 9 a 18 hs (Argentina GMT-3).</p>

        <h2 id="contacto">8. Contacto legal</h2>
        <p>Para cualquier duda legal: hola@redesenpiloto.com.ar. Legislación aplicable: República Argentina. Si hay conflicto, intentaremos resolverlo de forma amistosa antes de cualquier instancia judicial.</p>
      </LegalLayout>
    </>
  );
}
