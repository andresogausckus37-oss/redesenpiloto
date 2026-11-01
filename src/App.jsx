
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Navbar from "./componentes/Navbar";
import Hero from "./componentes/Hero";
import Servicios from "./componentes/Servicios";
import ComoFunciona from "./componentes/ComoFunciona";
import Resenas from "./componentes/Resenas";
import Disponibilidad from "./componentes/Disponibilidad";
import SobreMi from "./componentes/SobreMi";
import Footer from "./componentes/Footer";
import WhatsAppFlotante from "./componentes/WhatsAppFlotante";

import LandingPublicaciones from "./paginas/servicios/LandingPublicaciones";
import PanelClientePublicaciones from "./paginas/servicios/PanelClientePublicaciones";

import LoginAdmin from "./paginas/LoginAdmin";
import NavbarServicio from "./componentes/NavbarServicio";
import FooterServicio from "./componentes/FooterServicio";

/* =========================
   REGISTRAR NUEVA VISITA
========================= */

const RegistrarVisita = () => {
  const location = useLocation();

  useEffect(() => {
    const ruta = location.pathname;

    /* NO REGISTRAR ADMIN */

    if (ruta.startsWith("/admin")) {
      return;
    }

    /* UNA SOLA VEZ POR SESIÓN */

    if (
      sessionStorage.getItem(
        "visita_notificada"
      )
    ) {
      return;
    }

    let pagina = ruta;

    if (ruta === "/") {
      pagina = "Inicio";
    }

    /* MARCAR ANTES DEL FETCH PARA
       EVITAR NOTIFICACIONES DUPLICADAS */

    sessionStorage.setItem(
      "visita_notificada",
      "true"
    );

    fetch("/api/visitas", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        pagina,
        ruta,
      }),
    }).catch((error) => {
      console.error(
        "Error registrando visita:",
        error
      );
    });
  }, [location.pathname]);

  return null;
};

/* =========================
   SCROLL ARRIBA
========================= */

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname, location.state]);

  return null;
};

// Conserva el enlace antiguo para vincular pedidos existentes desde el panel.
const RedireccionPanelAnterior = () => {
  const location = useLocation();

  return (
    <Navigate
      replace
      to={{
        pathname:
          "/servicios/publicacion-automatica/mi-panel",
        hash: location.hash,
      }}
    />
  );
};

/* =========================
   HOME
========================= */

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  useEffect(() => {
    const seccion =
      location.state?.scrollTo;

    if (!seccion) {
      return;
    }

    requestAnimationFrame(() => {
      document
        .getElementById(seccion)
        ?.scrollIntoView({
          behavior: "smooth",
        });
    });

    navigate("/", {
      replace: true,
      state: null,
    });
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero scrollTo={scrollTo} />

      <Servicios />

      <ComoFunciona />

      <Resenas />

      <Disponibilidad />

      <SobreMi />

      <WhatsAppFlotante />
    </div>
  );
};

/* =========================
   CONTENIDO GLOBAL
========================= */

const ContenidoApp = () => {
  const location = useLocation();

  const esHome =
    location.pathname === "/";
  const esServicio =
    location.pathname.startsWith("/servicios");

  return (
    <>
      <RegistrarVisita />

      {esServicio ? <NavbarServicio /> : <Navbar />}

      <ScrollToTop />

      <div
        className={
          esHome ? "" : "pt-20"
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/servicios/publicacion-automatica"
                replace
              />
            }
          />

          <Route
            path="/servicios/publicacion-automatica"
            element={<LandingPublicaciones />}
          />

          <Route
            path="/servicios/publicacion-automatica/configurar"
            element={<RedireccionPanelAnterior />}
          />

          <Route
            path="/servicios/publicacion-automatica/mi-panel"
            element={<PanelClientePublicaciones />}
          />

          <Route
            path="/admin/login"
            element={<LoginAdmin />}
          />
        </Routes>

        {esServicio ? <FooterServicio /> : <Footer />}
      </div>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ContenidoApp />
    </BrowserRouter>
  );
};

export default App;
