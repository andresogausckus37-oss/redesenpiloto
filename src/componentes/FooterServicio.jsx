import { useNavigate } from "react-router-dom";

const RUTA_LANDING = "/servicios/publicacion-automatica";
const FUENTE = "'Montserrat', ui-sans-serif, system-ui, sans-serif";

const IconoInstagram = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function FooterServicio() {
  const navigate = useNavigate();

  const ir = (ruta) => {
    navigate(ruta);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{ fontFamily: FUENTE }}
      className="bg-tinta px-5 py-12 text-borde"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-base font-semibold text-white">Redes en Piloto</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-tinta-apagado">
              Gestión automática de publicaciones para Facebook e Instagram.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <button
              type="button"
              onClick={() => ir(RUTA_LANDING)}
              className="transition hover:text-white"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => ir(`${RUTA_LANDING}?acceso=registro`)}
              className="transition hover:text-white"
            >
              Registrarme
            </button>
            <button
              type="button"
              onClick={() => ir(`${RUTA_LANDING}?acceso=ingreso`)}
              className="transition hover:text-white"
            >
              Iniciar sesión
            </button>
            <a
              href="https://instagram.com/redesenpiloto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <IconoInstagram />
              <span>@redesenpiloto</span>
            </a>
          </nav>
        </div>
        <div className="mt-10 border-t border-tinta pt-6 text-center text-xs text-tinta-apagado">
          © {new Date().getFullYear()} Redes en Piloto. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
