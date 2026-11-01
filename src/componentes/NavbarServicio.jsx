import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Send } from "lucide-react";

const RUTA_LANDING = "/servicios/publicacion-automatica";
const WHATSAPP = "5493548619293";

export default function NavbarServicio() {
  const navigate = useNavigate();
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAbierto(false);
  }, [location.pathname]);

  const irInicio = () => {
    setAbierto(false);
    if (location.pathname === RUTA_LANDING) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(RUTA_LANDING);
    }
  };

  const irPrecios = () => {
    setAbierto(false);
    if (location.pathname === RUTA_LANDING) {
      document.getElementById("precios")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(RUTA_LANDING, { state: { scrollTo: "precios" } });
    }
  };

  const enlaces = [
    { label: "Inicio", onClick: irInicio },
    { label: "Precios", onClick: irPrecios },
    { label: "Contacto", href: `https://wa.me/${WHATSAPP}`, external: true },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || location.pathname !== RUTA_LANDING
          ? "border-b border-slate-200 bg-white/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <button type="button" onClick={irInicio} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white">
            <Send size={16} />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            redesenpiloto
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {enlaces.map((e) =>
            e.external ? (
              <a
                key={e.label}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-700"
              >
                {e.label}
              </a>
            ) : (
              <button
                key={e.label}
                type="button"
                onClick={e.onClick}
                className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-700"
              >
                {e.label}
              </button>
            )
          )}
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {abierto && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {enlaces.map((e) =>
              e.external ? (
                <a
                  key={e.label}
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-50"
                >
                  {e.label}
                </a>
              ) : (
                <button
                  key={e.label}
                  type="button"
                  onClick={e.onClick}
                  className="rounded-md px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-orange-50"
                >
                  {e.label}
                </button>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
