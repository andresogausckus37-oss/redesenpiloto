import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, ArrowLeft, Clock, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5493548619293?text=Hola%20Redes%20en%20Piloto%2C%20tengo%20una%20duda%20sobre%20privacidad%20y%20t%C3%A9rminos";

function cargarMontserrat() {
  const id = "legal-montserrat";
  if (document.getElementById(id)) return;
  const fuente = document.createElement("link");
  fuente.id = id;
  fuente.rel = "stylesheet";
  fuente.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap";
  document.head.appendChild(fuente);
}

export default function LegalLayout({ titulo, subtitulo, actualizado, resumen, secciones, children }) {
  const [activa, setActiva] = useState(secciones[0]?.id || "");
  useEffect(() => { cargarMontserrat(); }, []);
  useEffect(() => {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) setActiva(e.target.id); });
    }, { rootMargin: "-20% 0px -70% 0px" });
    secciones.forEach((s) => { const el = document.getElementById(s.id); if (el) observador.observe(el); });
    return () => observador.disconnect();
  }, [secciones]);

  return (
    <main className="min-h-screen bg-crema font-normal text-tinta" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <section className="border-b border-borde bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Link to="/publicacion-automatica" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-tinta-suave hover:text-azul">
            <ArrowLeft size={14} /> Volver a inicio
          </Link>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-azul-claro bg-azul-super-claro px-3 py-1.5">
              <Clock size={12} className="text-azul" />
              <span className="text-[11px] font-medium tracking-wide text-azul">ACTUALIZADO EL {actualizado}</span>
            </div>
            <h1 className="text-[28px] font-medium leading-[1.15] tracking-tight sm:text-[38px]">{titulo}</h1>
            <p className="mt-4 text-[15px] leading-7 text-tinta-suave">{subtitulo}</p>
            {resumen && (
              <div className="mt-6 rounded-sm border-2 border-azul bg-azul-super-claro/60 p-4 sm:p-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-azul"><ShieldCheck size={14} /> RESUMEN EN 30 SEGUNDOS PARA HUMANOS OCUPADOS</p>
                <ul className="space-y-2">
                  {resumen.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-6 text-tinta"><span className="text-azul">•</span> {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <p className="text-[11px] font-medium tracking-wide text-tinta-apagado">EN ESTA PÁGINA</p>
              <nav className="space-y-1 border-l border-borde">
                {secciones.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className={`block border-l-2 pl-3 py-1.5 text-xs font-medium transition ${activa === s.id ? "border-azul text-azul bg-azul-super-claro/50" : "border-transparent text-tinta-suave hover:text-tinta hover:border-borde"}`}>
                    {s.titulo}
                  </a>
                ))}
              </nav>
              <div className="rounded-sm border border-borde bg-white p-4 shadow-fintech">
                <p className="text-xs font-medium">¿Dudas?</p>
                <p className="mt-1 text-[11px] leading-4 text-tinta-suave">Soporte 100% humano, sin bots que no entienden tu problema.</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-sm bg-[#25D366] px-3 py-2 text-xs font-medium text-white hover:brightness-95">
                  <MessageCircle size={14} /> Escribir por WhatsApp
                </a>
              </div>
            </div>
          </aside>

          <article className="min-w-0 rounded-sm border border-borde bg-white p-6 shadow-fintech sm:p-8 lg:p-10">
            <div className="space-y-10">
              {children}
            </div>
            <div className="mt-12 rounded-sm border border-borde bg-crema-suave p-4 sm:p-5">
              <p className="flex items-center gap-1.5 text-xs font-medium text-tinta"><Mail size={14} /> ¿Algo no quedó claro?</p>
              <p className="mt-1 text-xs leading-5 text-tinta-suave">Escribinos por WhatsApp y te responde una persona real de nuestro equipo en menos de 24 horas. No usamos bots que no entienden tu problema.</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-[#25D366] px-4 py-2 text-xs font-medium text-white hover:brightness-95">
                <MessageCircle size={14} /> Hablar por WhatsApp
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
