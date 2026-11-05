import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

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

// SOLO LEGALES (sin admin para evitar error de build)
import Privacidad from "./paginas/legal/Privacidad";
import Terminos from "./paginas/legal/Terminos";

const RegistrarVisita = () => {
  const location = useLocation();
  useEffect(() => {
    const ruta = location.pathname;
    if (ruta.startsWith("/admin")) return;
    if (sessionStorage.getItem("visita_notificada")) return;
    let pagina = ruta;
    if (ruta === "/") pagina = "Inicio";
    sessionStorage.setItem("visita_notificada", "true");
    fetch("/api/visitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagina, ruta }),
    }).catch(() => {});
  }, [location.pathname]);
  return null;
};

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollTo) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.state]);
  return null;
};

const RedireccionPanelAnterior = () => {
  const location = useLocation();
  return <Navigate replace to={{ pathname: "/publicacion-automatica/mi-panel", hash: location.hash }} />;
};
const RedireccionViejaLanding = () => {
  const location = useLocation();
  return <Navigate replace to={{ pathname: "/publicacion-automatica", search: location.search, hash: location.hash }} />;
};
const RedireccionViejaPanel = () => {
  const location = useLocation();
  return <Navigate replace to={{ pathname: "/publicacion-automatica/mi-panel", search: location.search, hash: location.hash }} />;
};

const ContenidoApp = () => {
  const location = useLocation();
  const esHome = location.pathname === "/";
  const esServicio =
    location.pathname.startsWith("/publicacion-automatica") ||
    location.pathname.startsWith("/servicios/publicacion-automatica") ||
    location.pathname.startsWith("/privacidad") ||
    location.pathname.startsWith("/terminos") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      <RegistrarVisita />
      {esServicio ? <NavbarServicio /> : <Navbar />}
      <ScrollToTop />
      <div className={esHome ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<Navigate to="/publicacion-automatica" replace />} />
          <Route path="/publicacion-automatica" element={<LandingPublicaciones />} />
          <Route path="/publicacion-automatica/mi-panel" element={<PanelClientePublicaciones />} />
          <Route path="/publicacion-automatica/configurar" element={<RedireccionPanelAnterior />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/servicios/publicacion-automatica" element={<RedireccionViejaLanding />} />
          <Route path="/servicios/publicacion-automatica/mi-panel" element={<RedireccionViejaPanel />} />
          <Route path="/servicios/publicacion-automatica/configurar" element={<RedireccionPanelAnterior />} />
        </Routes>
        {esServicio ? <FooterServicio /> : <Footer />}
      </div>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ContenidoApp />
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
