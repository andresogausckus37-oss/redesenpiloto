import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const RUTA_LANDING = "/servicios/publicacion-automatica";
const WHATSAPP = "5493548619293";
const FUENTE = "'Montserrat', ui-sans-serif, system-ui, sans-serif";

function cargarMontserrat() {
  if (document.getElementById("fuente-montserrat-servicio")) return;
  const link = document.createElement("link");
  link.id = "fuente-montserrat-servicio";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

export default function NavbarServicio() {
  const navigate = useNavigate();
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    cargarMontserrat();
  }, []);

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
      style={{ fontFamily: FUENTE }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || location.pathname !== RUTA_LANDING
          ? "border-b border-borde bg-white/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {/* IZQUIERDA: logo (+ texto en móvil) */}
        <button
          type="button"
          onClick={irInicio}
          className="flex items-center gap-2.5"
          aria-label="Ir al inicio de Redes en Piloto"
        >
          <img
            src="/logo-redesenpiloto.jpg"
            alt="Logo de Redes en Piloto"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-sm font-semibold tracking-tight text-tinta md:hidden">
            Redes en Piloto
          </span>
        </button>

        {/* CENTRO: texto (solo escritorio) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <span className="text-base font-semibold tracking-tight text-tinta">
            Redes en Piloto
          </span>
        </div>

        {/* DERECHA: menú escritorio */}
        <nav className="hidden items-center gap-1 md:flex">
          {enlaces.map((e) =>
            e.external ? (
              <a
                key={e.label}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm px-4 py-1.5 text-sm font-medium text-tinta-suave transition hover:bg-terracota-suave hover:text-terracota-oscuro"
              >
                {e.label}
              </a>
            ) : (
              <button
                key={e.label}
                type="button"
                onClick={e.onClick}
                className="rounded-sm px-4 py-1.5 text-sm font-medium text-tinta-suave transition hover:bg-terracota-suave hover:text-terracota-oscuro"
              >
                {e.label}
              </button>
            )
          )}
        </nav>

        {/* DERECHA: hamburguesa móvil */}
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          className="flex h-9 w-9 items-center justify-center rounded-sm text-tinta-suave transition hover:bg-borde md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {abierto && (
        <div className="border-t border-borde bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {enlaces.map((e) =>
              e.external ? (
                <a
                  key={e.label}
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm px-4 py-2.5 text-left text-sm font-medium text-tinta-suave transition hover:bg-terracota-suave"
                >
                  {e.label}
                </a>
              ) : (
                <button
                  key={e.label}
                  type="button"
                  onClick={e.onClick}
                  className="rounded-sm px-4 py-2.5 text-left text-sm font-medium text-tinta-suave transition hover:bg-terracota-suave"
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
