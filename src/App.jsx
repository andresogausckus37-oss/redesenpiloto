import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LandingPublicaciones from "./paginas/servicios/LandingPublicaciones";
import PanelClientePublicaciones from "./paginas/servicios/PanelClientePublicaciones";
import LoginAdmin from "./paginas/LoginAdmin";
import AdminPanel from "./paginas/AdminPanel";
import NavbarServicio from "./componentes/NavbarServicio";
import FooterServicio from "./componentes/FooterServicio";
import Privacidad from "./paginas/legal/Privacidad";
import Terminos from "./paginas/legal/Terminos";
import WhatsAppFlotante from "./componentes/WhatsAppFlotante";

const RegistrarVisita = () => {
  const location = useLocation();
  useEffect(() => {
    const ruta = location.pathname;
    if (ruta.startsWith("/admin")) return;
    if (sessionStorage.getItem("visita_notificada")) return;
    sessionStorage.setItem("visita_notificada", "true");
    fetch("/api/visitas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pagina: ruta === "/" ? "Inicio" : ruta, ruta }) }).catch(() => {});
  }, [location.pathname]);
  return null;
};
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => { if (!location.state?.scrollTo) window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname, location.state]);
  return null;
};
const RedireccionPanelAnterior = () => { const l = useLocation(); return <Navigate replace to={{ pathname: "/publicacion-automatica/mi-panel", hash: l.hash }} />; };
const RedireccionViejaLanding = () => { const l = useLocation(); return <Navigate replace to={{ pathname: "/publicacion-automatica", search: l.search, hash: l.hash }} />; };
const RedireccionViejaPanel = () => { const l = useLocation(); return <Navigate replace to={{ pathname: "/publicacion-automatica/mi-panel", search: l.search, hash: l.hash }} />; };

const ContenidoApp = () => {
  return (
    <>
      <RegistrarVisita />
      <NavbarServicio />
      <ScrollToTop />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Navigate to="/publicacion-automatica" replace />} />
          <Route path="/publicacion-automatica" element={<LandingPublicaciones />} />
          <Route path="/publicacion-automatica/mi-panel" element={<PanelClientePublicaciones />} />
          <Route path="/publicacion-automatica/configurar" element={<RedireccionPanelAnterior />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/servicios/publicacion-automatica" element={<RedireccionViejaLanding />} />
          <Route path="/servicios/publicacion-automatica/mi-panel" element={<RedireccionViejaPanel />} />
          <Route path="/servicios/publicacion-automatica/configurar" element={<RedireccionPanelAnterior />} />
        </Routes>
        <FooterServicio />
        <WhatsAppFlotante />
      </div>
    </>
  );
};
const App = () => (<HelmetProvider><BrowserRouter><ContenidoApp /></BrowserRouter></HelmetProvider>);
export default App;
