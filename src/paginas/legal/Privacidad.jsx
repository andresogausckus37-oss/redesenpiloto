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

// Cada bloque es una <section> separada con respiro visual: mb-10 + pb-10 + border-b
const Bloque = ({ id, titulo, children }) => (
  <section className="border-b border-borde pb-10 last:border-0 last:pb-0">
    <h2 id={id} className="mb-3 scroll-mt-28 text-lg font-medium tracking-tight text-tinta">{titulo}</h2>
    <div className="space-y-3 text-sm leading-7 text-tinta-suave [&_strong]:font-medium [&_strong]:text-tinta">{children}</div>
  </section>
);

const WHATSAPP_URL = "https://wa.me/5493548619293?text=Hola%20Redes%20en%20Piloto%2C%20tengo%20una%20duda%20sobre%20privacidad";

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
        <Bloque id="que-guardamos" titulo="1. Qué datos guardamos">
          <p>Cuando creas una cuenta guardamos: nombre y apellido, email, WhatsApp, país, nombre del emprendimiento y sitio web opcional. Cuando conectas Instagram o Facebook, guardamos el token de acceso oficial que nos entrega Meta (encriptado en AES-256).</p>
          <p>También guardamos el contenido que subes: imágenes, videos, copies, horarios de publicación y hashtags.</p>
        </Bloque>

        <Bloque id="que-no-guardamos" titulo="2. Qué NO guardamos">
          <p><strong>Nunca guardamos tu contraseña de Instagram o Facebook.</strong> La conexión es vía OAuth oficial.</p>
          <p>No vendemos, alquilamos ni compartimos tus datos con terceros para publicidad. No leemos tus mensajes privados ni accedemos a tu lista de amigos.</p>
        </Bloque>

        <Bloque id="por-que" titulo="3. Por qué los necesitamos">
          <p>Para crear tu panel, enviarte el código de acceso, publicar tu contenido en el día y horario que elegiste, y darte soporte humano. Sin estos datos no podríamos ofrecer el servicio de publicación automática.</p>
        </Bloque>

        <Bloque id="meta-apis" titulo="4. Conexión con Meta, TikTok, YouTube y otras plataformas">
          <p>Al conectar tu cuenta de Instagram, Facebook, Threads, TikTok o YouTube, autorizas a Redes en Piloto a publicar en tu nombre. Esta autorización es revocable en cualquier momento desde tu panel (Desconectar cuenta) o desde la configuración de tu cuenta: Facebook - Configuración - Permisos de negocios - Integraciones.</p>
          <p>Cuando integramos TikTok, YouTube Shorts, Pinterest, LinkedIn y otras plataformas de la sección Próximamente, aplican las mismas condiciones de transparencia.</p>
        </Bloque>

        <Bloque id="donde" titulo="5. Dónde se guardan y cómo los protegemos">
          <p>Tus datos se almacenan en la infraestructura de Cloudflare (Estados Unidos y Unión Europea) con cifrado en tránsito (TLS 1.3) y en reposo. Los archivos se guardan en R2 con acceso privado. Los tokens de Meta se guardan encriptados y nunca se exponen en el frontend.</p>
        </Bloque>

        <Bloque id="derechos" titulo="6. Tus derechos (Ley 25.326 Argentina y GDPR)">
          <p>Tienes derecho a acceder, rectificar, actualizar y suprimir tus datos (derechos ARCO). También puedes oponerte al tratamiento y solicitar la portabilidad.</p>
          <p>Para ejercerlos, escribinos por WhatsApp y te responde una persona real, no un bot. Respondemos en menos de 24 horas.</p>
          <p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-azul underline underline-offset-2">Escribir por WhatsApp para ejercer mis derechos →</a></p>
        </Bloque>

        <Bloque id="cookies" titulo="7. Cookies">
          <p>Usamos solo cookies esenciales para mantener tu sesión iniciada y recordar tu zona horaria. No usamos cookies de rastreo de terceros ni píxeles publicitarios en tu panel privado.</p>
        </Bloque>

        <Bloque id="contacto" titulo="8. Contacto y responsable">
          <p>Responsable: Redes en Piloto.</p>
          <p>Si tienes dudas sobre privacidad, escribinos por WhatsApp. Si cambiamos esta política, te avisaremos por email y en tu panel con 15 días de anticipación.</p>
          <p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-medium text-azul underline underline-offset-2">Hablar por WhatsApp →</a></p>
        </Bloque>
      </LegalLayout>
    </>
  );
}
