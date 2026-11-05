import { Helmet } from "react-helmet-async";
import LegalLayout from "../../componentes/LegalLayout";

const secciones = [
  { id: "que-guardamos", titulo: "Qué datos guardamos" },
  { id: "que-no-guardamos", titulo: "Qué NO guardamos" },
  { id: "por-que", titulo: "Por qué los necesitamos" },
  { id: "meta-apis", titulo: "Conexión con Meta, TikTok, YouTube" },
  { id: "donde", titulo: "Dónde se guardan" },
  { id: "derechos", titulo: "Tus derechos" },
  { id: "cookies", titulo: "Cookies" },
  { id: "contacto", titulo: "Contacto" },
];

export default function Privacidad() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | Redes en Piloto</title>
        <meta name="description" content="Cómo protegemos tus datos en Redes en Piloto. No vendemos datos, no leemos tu contenido. Cumple Ley 25.326 Argentina y GDPR." />
        <link rel="canonical" href="https://redesenpiloto.com.ar/privacidad" />
      </Helmet>

      <LegalLayout
        titulo="Tu privacidad es tu negocio. La protegemos como si fuera nuestra."
        subtitulo="En Redes en Piloto no vendemos tus datos, no leemos tu contenido y no hacemos spam. Usamos tu información solo para publicar tu contenido mientras duermes."
        actualizado="13 DE MAYO DE 2026"
        secciones={secciones}
        resumen={[
          "Solo usamos tu email, WhatsApp y nombre de emprendimiento para gestionar tu cuenta.",
          "Tus tokens de Instagram/Facebook se guardan encriptados. Nunca vemos tu contraseña.",
          "Puedes borrar todo y revocar accesos cuando quieras desde tu panel o desde Meta.",
        ]}
      >
        <h2 id="que-guardamos">1. Qué datos guardamos</h2>
        <p>Cuando creas una cuenta guardamos: nombre y apellido, email, WhatsApp, país, nombre del emprendimiento y sitio web opcional. Cuando conectas Instagram o Facebook, guardamos el token de acceso oficial que nos entrega Meta (encriptado en AES-256). También guardamos el contenido que subes: imágenes, videos, copies, horarios de publicación y hashtags.</p>

        <h2 id="que-no-guardamos">2. Qué NO guardamos</h2>
        <p><strong>Nunca guardamos tu contraseña de Instagram o Facebook.</strong> La conexión es vía OAuth oficial. No vendemos, alquilamos ni compartimos tus datos con terceros para publicidad. No leemos tus mensajes privados ni accedemos a tu lista de amigos.</p>

        <h2 id="por-que">3. Por qué los necesitamos</h2>
        <p>Para crear tu panel, enviarte el código de acceso, publicar tu contenido en el día y horario que elegiste, y darte soporte humano. Sin estos datos no podríamos ofrecer el servicio de publicación automática.</p>

        <h2 id="meta-apis">4. Conexión con Meta, TikTok, YouTube y otras plataformas</h2>
        <p>Al conectar tu cuenta de Instagram, Facebook, Threads, TikTok o YouTube, autorizas a Redes en Piloto a publicar en tu nombre. Esta autorización es revocable en cualquier momento desde tu panel (Desconectar cuenta) o desde la configuración de tu cuenta: Facebook > Configuración > Permisos de negocios > Integraciones. Cuando integramos TikTok, YouTube Shorts, Pinterest, LinkedIn y otras plataformas de la sección Próximamente, aplican las mismas condiciones de transparencia.</p>

        <h2 id="donde">5. Dónde se guardan y cómo los protegemos</h2>
        <p>Tus datos se almacenan en la infraestructura de Cloudflare (Estados Unidos y Unión Europea) con cifrado en tránsito (TLS 1.3) y en reposo. Los archivos se guardan en R2 con acceso privado. Los tokens de Meta se guardan encriptados y nunca se exponen en el frontend.</p>

        <h2 id="derechos">6. Tus derechos (Ley 25.326 Argentina y GDPR)</h2>
        <p>Tienes derecho a acceder, rectificar, actualizar y suprimir tus datos (derechos ARCO). También puedes oponerte al tratamiento y solicitar la portabilidad. Para ejercerlos escríbenos a <strong>hola@redesenpiloto.com.ar</strong> con el asunto "Privacidad". Respondemos en menos de 24 horas, con una persona real, no un bot.</p>

        <h2 id="cookies">7. Cookies</h2>
        <p>Usamos solo cookies esenciales para mantener tu sesión iniciada y recordar tu zona horaria. No usamos cookies de rastreo de terceros ni píxeles publicitarios en tu panel privado.</p>

        <h2 id="contacto">8. Contacto y responsable</h2>
        <p>Responsable: Redes en Piloto. Contacto de privacidad: hola@redesenpiloto.com.ar. Si cambiamos esta política, te avisaremos por email y en tu panel con 15 días de anticipación.</p>
      </LegalLayout>
    </>
  );
}
