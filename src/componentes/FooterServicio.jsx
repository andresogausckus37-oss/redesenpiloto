import { Link } from "react-router-dom";
import { ShieldCheck, Mail } from "lucide-react";

const FUENTE = "'Montserrat', ui-sans-serif, system-ui, sans-serif";

const IconoInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function FooterServicio() {
  return (
    <footer style={{ fontFamily: FUENTE }} className="bg-azul-ink px-4 py-10 text-slate-300 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* TOP */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-base font-medium text-white">Redes en Piloto</p>
            <p className="mt-2 text-sm leading-6 text-slate-300/90">
              Gestión automática de publicaciones para Instagram y Facebook. Tú te enfocas en tu negocio, nosotros mantenemos tu presencia activa mientras duermes.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white">
              <ShieldCheck size={12} /> Soporte 100% humano · Sin bots
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <nav className="flex flex-col gap-2.5 text-sm">
              <p className="text-[11px] font-medium tracking-wide text-slate-400">SERVICIO</p>
              <Link to="/publicacion-automatica" className="transition hover:text-white">Inicio</Link>
              <Link to="/publicacion-automatica?acceso=registro" className="transition hover:text-white">Registrarme</Link>
              <Link to="/publicacion-automatica?acceso=ingreso" className="transition hover:text-white">Iniciar sesión</Link>
              <Link to="/publicacion-automatica/mi-panel" className="transition hover:text-white">Mi panel</Link>
            </nav>

            <nav className="flex flex-col gap-2.5 text-sm">
              <p className="text-[11px] font-medium tracking-wide text-slate-400">LEGAL</p>
              <Link to="/privacidad" className="transition hover:text-white">Política de Privacidad</Link>
              <Link to="/terminos" className="transition hover:text-white">Términos y Condiciones</Link>
               <a href="https://instagram.com/redesenpiloto" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-white"><IconoInstagram /> @redesenpiloto</a>
            </nav>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Redes en Piloto. Todos los derechos reservados.</p>
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span>Hecho para Argentina y LATAM</span>
            <span className="text-slate-600">•</span>
            <Link to="/privacidad" className="underline underline-offset-2 hover:text-white">Privacidad</Link>
            <span className="text-slate-600">•</span>
            <Link to="/terminos" className="underline underline-offset-2 hover:text-white">Términos</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
