
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, CloudUpload,
  FileImage, Film, Heart, Images, Mail, MessageCircle,
  MoreHorizontal, Send, ShieldCheck, ThumbsUp, Trash2, UserRound, UserRoundPlus, X,
  Zap, Clock, TrendingUp, Sparkles, Lock
} from "lucide-react";

const RUTA_BASE = "/publicacion-automatica";
const RUTA_PANEL = `${RUTA_BASE}/mi-panel`;
const API_SOLICITAR_CODIGO = "/api/servicios/clientes/acceso/solicitar";
const API_VERIFICAR_CODIGO = "/api/servicios/clientes/acceso/verificar";

function cargarMontserrat() {
  const id = "comunidad-semanal-fuente-montserrat";
  if (document.getElementById(id)) return;
  const fuente = document.createElement("link");
  fuente.id = id; fuente.rel = "stylesheet";
  fuente.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap";
  document.head.appendChild(fuente);
}

const LOGOS = {
  instagram: "https://i.postimg.cc/1tGRTnck/3840px-Instagram-logo-2022-svg.png",
  facebook: "https://i.postimg.cc/rshTXS0k/Logo-de-Facebook.png",
};

const CAMPO = "w-full rounded-sm border border-borde bg-white px-3.5 py-2.5 text-sm font-normal text-tinta outline-none transition-all focus:border-azul focus:ring-2 focus:ring-azul-super-claro placeholder:text-tinta-apagado/60";
const CAJA = "rounded-sm border border-borde bg-white p-4 sm:p-5 shadow-fintech";
const BOTON = "inline-flex min-h-10 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60";
const PAISES_REGISTRO = [
  "Argentina", "Belice", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
  "Cuba", "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala",
  "Haití", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú",
  "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela",
].sort((a, b) => a.localeCompare(b, "es"));

// === TURNSTILE MANUAL CHECK ===
function VerificacionManual({ sitekey, onToken, revision, habilitado }) {
  const ref = useRef(null);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  const [mostrarWidget, setMostrarWidget] = useState(false);
  const [checkManual, setCheckManual] = useState(false);

  useEffect(() => {
    if (!checkManual) {
      setMostrarWidget(false);
      onToken("");
      return;
    }
    if (!sitekey || !ref.current || !habilitado) return undefined;
    setError("");
    let montado = true, widget = null;
    const pintar = () => {
      if (!montado || !window.turnstile || !ref.current || widget !== null) return;
      try {
        widget = window.turnstile.render(ref.current, {
          sitekey,
          callback: token => { if (montado) { setError(""); onToken(token); } },
          "expired-callback": () => { if (montado) onToken(""); },
          "error-callback": () => { if (montado) { onToken(""); setError("No fue posible conectar con la verificación. Reintenta."); } },
        });
      } catch { setError("No se pudo mostrar la verificación. Reintenta."); }
    };
    let script = document.getElementById("turnstile-comunidad-registro");
    if (!script) {
      script = document.createElement("script"); script.id = "turnstile-comunidad-registro";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true; script.defer = true; document.head.appendChild(script);
    }
    const alErrorScript = () => { if (montado) setError("No se pudo cargar la verificación. Revisá tu conexión."); };
    script.addEventListener("error", alErrorScript);
    if (window.turnstile) pintar(); else script.addEventListener("load", pintar);
    return () => {
      montado = false; script.removeEventListener("load", pintar); script.removeEventListener("error", alErrorScript);
      if (widget !== null && window.turnstile) try { window.turnstile.remove(widget); } catch {}
    };
  }, [sitekey, onToken, revision, intento, checkManual, habilitado, mostrarWidget]);

  useEffect(() => {
    if (checkManual && habilitado) {
      // Pequeño delay para asegurar que el DOM del widget exista
      const t = setTimeout(() => setMostrarWidget(true), 100);
      return () => clearTimeout(t);
    }
  }, [checkManual, habilitado]);

  return (
    <div className="space-y-3 rounded-sm border border-borde bg-crema-suave p-3">
      <label className={`flex cursor-pointer items-start gap-2.5 ${!habilitado ? "opacity-50" : ""}`}>
        <input
          type="checkbox"
          disabled={!habilitado}
          checked={checkManual}
          onChange={(e) => {
            const v = e.target.checked;
            setCheckManual(v);
            if (!v) { setMostrarWidget(false); onToken(""); setError(""); }
          }}
          className="mt-0.5 h-4 w-4 rounded-sm border-borde text-azul focus:ring-azul-super-claro"
        />
        <span className="text-xs font-medium leading-4 text-tinta">
          Confirmo que completé el formulario y quiero verificar que no soy un robot
        </span>
      </label>

      {!habilitado && (
        <p className="text-[11px] leading-4 text-tinta-apagado">Completa todos los campos obligatorios para habilitar la verificación.</p>
      )}

      {checkManual && habilitado && (
        <div className="space-y-2 pt-1">
          {!mostrarWidget ? (
            <p className="text-xs text-tinta-suave">Cargando verificación segura...</p>
          ) : sitekey ? (
            <div className="rounded-sm bg-white p-2">
              <div ref={ref} aria-label="Verificación Cloudflare" />
            </div>
          ) : (
            <p className="text-xs text-amber-700">Cargando verificación...</p>
          )}
          {error && (
            <div className="space-y-2">
              <p className="text-xs text-red-700" role="alert">{error}</p>
              <button type="button" onClick={() => { setError(""); setIntento(i => i + 1); }}
                className="rounded-sm border border-borde bg-white px-3 py-1 text-xs font-medium text-tinta-suave transition hover:bg-slate-50">Reintentar verificación</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TIPOS = {
  imagen: { nombre: "Imagen", icono: FileImage, formatos: ["4:5", "1:1"] },
  carrusel: { nombre: "Carrusel", icono: Images, formatos: ["4:5", "1:1"] },
  reel: { nombre: "Reel", icono: Film, formatos: ["9:16"] },
};

function crearDemostracion() {
  return Array.from({ length: 4 }, (_, indice) => ({
    id: `contenido-${indice + 1}`,
    tipo: indice === 0 || indice === 3 ? "reel" : indice === 1 ? "carrusel" : "imagen",
    formato: indice === 0 || indice === 3 ? "9:16" : "4:5",
    copy: "",
    ctaInstagram: "",
    ctaFacebook: "",
    urlFacebook: "",
    hashtags: "",
    archivos: [],
  }));
}

function LogoRed({ red, size = 24 }) {
  return (
    <img src={LOGOS[red]} alt={red === "instagram" ? "Instagram" : "Facebook"} loading="lazy" width={size} height={size} className="shrink-0 object-contain" style={{ width: size, height: size }} />
  );
}

function Campo({ etiqueta, children, nota }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-tinta">{etiqueta}</span>
      {children}
      {nota && <span className="mt-1.5 block text-[11px] font-normal leading-4 text-tinta-apagado">{nota}</span>}
    </label>
  );
}

export default function LandingPublicaciones() {
  const location = useLocation();
  useEffect(() => { cargarMontserrat(); }, []);
  const navigate = useNavigate();
  const [redes, setRedes] = useState(["instagram", "facebook"]);
  const [vistaRed, setVistaRed] = useState("instagram");
  const [contenidos, setContenidos] = useState(crearDemostracion);
  const [seleccion, setSeleccion] = useState(0);
  const [imagenActual, setImagenActual] = useState(0);
  const [negocio, setNegocio] = useState("");
  const [mensajeArchivo, setMensajeArchivo] = useState("");
  const [modalRegistro, setModalRegistro] = useState(false);
  const [email, setEmail] = useState("");
  const [repetirEmail, setRepetirEmail] = useState("");
  const [nombreRegistro, setNombreRegistro] = useState("");
  const [emprendimientoRegistro, setEmprendimientoRegistro] = useState("");
  const [whatsappRegistro, setWhatsappRegistro] = useState("");
  const [paisRegistro, setPaisRegistro] = useState("Argentina");
  const [webRegistro, setWebRegistro] = useState("");
  const [modoAcceso, setModoAcceso] = useState("registro");
  const [turnstileKey, setTurnstileKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileRevision, setTurnstileRevision] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [pasoRegistro, setPasoRegistro] = useState("email");
  const [errorRegistro, setErrorRegistro] = useState("");
  const [esperandoRegistro, setEsperandoRegistro] = useState(false);
  const urlsTemporales = useRef(new Set());

  useEffect(() => () => {
    for (const url of urlsTemporales.current) URL.revokeObjectURL(url);
    urlsTemporales.current.clear();
  }, []);

  if (location.hash.startsWith("#pedido=")) {
    return <Navigate replace to={{ pathname: RUTA_PANEL, hash: location.hash }} />;
  }

  const contenido = contenidos[seleccion];
  const redVisible = redes.includes(vistaRed) ? vistaRed : redes[0];
  const media = contenido.archivos[imagenActual] || contenido.archivos[0];
  const nombreVisible = negocio.trim() || "Tu emprendimiento";
  const usuarioVisible = nombreVisible.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "tu_emprendimiento";

  function actualizarContenido(cambios) {
    setContenidos((actuales) => actuales.map((item, i) => i === seleccion ? { ...item, ...cambios } : item));
  }
  function revocar(archivos) {
    archivos.forEach(({ url }) => { URL.revokeObjectURL(url); urlsTemporales.current.delete(url); });
  }
  function cambiarTipo(tipo) {
    if (tipo === contenido.tipo) return;
    revocar(contenido.archivos);
    actualizarContenido({ tipo, formato: TIPOS[tipo].formatos[0], archivos: [] });
    setImagenActual(0); setMensajeArchivo("");
  }
  function alternarRed(red) {
    if (redes.includes(red)) {
      if (redes.length === 1) return;
      const nuevas = redes.filter((r) => r !== red);
      setRedes(nuevas);
      if (vistaRed === red) setVistaRed(nuevas[0]);
    } else {
      setRedes((actuales) => ["instagram", "facebook"].filter((r) => r === red || actuales.includes(r)));
      setVistaRed(red);
    }
  }
  function elegirArchivo(evento) {
    const candidatos = Array.from(evento.target.files || []);
    evento.target.value = "";
    if (!candidatos.length) return;
    const esReel = contenido.tipo === "reel";
    const validos = candidatos.filter((archivo) => {
      const tipoValido = esReel ? archivo.type === "video/mp4" || /\.mp4$/i.test(archivo.name) : ["image/jpeg", "image/png", "image/webp"].includes(archivo.type);
      return tipoValido && archivo.size > 0 && archivo.size <= (esReel ? 150 : 20) * 1024 * 1024;
    });
    setMensajeArchivo(validos.length !== candidatos.length ? esReel ? "Seleccioná videos MP4 de hasta 150 MB." : "Seleccioná imágenes JPG, PNG o WebP de hasta 20 MB." : "");
    if (!validos.length) return;
    const esCarrusel = contenido.tipo === "carrusel";
    const anteriores = esCarrusel ? contenido.archivos : [];
    const disponibles = (esCarrusel ? 10 : 1) - anteriores.length;
    if (!disponibles) { setMensajeArchivo("El carrusel admite diez imágenes como máximo."); return; }
    if (esCarrusel && validos.length > disponibles) setMensajeArchivo("Se permiten hasta diez imágenes por carrusel.");
    const nuevos = validos.slice(0, disponibles).map((archivo) => {
      const url = URL.createObjectURL(archivo);
      urlsTemporales.current.add(url);
      return { url, nombre: archivo.name };
    });
    if (!esCarrusel) revocar(contenido.archivos);
    actualizarContenido({ archivos: [...anteriores, ...nuevos] });
    setImagenActual(0);
  }
  function quitarArchivo(indice) {
    const archivo = contenido.archivos[indice];
    if (!archivo) return;
    revocar([archivo]);
    actualizarContenido({ archivos: contenido.archivos.filter((_, i) => i !== indice) });
    setImagenActual(0);
  }
  function abrirRegistro(modo = "registro") {
    setErrorRegistro(""); setCodigo(""); setPasoRegistro("email"); setModoAcceso(modo); setTurnstileToken(""); setModalRegistro(true);
  }
  useEffect(() => {
    const modoSolicitado = new URLSearchParams(location.search).get("acceso");
    if (modoSolicitado === "ingreso" || modoSolicitado === "registro") abrirRegistro(modoSolicitado);
  }, [location.search]);
  useEffect(() => {
    if (location.state?.scrollTo === "precios") {
      requestAnimationFrame(() => document.getElementById("precios")?.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.state]);

  const formularioCompleto =
    modoAcceso === "registro" &&
    nombreRegistro.trim().length >= 2 &&
    emprendimientoRegistro.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    email.trim() === repetirEmail.trim() &&
    /^\+?[0-9]{8,17}$/.test(whatsappRegistro.trim());

  // Fetch turnstile key solo cuando el usuario activa el check manual
  useEffect(() => {
    if (!modalRegistro || modoAcceso !== "registro" || turnstileKey) return;
    // Precarga lazy cuando abre modal, no bloquea
    let vivo = true;
    fetch("/api/servicios/publicaciones/plan", { credentials: "same-origin", cache: "no-store" })
      .then(r => r.json()).then(d => { if (vivo) setTurnstileKey(d.turnstileSiteKey || ""); })
      .catch(() => { if (vivo) setTurnstileKey(""); });
    return () => { vivo = false; };
  }, [modalRegistro, modoAcceso, turnstileKey]);

  const perfilRegistro = () => ({
    nombre: nombreRegistro.trim(), emprendimiento: emprendimientoRegistro.trim(), whatsapp: whatsappRegistro.trim(),
    pais: paisRegistro, web: webRegistro.trim(),
  });

  async function enviarCodigo(evento) {
    evento.preventDefault();
    const correo = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { setErrorRegistro("Ingresa un correo electrónico válido."); return; }
    if (modoAcceso === "registro") {
      if (correo !== repetirEmail.trim().toLowerCase()) { setErrorRegistro("Los correos no coinciden."); return; }
      if (nombreRegistro.trim().length < 2 || !emprendimientoRegistro.trim() || emprendimientoRegistro.trim().length > 120 || !/^\+?[0-9]{8,17}$/.test(whatsappRegistro.trim()) ||
          !PAISES_REGISTRO.includes(paisRegistro) || webRegistro.trim().length > 300) {
        setErrorRegistro("Completa tu nombre, emprendimiento, WhatsApp y país correctamente."); return;
      }
      if (!turnstileToken) { setErrorRegistro("Marcá el check de verificación y completá el desafío de seguridad."); return; }
    }
    setEsperandoRegistro(true); setErrorRegistro("");
    try {
      const respuesta = await fetch(API_SOLICITAR_CODIGO, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "same-origin", cache: "no-store",
        body: JSON.stringify({ email: correo, modo: modoAcceso,
          ...(modoAcceso === "registro" ? { perfil: perfilRegistro(), turnstileToken } : {}) }),
      });
      const tipoRespuesta = respuesta.headers.get("content-type") || "";
      if (!tipoRespuesta.includes("application/json")) throw new Error(`La API devolvió una página (HTTP ${respuesta.status}).`);
      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || datos.ok !== true) throw new Error(datos.error || `No fue posible enviar el código (HTTP ${respuesta.status}).`);
      setEmail(correo); setPasoRegistro("codigo"); setCodigo("");
    } catch (error) {
      setErrorRegistro(error.message || "No fue posible enviar el código.");
      if (modoAcceso === "registro") { setTurnstileToken(""); setTurnstileRevision(v => v + 1); }
    } finally { setEsperandoRegistro(false); }
  }

  async function verificarCodigo(evento) {
    evento.preventDefault();
    if (!/^\d{6}$/.test(codigo)) { setErrorRegistro("Ingresa los seis dígitos."); return; }
    setEsperandoRegistro(true); setErrorRegistro("");
    try {
      const respuesta = await fetch(API_VERIFICAR_CODIGO, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "same-origin", cache: "no-store",
        body: JSON.stringify({ email, codigo, modo: modoAcceso, ...(modoAcceso === "registro" ? { perfil: perfilRegistro() } : {}) }),
      });
      const tipo = respuesta.headers.get("content-type") || "";
      if (!tipo.includes("application/json")) throw new Error(`El servidor devolvió una página (HTTP ${respuesta.status}).`);
      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || datos.ok !== true) throw new Error(datos.error || `No se pudo verificar el código (HTTP ${respuesta.status}).`);
      setModalRegistro(false); navigate(RUTA_PANEL);
    } catch (error) {
      setErrorRegistro(error.message || "No se pudo verificar el código.");
    } finally { setEsperandoRegistro(false); }
  }

  const textoVistaPrevia = (
    <div className="px-3 py-3">
      <p className="whitespace-pre-wrap break-words text-sm font-normal leading-5 text-tinta-suave">
        {contenido.copy.trim() || "Acá vas a ver la idea de tu publicación."}
      </p>
      {(redVisible === "instagram" ? contenido.ctaInstagram : contenido.ctaFacebook).trim() && (
        <p className="mt-2 text-sm font-medium text-tinta">{redVisible === "instagram" ? contenido.ctaInstagram : contenido.ctaFacebook}</p>
      )}
      {redVisible === "facebook" && contenido.urlFacebook.trim() && (
        <p className="mt-1 break-all text-sm text-azul underline underline-offset-2">{contenido.urlFacebook}</p>
      )}
      {contenido.hashtags.trim() && <p className="mt-2 break-words text-sm text-azul">{contenido.hashtags}</p>}
    </div>
  );

  function botonesAcceso(variante = "default") {
    if (variante === "hero") {
      return <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => abrirRegistro("registro")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-azul px-7 py-3 text-sm font-medium text-white shadow-boton-azul transition-all hover:bg-azul-hover hover:-translate-y-px">
          <Sparkles size={16} /> Probar 7 días gratis <ArrowRight size={16} />
        </button>
        <button type="button" onClick={() => abrirRegistro("ingreso")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-borde bg-white px-6 py-3 text-sm font-medium text-tinta transition hover:bg-slate-50">
          <UserRound size={16} /> Iniciar sesión
        </button>
      </div>;
    }
    return <div className="flex flex-wrap items-center gap-2.5">
      <button type="button" onClick={() => abrirRegistro("registro")} className={`${BOTON} bg-azul text-white shadow-boton-azul hover:bg-azul-hover hover:-translate-y-px`}>
        <UserRoundPlus size={15} /> Registrarme
      </button>
      <button type="button" onClick={() => abrirRegistro("ingreso")} className={`${BOTON} border border-borde bg-white text-tinta hover:bg-slate-50`}>
        <UserRound size={15} /> Iniciar sesión
      </button>
    </div>;
  }

  return (
    <main className="min-h-screen bg-crema pb-20 font-normal text-tinta" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui, sans-serif' }}>
      {/* HERO PREMIUM FINTECH */}
      <section className="relative overflow-hidden border-b border-borde bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-azul-super-claro/60 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-azul-claro bg-azul-super-claro px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <LogoRed red="instagram" size={16} />
                  <LogoRed red="facebook" size={16} />
                </div>
                <span className="text-[11px] font-medium tracking-wide text-azul">HECHO PARA ARGENTINA Y LATAM · AUTOMATIZACIÓN REAL</span>
              </div>

              <h1 className="max-w-3xl text-[32px] font-medium leading-[1.1] tracking-tight sm:text-[46px]">
                Transforma <span className="text-azul">20 minutos</span> en 7 días de contenido que vende solo
              </h1>

              <div className="mt-6 max-w-2xl space-y-4 text-[15px] font-normal leading-7 text-tinta-suave">
                <p className="text-[16px] leading-7 text-tinta">Deja de perder horas publicando manualmente. <strong className="font-medium text-tinta">Programa toda tu semana en una sola sesión</strong> y deja que nuestro sistema publique automáticamente en Facebook e Instagram mientras te enfocas en vender.</p>
                <p className="mt-3 rounded-sm border border-azul-claro bg-azul-super-claro px-3 py-2.5 text-[14px] font-medium leading-6 text-azul">🌙 Tu contenido trabajando mientras duermes: configura hoy en 20 minutos y tu marca sigue activa toda la semana, incluso cuando cierras tu negocio. Presencia constante que genera confianza y ventas sin que tengas que estar conectado.</p>
                <p className="mt-2 text-[14px] leading-6 text-tinta-suave">Ideal para emprendedores, comercios y pymes de Argentina y toda LATAM que necesitan presencia constante sin contratar agencia.</p>
                <div className="grid gap-2 pt-1 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm"><div className="flex h-6 w-6 items-center justify-center rounded-sm bg-exito-bg"><Check size={14} className="text-exito" /></div> Sin apps complicadas</div>
                  <div className="flex items-center gap-2 text-sm"><div className="flex h-6 w-6 items-center justify-center rounded-sm bg-exito-bg"><Check size={14} className="text-exito" /></div> Sin curva de aprendizaje</div>
                  <div className="flex items-center gap-2 text-sm"><div className="flex h-6 w-6 items-center justify-center rounded-sm bg-exito-bg"><Check size={14} className="text-exito" /></div> Imágenes, carruseles y Reels</div>
                  <div className="flex items-center gap-2 text-sm"><div className="flex h-6 w-6 items-center justify-center rounded-sm bg-exito-bg"><Check size={14} className="text-exito" /></div> Vista previa real</div>
                  <div className="flex items-center gap-2 text-sm"><div className="flex h-6 w-6 items-center justify-center rounded-sm bg-exito-bg"><Check size={14} className="text-exito" /></div> Soporte 100% humano, sin bots que no entienden tu problema</div>
                </div>
              </div>

              <div className="mt-8">
                {botonesAcceso("hero")}
                <p className="mt-3 flex items-center gap-1.5 text-xs text-tinta-apagado"><ShieldCheck size={14} className="text-exito" /> Prueba gratuita de 7 días · Sin tarjeta · Sin compromiso</p>
              </div>
            </div>

            {/* CARD PRUEBA GRATUITA RESALTADA - FINTECH PREMIUM */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-sm bg-gradient-to-br from-azul-claro to-azul-super-claro opacity-60 blur-[20px]" />
              <div className="relative rounded-sm border-2 border-azul bg-white p-6 shadow-[0_12px_40px_rgba(29,78,216,0.12)] sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-azul px-2.5 py-1 text-[11px] font-medium tracking-wide text-white"><Zap size={12} /> PRUEBA GRATUITA DESTACADA</span>
                  <span className="text-xs font-medium text-exito">● Activo ahora</span>
                </div>
                <h3 className="text-lg font-medium leading-tight">Tus primeros 7 días, completamente gratis</h3>
                <p className="mt-2 text-sm leading-6 text-tinta-suave">Publica hasta <strong className="font-medium text-tinta">4 contenidos</strong> por red. Si usas Facebook e Instagram, son <strong className="font-medium text-tinta">8 publicaciones automáticas</strong> sin costo.</p>
                
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-sm border border-borde bg-crema-suave px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white shadow-sm"><Clock size={16} className="text-azul" /></div>
                    <div><p className="text-xs font-medium">Ahorro promedio estimado</p><p className="text-sm font-medium text-azul">+5 horas por semana</p><p className="text-[10px] text-tinta-apagado">Cálculo basado en crear, editar y publicar 8 contenidos manualmente (40 min c/u)</p></div>
                  </div>
                  <div className="flex items-center gap-3 rounded-sm border border-borde bg-crema-suave px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white shadow-sm"><TrendingUp size={16} className="text-exito" /></div>
                    <div><p className="text-xs font-medium">Presencia constante</p><p className="text-sm font-medium text-tinta">Sin olvidar ninguna publicación</p></div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button type="button" onClick={() => abrirRegistro("registro")} className="flex-1 rounded-sm bg-azul py-3 text-sm font-medium text-white shadow-boton-azul hover:bg-azul-hover">Activar prueba gratis</button>
                </div>
                <p className="mt-3 text-center text-[11px] leading-4 text-tinta-apagado">No pedimos tarjeta. Cancela cuando quieras desde tu panel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCION CONFIGURADOR */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 bg-crema">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-sm bg-white border border-borde px-2.5 py-1 text-[11px] font-medium tracking-wide text-tinta-suave"><Sparkles size={12} /> SIMULADOR INTERACTIVO</div>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Diseña tu semana en minutos, visualiza como tu cliente</h2>
            <p className="mt-3 text-sm leading-6 text-tinta-suave sm:text-[15px]">Pensado para emprendedores, comercios y pymes de Argentina y toda LATAM. Sube tu material, elige el formato y mira al instante cómo se verá en Instagram y Facebook. El mismo flujo que usarás en tu panel privado.</p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:gap-8">
            <div className={`${CAJA} p-5 sm:p-6`}>
              <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-borde pb-4">
                <span className="mr-2 text-xs font-medium text-tinta-suave">REDES:</span>
                {["instagram", "facebook"].map((red) => (
                  <button key={red} type="button" onClick={() => alternarRed(red)} className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium transition ${redes.includes(red) ? "border-azul bg-azul-super-claro text-azul" : "border-borde bg-white text-tinta-suave hover:bg-slate-50"}`}>
                    <LogoRed red={red} size={16} /> {red === "instagram" ? "Instagram" : "Facebook"} {redes.includes(red) && <Check size={12} />}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex gap-1 rounded-sm bg-crema p-1">
                {contenidos.map((_, i) => (
                  <button key={i} type="button" onClick={() => { setSeleccion(i); setImagenActual(0); }} className={`flex-1 rounded-sm px-2 py-1.5 text-xs font-medium transition ${seleccion === i ? "bg-white text-tinta shadow-sm border border-borde" : "text-tinta-suave hover:text-tinta"}`}>Contenido {i + 1}</button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(TIPOS).map(([clave, info]) => (
                    <button key={clave} type="button" onClick={() => cambiarTipo(clave)} className={`flex flex-col items-center gap-1.5 rounded-sm border px-2 py-3 text-xs font-medium transition ${contenido.tipo === clave ? "border-azul bg-azul-super-claro text-azul" : "border-borde bg-white text-tinta-suave hover:border-slate-300"}`}>
                      <info.icono size={18} /> {info.nombre}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-tinta">Formato</label>
                  <div className="flex gap-2">
                    {TIPOS[contenido.tipo].formatos.map((fmt) => (
                      <button key={fmt} type="button" onClick={() => actualizarContenido({ formato: fmt })} className={`rounded-sm border px-3 py-1.5 text-xs font-medium ${contenido.formato === fmt ? "border-azul bg-azul text-white" : "border-borde bg-white text-tinta-suave"}`}>{fmt}</button>
                    ))}
                  </div>
                </div>

                <Campo etiqueta="Nombre de tu emprendimiento (para la vista previa)">
                  <input className={CAMPO} value={negocio} onChange={(e) => setNegocio(e.target.value)} placeholder="Ej.: Café Central" maxLength={60} />
                </Campo>

                <div className="rounded-sm border border-dashed border-borde bg-crema-suave/60 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium">Archivos {contenido.tipo === "carrusel" ? `(${contenido.archivos.length}/10)` : "(1 máximo)"}</span>
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-azul px-3 py-1.5 text-xs font-medium text-white hover:bg-azul-hover">
                      <CloudUpload size={14} /> Subir <input type="file" className="hidden" accept={contenido.tipo === "reel" ? "video/mp4" : "image/jpeg,image/png,image/webp"} multiple={contenido.tipo === "carrusel"} onChange={elegirArchivo} />
                    </label>
                  </div>
                  {contenido.archivos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {contenido.archivos.map((a, idx) => (
                        <div key={idx} className="group relative rounded-sm border border-borde bg-white p-1">
                          <img src={a.url} alt={a.nombre} className="h-12 w-12 object-cover rounded-sm" />
                          <button type="button" onClick={() => quitarArchivo(idx)} className="absolute -right-1 -top-1 rounded-full bg-red-600 p-1 text-white"><Trash2 size={10} /></button>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-tinta-apagado">Sin archivos aún.</p>}
                  {mensajeArchivo && <p className="mt-2 text-xs text-amber-700">{mensajeArchivo}</p>}
                </div>

                <Campo etiqueta="Copy o texto de la publicación">
                  <textarea className={CAMPO} rows={3} maxLength={1500} value={contenido.copy} onChange={(e) => actualizarContenido({ copy: e.target.value })} placeholder="Escribí el texto que acompañará tu publicación... Usa un tono cercano y claro." />
                </Campo>

                <details className="rounded-sm border border-borde bg-white p-3 open:shadow-sm">
                  <summary className="cursor-pointer text-xs font-medium text-tinta">CTA, URL y hashtags (opcionales) — mejora tu conversión</summary>
                  <div className="mt-3 space-y-3">
                    {redes.includes("instagram") && <Campo etiqueta="CTA para Instagram"><input className={`${CAMPO} h-9`} maxLength={100} value={contenido.ctaInstagram} onChange={(e) => actualizarContenido({ ctaInstagram: e.target.value })} placeholder="Enlace en nuestra bio →" /></Campo>}
                    {redes.includes("facebook") && <>
                      <Campo etiqueta="CTA para Facebook"><input className={`${CAMPO} h-9`} maxLength={100} value={contenido.ctaFacebook} onChange={(e) => actualizarContenido({ ctaFacebook: e.target.value })} placeholder="Visitá nuestra tienda online" /></Campo>
                      <Campo etiqueta="URL para Facebook"><input className={`${CAMPO} h-9`} maxLength={500} value={contenido.urlFacebook} onChange={(e) => actualizarContenido({ urlFacebook: e.target.value })} placeholder="ej: www.minegocio.com.ar" /></Campo>
                    </>}
                    <Campo etiqueta="Hashtags estratégicos"><input className={`${CAMPO} h-9`} maxLength={240} value={contenido.hashtags} onChange={(e) => actualizarContenido({ hashtags: e.target.value })} placeholder="ej: #emprendedores #marketing #ventas" /></Campo>
                  </div>
                </details>
              </div>
            </div>

            <aside className={`${CAJA} lg:sticky lg:top-20`} aria-label="Vista previa demostrativa">
              <div className="mb-3 flex items-center justify-between border-b border-borde pb-3">
                <h3 className="text-sm font-medium flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-exito animate-pulse" /> Vista previa en vivo</h3>
                <span className="rounded-sm bg-crema-suave px-2 py-0.5 text-[11px] font-medium text-tinta-apagado">Contenido {seleccion + 1} de 4</span>
              </div>
              <div className="mb-3 flex gap-2" role="group" aria-label="Ver publicación por red">
                {redes.map((red) => (
                  <button key={red} type="button" aria-pressed={redVisible === red} onClick={() => setVistaRed(red)} className={`flex min-h-9 flex-1 items-center justify-center gap-2 rounded-sm border px-2 py-1 text-xs font-medium transition ${redVisible === red ? "border-azul bg-azul-super-claro text-azul" : "border-borde text-tinta-suave"}`}>
                    <LogoRed red={red} size={19} /> {red === "instagram" ? "Instagram" : "Facebook"}
                  </button>
                ))}
              </div>
              <div className="overflow-hidden rounded-sm border border-borde bg-white">
                <div className="flex items-center gap-2 px-3 py-3">
                  <LogoRed red={redVisible} size={27} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-tinta">{redVisible === "instagram" ? usuarioVisible : nombreVisible}</p>
                    <p className="text-[11px] font-normal text-tinta-apagado">{redVisible === "instagram" ? "Publicación de Instagram" : "Página de Facebook · Público"}</p>
                  </div>
                  <MoreHorizontal size={19} className="text-tinta-apagado" />
                </div>
                {redVisible === "facebook" && textoVistaPrevia}
                <div className="bg-crema px-3 py-3">
                  <div className={`relative mx-auto overflow-hidden rounded-sm bg-slate-100 ${contenido.formato === "9:16" ? "w-full max-w-[225px]" : "w-full max-w-[300px]"}`} style={{ aspectRatio: contenido.formato.replace(":", " / ") }}>
                    {media ? (
                      contenido.tipo === "reel" ? <video key={media.url} src={media.url} controls playsInline preload="metadata" className="h-full w-full object-contain" /> : <img src={media.url} alt={`Imagen ${imagenActual + 1}`} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-tinta-apagado">
                        <FileImage size={28} strokeWidth={1.5} />
                        <p className="text-xs leading-5">Elige {contenido.tipo === "reel" ? "un video" : "imágenes"} para ver tu publicación</p>
                      </div>
                    )}
                    {contenido.tipo === "carrusel" && contenido.archivos.length > 1 && <>
                      <button type="button" aria-label="Anterior" onClick={() => setImagenActual((i) => (i - 1 + contenido.archivos.length) % contenido.archivos.length)} className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-sm bg-white/90 p-1.5 text-tinta"><ChevronLeft size={16} /></button>
                      <button type="button" aria-label="Siguiente" onClick={() => setImagenActual((i) => (i + 1) % contenido.archivos.length)} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm bg-white/90 p-1.5 text-tinta"><ChevronRight size={16} /></button>
                      <span className="absolute right-1.5 top-1.5 rounded-sm bg-black/65 px-2 py-1 text-[10px] text-white">{imagenActual + 1}/{contenido.archivos.length}</span>
                    </>}
                  </div>
                </div>
                {redVisible === "instagram" ? (
                  <div className="flex items-center gap-3 px-3 pt-3 text-tinta"><Heart size={19} /><MessageCircle size={19} /><Send size={19} /></div>
                ) : (
                  <div className="flex items-center justify-around border-b border-borde px-3 py-2 text-xs text-tinta-apagado"><span className="inline-flex items-center gap-1"><ThumbsUp size={15} /> Me gusta</span><span className="inline-flex items-center gap-1"><MessageCircle size={15} /> Comentar</span><span className="inline-flex items-center gap-1"><Send size={15} /> Compartir</span></div>
                )}
                {redVisible === "instagram" && textoVistaPrevia}
              </div>
              <p className="mt-2.5 flex items-center gap-1 text-[11px] leading-4 text-tinta-apagado"><ShieldCheck size={12} /> Simulación orientativa, apariencia final puede variar según la red.</p>
            </aside>
          </div>

          {/* PRECIOS - SECCION FINAL MEJORADA USD */}
          <div id="precios" className="scroll-mt-24 mt-14 overflow-hidden rounded-sm border border-borde bg-white shadow-fintech">
            <div className="bg-azul-ink px-6 py-8 text-white sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide"><Lock size={12} /> SIN COBROS AUTOMÁTICOS</div>
                  <h3 className="text-2xl font-medium tracking-tight">Empieza gratis, escala cuando veas resultados</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">7 días de prueba con hasta 8 publicaciones. Después, continúa solo si te genera valor. Planes semanales flexibles, sin ataduras.</p>
                </div>
                <div className="shrink-0 rounded-sm bg-white px-5 py-3 text-center">
                  <p className="text-xs font-medium text-tinta-apagado">PRUEBA GRATIS</p>
                  <p className="text-3xl font-medium text-azul">$0</p>
                  <p className="text-[11px] text-tinta-suave">7 días · 8 posts</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h4 className="text-sm font-medium text-tinta">Planes semanales después de la prueba — precio por 1 semana de servicio</h4>
              <p className="mt-1 text-xs text-tinta-apagado">Precio claro por semana, no mensual. Pagas en pesos argentinos y ves el equivalente en USD. Cancela cuando quieras.</p>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Plan 1 red */}
                <div className="group relative rounded-sm border border-borde bg-crema-suave/50 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-fintech">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-tinta">1 red social · 1 semana</p>
                      <p className="mt-1 text-xs text-tinta-suave">Ideal para emprendedores y comercios que arrancan</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-sm bg-white border border-borde px-2 py-0.5 text-[11px]">Instagram <em className="not-italic text-tinta-apagado">o</em> Facebook</span>
                        <span className="rounded-sm bg-white border border-borde px-2 py-0.5 text-[11px]">4 contenidos por semana</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-medium text-tinta">$6.990<span className="text-xs font-normal"> ARS</span></p>
                      <p className="text-sm font-medium text-azul">USD 4</p>
                      <p className="mt-1 text-[11px] font-medium text-tinta-suave">por 1 semana</p>
                    </div>
                  </div>
                </div>

                {/* Plan 2 redes - RECOMENDADO */}
                <div className="group relative rounded-sm border-2 border-azul bg-white p-5 shadow-[0_8px_24px_rgba(29,78,216,0.08)]">
                  <div className="absolute -top-3 left-5 rounded-sm bg-azul px-2.5 py-1 text-[11px] font-medium text-white">MÁS POPULAR · AHORRA 25%</div>
                  <div className="flex items-start justify-between gap-3 pt-2">
                    <div>
                      <p className="text-sm font-medium text-tinta">2 redes sociales · 1 semana</p>
                      <p className="mt-1 text-xs text-tinta-suave">Recomendado para pymes y comercios de Argentina y LATAM</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-sm bg-azul-super-claro border border-azul-claro px-2 py-0.5 text-[11px] text-azul">Instagram + Facebook</span>
                        <span className="rounded-sm bg-azul-super-claro border border-azul-claro px-2 py-0.5 text-[11px] text-azul">8 publicaciones por semana</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-medium text-tinta">$10.990<span className="text-xs font-normal"> ARS</span></p>
                      <p className="text-sm font-medium text-azul">USD 6</p>
                      <p className="mt-1 text-[11px] font-medium text-tinta-suave">por 1 semana</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-sm bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs leading-5 text-tinta-suave"><ShieldCheck size={14} className="text-exito" /> Precio por 1 semana de servicio, no mensual. Te avisamos antes de que termine tu prueba. Sin cobros automáticos. Pagas en ARS, con referencia en USD para toda LATAM.</p>
                <div className="shrink-0">{botonesAcceso()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCION PROXIMAMENTE - SLIDER LOGOS */}
      <section className="border-y border-borde bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-sm bg-azul-super-claro border border-azul-claro px-2.5 py-1 text-[11px] font-medium tracking-wide text-azul"><Zap size={12} /> PRÓXIMAMENTE</div>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Todas tus redes, en un solo lugar</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-tinta-suave">Ya trabajamos en las próximas integraciones. Conecta una vez y gestiona tu contenido sin cambiar de herramienta. Tú te enfocas en tu negocio, nosotros mantenemos tu presencia activa.</p>
            </div>
            <span className="rounded-sm bg-crema-suave border border-borde px-3 py-1.5 text-xs font-medium text-tinta-suave">Más de 10 plataformas en camino</span>
          </div>

          <div className="relative overflow-hidden rounded-sm border border-borde bg-crema py-6">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-crema to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-crema to-transparent z-10 pointer-events-none" />
            <div className="flex w-max animate-[marquee_35s_linear_infinite] items-center gap-3">
              {[
                { nombre: "Instagram", estado: "YA DISPONIBLE", color: "bg-white border-azul text-azul" },
                { nombre: "Facebook", estado: "YA DISPONIBLE", color: "bg-white border-azul text-azul" },
                { nombre: "Threads", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "TikTok", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "YouTube Shorts", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "Pinterest", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "LinkedIn", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "X (Twitter)", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "Google Negocios", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "Telegram", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "Bluesky", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                // duplicado para loop infinito
                { nombre: "Instagram", estado: "YA DISPONIBLE", color: "bg-white border-azul text-azul" },
                { nombre: "Facebook", estado: "YA DISPONIBLE", color: "bg-white border-azul text-azul" },
                { nombre: "Threads", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "TikTok", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "YouTube Shorts", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "Pinterest", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
                { nombre: "LinkedIn", estado: "PRÓXIMAMENTE", color: "bg-white border-borde text-tinta-suave" },
              ].map((p, i) => (
                <div key={i} className={`flex shrink-0 items-center gap-2 rounded-sm border px-4 py-2.5 shadow-sm ${p.color}`}>
                  <span className="text-xs font-medium">{p.nombre}</span>
                  <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-medium tracking-wide ${p.estado === "YA DISPONIBLE" ? "bg-azul text-white" : "bg-slate-100 text-tinta-apagado"}`}>{p.estado}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>

      {modalRegistro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-3 py-4" onMouseDown={e => { if (e.target === e.currentTarget) setModalRegistro(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="registro-titulo" className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-sm bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-sm bg-azul-super-claro"><Mail size={16} className="text-azul" /></div>
                <h2 id="registro-titulo" className="text-base font-medium">{modoAcceso === "registro" ? "Crea tu cuenta gratis" : "Bienvenido de vuelta"}</h2>
              </div>
              <button type="button" aria-label="Cerrar" onClick={() => setModalRegistro(false)} className="rounded-sm p-1.5 text-tinta-apagado hover:bg-slate-100"><X size={17} /></button>
            </div>

            {pasoRegistro === "email" ? <form onSubmit={enviarCodigo} className="space-y-4">
              {modoAcceso === "registro" && <>
                <Campo etiqueta="Nombre y apellido *"><input className={CAMPO} required autoComplete="name" maxLength={100} placeholder="Ej.: Juan Pérez" value={nombreRegistro} onChange={e => setNombreRegistro(e.target.value)} /></Campo>
                <Campo etiqueta="Nombre del emprendimiento *"><input className={CAMPO} required maxLength={120} autoComplete="organization" value={emprendimientoRegistro} onChange={e => setEmprendimientoRegistro(e.target.value)} placeholder="Ej.: Mi emprendimiento" /></Campo>
              </>}
              <Campo etiqueta="Correo electrónico *"><input className={CAMPO} required type="email" autoComplete="email" maxLength={160} value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" /></Campo>
              {modoAcceso === "registro" && <>
                <Campo etiqueta="Repetir correo electrónico *"><input className={CAMPO} required type="email" autoComplete="email" maxLength={160} value={repetirEmail} onChange={e => setRepetirEmail(e.target.value)} placeholder="tu@email.com" /></Campo>
                <Campo etiqueta="WhatsApp *" nota="Solo números; podés incluir el prefijo internacional +."><input className={CAMPO} required type="tel" inputMode="tel" maxLength={18} value={whatsappRegistro} onChange={e => setWhatsappRegistro(e.target.value.replace(/[^+0-9]/g, "").replace(/(?!^)\+/g, ""))} placeholder="5493511234567" /></Campo>
                <Campo etiqueta="País *"><select className={CAMPO} value={paisRegistro} onChange={e => setPaisRegistro(e.target.value)}>{PAISES_REGISTRO.map(pais => <option key={pais} value={pais}>{pais}</option>)}</select></Campo>
                <Campo etiqueta="Web o enlace principal (opcional)"><input className={CAMPO} type="text" maxLength={300} value={webRegistro} onChange={e => setWebRegistro(e.target.value)} placeholder="tusitio.com" /></Campo>
                
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium"><ShieldCheck size={15} className="text-azul"/> Verificación de seguridad</div>
                  <VerificacionManual sitekey={turnstileKey} onToken={setTurnstileToken} revision={turnstileRevision} habilitado={formularioCompleto} />
                </div>
              </>}
              {errorRegistro && <p role="alert" className="rounded-sm bg-red-50 px-3 py-2 text-xs text-red-700">{errorRegistro}</p>}
              <button type="submit" disabled={esperandoRegistro || (modoAcceso === "registro" && !turnstileToken)} className={`${BOTON} w-full bg-azul text-white shadow-boton-azul hover:bg-azul-hover`}>
                {esperandoRegistro ? "Enviando código..." : modoAcceso === "registro" ? "Crear cuenta y probar gratis" : "Enviar código de acceso"}
              </button>
              <button type="button" className="w-full text-xs font-medium text-tinta-suave underline underline-offset-2" onClick={() => { setErrorRegistro(""); setModoAcceso(v => v === "registro" ? "ingreso" : "registro"); setTurnstileToken(""); }}>
                {modoAcceso === "registro" ? "Ya tengo cuenta · Iniciar sesión" : "Crear una cuenta nueva"}
              </button>
            </form> : <form onSubmit={verificarCodigo} className="space-y-3">
              <p className="text-sm text-tinta-suave">Ingresa el código de seis dígitos enviado a <span className="font-medium text-tinta">{email}</span>.</p>
              <Campo etiqueta="Código de verificación"><input className={`${CAMPO} tracking-widest text-center text-lg`} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" required maxLength={6} value={codigo} onChange={e => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></Campo>
              {errorRegistro && <p role="alert" className="rounded-sm bg-red-50 px-3 py-2 text-xs text-red-700">{errorRegistro}</p>}
              <button type="submit" disabled={esperandoRegistro} className={`${BOTON} w-full bg-azul text-white shadow-boton-azul hover:bg-azul-hover`}>{esperandoRegistro ? "Verificando..." : "Confirmar y entrar a mi panel"}</button>
              <button type="button" onClick={() => { setPasoRegistro("email"); setCodigo(""); setErrorRegistro(""); setTurnstileToken(""); setTurnstileRevision(v => v + 1); }} className="text-xs font-medium text-tinta-suave underline underline-offset-2">Volver</button>
            </form>}
          </div>
        </div>
      )}
    </main>
  );
}
