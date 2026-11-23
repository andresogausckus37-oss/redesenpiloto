import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, CloudUpload, FileImage, Film, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

const API = "/api/servicios/publicaciones/archivos";
const TAMANO_PARTE = 6 * 1024 * 1024; // PARCHE R2: mínimo 5MB por parte
const MAX_IMAGEN = 20 * 1024 * 1024;
const MAX_VIDEO = 100 * 1024 * 1024;
const CAJA = "mt-4 rounded-sm border border-borde bg-white p-4";
const CABECERAS_PANEL = { "X-Comunidad-Panel": "1" };

// Sube los archivos reales al bucket privado después de crear la semana.
// Si una subida falla, la semana sigue guardada y el cliente puede reintentar desde el panel.
// Semana 1: reanuda desde los archivos CONFIRMADOS en MongoDB/R2.
// Dos archivos simultáneos como máximo. Nunca crea un segundo pedido.
export async function subirArchivosSemana(pedidoId, contenidos, progreso = () => {}, signal) {
  const solicitar = async (ruta, datos) => leer(await fetch(`${API}/${ruta}`, {
    method: "POST", credentials: "same-origin", cache: "no-store", signal,
    headers: { ...CABECERAS_PANEL, "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }));
  const archivos = contenidos.flatMap(contenido =>
    contenido.archivos.map((archivo, posicion) => ({ contenido, archivo, posicion })));
  if (!archivos.length) throw new Error("No hay archivos para enviar.");

  // Ante una subida parcial o una respuesta perdida, los archivos ya confirmados
  // se omiten. La coincidencia incluye posición, nombre, MIME y tamaño.
  const estado = await leer(await fetch(`${API}/estado?pedidoId=${encodeURIComponent(pedidoId)}`, {
    method: "GET", credentials: "same-origin", cache: "no-store", headers: CABECERAS_PANEL, signal,
  }));
  if (!Array.isArray(estado.archivos)) throw new Error("No se pudo consultar qué archivos recibió el servidor.");
  const pendientes = [];
  const completos = new Set();
  let bytesConfirmados = 0;
  const bytesTotales = archivos.reduce((sum, item) => sum + item.archivo.size, 0);
  for (const item of archivos) {
    const previo = estado.archivos.find(a => a.contenidoId === item.contenido.id && a.posicion === item.posicion);
    if (previo) {
      if (previo.nombre !== item.archivo.name || previo.tipo !== item.archivo.type ||
          Number(previo.tamano) !== item.archivo.size || previo.revision === "rechazado") {
        throw new Error(`El contenido ${item.contenido.id.replace("contenido-", "")} ya tiene otro archivo o una corrección pendiente. Revisalo desde el panel antes de reintentar.`);
      }
      completos.add(`${item.contenido.id}:${item.posicion}`);
      bytesConfirmados += item.archivo.size;
    } else pendientes.push(item);
  }

  let terminados = completos.size;
  let siguiente = 0;
  let primerError = null;
  const confirmadosParciales = new Map();
  const informar = nombre => {
    const parcial = [...confirmadosParciales.values()].reduce((a, b) => a + b, 0);
    const pct = bytesTotales > 0 ? Math.min(100, Math.round((bytesConfirmados + parcial) / bytesTotales * 100)) : 0;
    progreso({ archivo: `${nombre} · ${terminados} de ${archivos.length} completos`,
      completado: terminados, total: archivos.length,
      porcentaje: pct });
  };
  informar("Subiendo archivos");

  async function enviarUno(item) {
    const { contenido, archivo, posicion } = item;
    comprobarArchivo(archivo, contenido.tipo);
    const clave = `${contenido.id}:${posicion}`;
    let sesion;
    try {
      // El agrupamiento acotado del limitador coincide con esta posición real.
      sesion = await solicitar(`iniciar?contenido=${encodeURIComponent(contenido.id)}&pos=${posicion}`, {
        pedidoId, contenidoId: contenido.id, posicion,
        nombre: archivo.name, tipo: archivo.type, tamano: archivo.size,
      });
      if (sesion.tamanoParte !== TAMANO_PARTE) throw new Error("Tamaño de bloques incompatible.");
      for (let numero = 1; numero <= sesion.totalPartes; numero++) {
        const inicio = (numero - 1) * TAMANO_PARTE;
        const fin = Math.min(inicio + TAMANO_PARTE, archivo.size);
        const parte = archivo.slice(inicio, fin);
        await leer(await parteConReintento(`${API}/parte?pedidoId=${encodeURIComponent(pedidoId)}&cargaId=${encodeURIComponent(sesion.cargaId)}&numero=${numero}`, {
          method: "PUT", credentials: "same-origin", cache: "no-store", signal,
          headers: { ...CABECERAS_PANEL, "Content-Type": "application/octet-stream" }, body: parte,
        }));
        confirmadosParciales.set(clave, fin);
        informar(archivo.name);
      }
      await solicitar("finalizar", { pedidoId, cargaId: sesion.cargaId });
      confirmadosParciales.delete(clave);
      completos.add(clave);
      bytesConfirmados += archivo.size;
      terminados++;
      informar(archivo.name);
    } catch (e) {
      confirmadosParciales.delete(clave);
      // Solo cancela sesiones que se iniciaron; no elimina archivos ya guardados.
      if (sesion?.cargaId) {
        await solicitar("cancelar", { pedidoId, cargaId: sesion.cargaId }).catch(() => {});
      }
      throw new Error(`${archivo.name}: ${e.message || "No se pudo completar la subida."}`);
    }
  }

  // FIX 0% trabado: antes si UN archivo fallaba, primerError frenaba a los 2 workers
  // y el progreso quedaba en 0 de 12 para siempre, aunque los demás archivos ya estaban en R2.
  // Ahora cada archivo junta su error y los demás siguen; al final se lanza el primer error
  // pero con el progreso real (terminados/total) ya actualizado.
  const errores = [];
  async function tarea() {
    while (true) {
      const item = pendientes[siguiente++];
      if (!item) return;
      try { await enviarUno(item); }
      catch (e) { errores.push(e); informar(item.archivo.name); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(2, pendientes.length) }, () => tarea()));
  if (errores.length) throw errores[0];
  informar("Archivos confirmados");
  return { completados: terminados };
}

// DIAGNOSTICO_SUBIDA_503_V1: conservar el código de etapa seguro que devuelve la API.
async function leer(respuesta) {
  const tipo = respuesta.headers.get("content-type") || "";
  let data = {};
  if (tipo.includes("application/json")) data = await respuesta.json().catch(() => ({}));
  if (respuesta.ok && data.ok === true) return data;
  const codigo = typeof data.codigo === "string" && /^ARCHIVOS_[A-Z_]+$/.test(data.codigo)
    ? ` · ${data.codigo}` : (tipo.includes("text/html") ? " · respuesta HTML" : "");
  if (respuesta.status === 429) throw new Error(`Límite temporal de solicitudes (HTTP 429). Reintentá en un minuto${codigo}.`);
  if ([502, 503, 504, 520, 522, 524].includes(respuesta.status)) {
    const detalle = typeof data.error === "string" && data.error.length < 250 ? `${data.error} ` : "";
    throw new Error(`${detalle}Error HTTP ${respuesta.status}${codigo}. Podés reintentar en el mismo pedido; los archivos completos se conservan.`);
  }
  throw new Error((typeof data.error === "string" ? data.error : "El servidor no confirmó la operación") + ` (HTTP ${respuesta.status || "sin respuesta"}${codigo}).`);
}

// Se repite solamente PUT /parte, que admite reenviar los mismos bytes y número.
// No se repite /finalizar automáticamente: su resultado podría ser incierto.
async function parteConReintento(url, opciones) {
  for (let intento = 0; intento < 5; intento++) { // PARCHE reintento automático: 5 intentos, no 3
    let respuesta;
    try { respuesta = await fetch(url, opciones); }
    catch (error) {
      if (intento === 4) throw new Error("Falló la conexión mientras se enviaba una parte. Reintentá desde el panel.");
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, intento)));
      continue;
    }
    if ([502, 503, 504].includes(respuesta.status) && intento < 2) {
      await respuesta.body?.cancel().catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, intento)));
      continue;
    }
    return respuesta;
  }
}
function acepta(tipo) { return tipo === "reel" ? ".mp4,video/mp4" : ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"; }
function maximo(tipo) { return tipo === "reel" ? 1 : tipo === "carrusel" ? 10 : 1; }
function nombreTipo(tipo) { return tipo === "reel" ? "Video MP4" : tipo === "carrusel" ? "carrusel" : "Imagen"; }
function comprobarArchivo(archivo, tipo) {
  if (!archivo || archivo.size < 12 || archivo.size > (tipo === "reel" ? MAX_VIDEO : MAX_IMAGEN)) {
    throw new Error(tipo === "reel" ? "El video MP4 no puede superar 100 MB. Exportá en 1080p, hasta 90 segundos." : "Cada imagen no puede superar 20 MB.");
  }
  if (tipo === "reel" && archivo.type !== "video/mp4") throw new Error("Seleccioná un archivo MP4.");
  if (tipo !== "reel" && !["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
    throw new Error("Seleccioná imágenes JPG, PNG o WebP.");
  }
  if (archivo.name.length > 180) throw new Error("El nombre del archivo es demasiado largo.");
}

// Validacion de proporcion en reanudacion: MISMO formato que el original.
  // Si era 4:5, en la edicion sube 4:5. Si era 1:1, sube 1:1. Si era 9:16, sube 9:16.
  // 720x1600 queda bloqueado porque no es ninguno de esos.
  const RATIO_ESPERADO_RESUME = { "1:1": 1, "4:5": 0.8, "9:16": 0.5625 };
  const validarProporcionArchivo = (archivo, contenido) => new Promise((resolver, rechazar) => {
    const tipo = String(contenido.tipo || "").toLowerCase();
    if (tipo === "reel" || (archivo.type || "").startsWith("video/")) return resolver(true);
    if (!(archivo.type || "").startsWith("image/")) return resolver(true);
    const formato = String(contenido.formato || contenido.proporcion || contenido.ratio || (tipo === "reel" ? "9:16" : "4:5"));
    const esperado = RATIO_ESPERADO_RESUME[formato] || 0;
    if (!esperado) return resolver(true);
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(ratio - esperado) > 0.02) {
        rechazar(new Error(`La imagen ${archivo.name} no es ${formato}. Para ${formato} recortala a esa proporción y volvé a subirla. No se subió ningún archivo.`));
      } else resolver(true);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolver(true); };
    img.src = url;
  });
async function validarDuracionVideo(archivo) {
  if (archivo.type !== "video/mp4") return;
  const url = URL.createObjectURL(archivo);
  const duracion = await new Promise((resolver) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => { URL.revokeObjectURL(url); resolver(v.duration || 0); };
    v.onerror = () => { URL.revokeObjectURL(url); resolver(0); };
    v.src = url;
  });
  if (duracion > 90) throw new Error("El video no puede superar 90 segundos. Exportá una versión de hasta 90 segundos en 1080p.");
}
export default function ArchivosPedido({ pedido }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [segundosSubida, setSegundosSubida] = useState(0);
  const intervaloTiempo = useRef(null);
  const [errorPorContenido, setErrorPorContenido] = useState({});
  const [progresoPorArchivo, setProgresoPorArchivo] = useState({}); // PARCHE: progreso debajo de cada archivo, no al final
  const [accion, setAccion] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [revision, setRevision] = useState(0);
  const cancelado = useRef(false);
  const token = pedido?.tokenAcceso;
  const id = pedido?.id;
  const headers = { ...CABECERAS_PANEL, ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setCargando(true);
    const actualizar = () => fetch(`${API}/estado?pedidoId=${encodeURIComponent(id)}`, {
      method:"GET",credentials:"same-origin",cache:"no-store",headers,signal:controller.signal,
    }).then(leer).then(n => { if (!controller.signal.aborted) { setDatos(n); setError(""); } })
      .catch(e => { if (!controller.signal.aborted) { setDatos(null); setError(e.message || "Error consultando contenidos."); } })
      .finally(() => { if (!controller.signal.aborted) setCargando(false); });
    actualizar();
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id,token,revision]);

  function iniciarTemporizador() {
    if (intervaloTiempo.current) clearInterval(intervaloTiempo.current);
    setSegundosSubida(0);
    const inicio = Date.now();
    intervaloTiempo.current = setInterval(() => setSegundosSubida(Math.floor((Date.now() - inicio) / 1000)), 1000);
  }
  function detenerTemporizador() {
    if (intervaloTiempo.current) { clearInterval(intervaloTiempo.current); intervaloTiempo.current = null; }
  }
  function formatoTiempo(s) {
    const m = Math.floor(s / 60); const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  async function recargar() { setRevision(x => x+1); }
  async function post(ruta, body) { return leer(await fetch(`${API}/${ruta}`, { method:"POST",credentials:"same-origin",headers:{...headers,"Content-Type":"application/json"}, body:JSON.stringify(body),cache:"no-store" })); }

  async function cargarArchivos(contenido, elegidos, posicionReemplazo = null) {
    if (!datos?.habilitada || procesando || !elegidos?.length) return;
    setError(""); setAviso(""); setProcesando(true); cancelado.current=false; iniciarTemporizador();
    const propios = datos.archivos.filter(a => a.contenidoId === contenido.id);
    const usados = new Set(propios.map(a => a.posicion));
    try {
      if (contenido.tipo !== "carrusel" && elegidos.length !== 1) throw new Error("Elegí un único archivo.");
      if (posicionReemplazo !== null) {
        const existente = propios.find(a => a.posicion === posicionReemplazo);
        if (!existente || existente.revision !== "rechazado" || elegidos.length !== 1) {
          throw new Error("Solo se puede sustituir un archivo con corrección solicitada.");
        }
      }
      if (contenido.tipo === "carrusel" && posicionReemplazo === null && elegidos.length > maximo(contenido.tipo)-usados.size) throw new Error("El carrusel admite hasta 10 imágenes.");
      for (const archivo of elegidos) {
        comprobarArchivo(archivo,contenido.tipo);
        await validarProporcionArchivo(archivo, contenido);
      if (contenido.tipo === "reel") await validarDuracionVideo(archivo);
        let posicion;
        if (posicionReemplazo !== null) posicion = posicionReemplazo;
        else if (contenido.tipo === "carrusel") {
          posicion = Array.from({length:10},(_,i)=>i).find(i => !usados.has(i));
        } else posicion = 0;
        if (posicion === undefined) throw new Error("No hay posiciones libres para agregar imágenes.");
        usados.add(posicion);
        const base = { pedidoId:id, contenidoId:contenido.id, posicion };
        let falloEnFinalizar = false;
        setAccion(`Subiendo ${archivo.name}`);
        const sesion = await post("iniciar",{ ...base, nombre:archivo.name, tipo:archivo.type,tamano:archivo.size });
        try {
          const total = sesion.totalPartes;
          if (sesion.tamanoParte !== TAMANO_PARTE) throw new Error("El tamaño de partes no coincide con esta versión.");
          for(let numero=1;numero<=total;numero++) {
            if(cancelado.current) throw new Error("Carga interrumpida.");
            const parte = archivo.slice((numero-1)*TAMANO_PARTE,Math.min(numero*TAMANO_PARTE,archivo.size));
            await leer(await parteConReintento(`${API}/parte?pedidoId=${encodeURIComponent(id)}&cargaId=${encodeURIComponent(sesion.cargaId)}&numero=${numero}`, {
              method:"PUT",credentials:"same-origin",headers:{...headers,"Content-Type":"application/octet-stream"},body:parte,cache:"no-store",
            }));
            setProgreso(Math.round(numero/total*100));
            setProgresoPorArchivo(v => ({ ...v, [`${contenido.id}:${posicion}`]: Math.round(numero/total*100) }));
          }
          let exitoFinalizar = false;
          for (let intentoFin = 0; intentoFin < 3 && !exitoFinalizar; intentoFin++) {
            try { await post("finalizar",{ pedidoId:id,cargaId:sesion.cargaId }); exitoFinalizar = true; }
            catch (eFin) {
              if (intentoFin === 2) { falloEnFinalizar = true; throw eFin; }
              setAccion(`Reintentando automáticamente ${archivo.name} (${intentoFin + 2}/3)...`);
              await new Promise(r => setTimeout(r, 2000 * (intentoFin + 1)));
            }
          }
        } catch(e) {
          if (!falloEnFinalizar) await post("cancelar",{ pedidoId:id,cargaId:sesion.cargaId }).catch(()=>{});
          throw e;
        }
        setProgreso(0);
        setProgresoPorArchivo(v => { const c = { ...v }; delete c[`${contenido.id}:${posicion}`]; return c; });
      }
      setAviso("");
      recargar(); setErrorPorContenido(prev => ({ ...prev, [contenido.id]: null }));
    } catch(e) { setErrorPorContenido(prev => ({ ...prev, [contenido.id]: e.message || "No se pudo subir el archivo." })); }
    finally { setProgreso(0);setAccion("");setProcesando(false); detenerTemporizador(); }
  }

  async function eliminar(contenidoId,posicion) {
    if (!datos?.habilitada || procesando || !window.confirm("¿Eliminar este archivo del pedido?")) return;
    setProcesando(true);setError("");setAviso("");
    try { await post("eliminar",{pedidoId:id,contenidoId,posicion});recargar(); }
    catch(e){setError(e.message||"No se pudo eliminar el archivo.");}
    finally{setProcesando(false);}
  }

  return (
    <section className={CAJA} aria-label="Archivos definitivos de publicaciones">
                  {cargando ? <p className="mt-3 text-xs text-tinta-suave">Consultando el estado de los contenidos...</p> : datos && (
        <>
          {!datos.habilitada && <div className="mt-3 flex gap-2 rounded-sm bg-crema p-3 text-xs leading-5 text-tinta-suave"><ShieldCheck className="shrink-0" size={17} /> La carga está disponible durante la preparación de la prueba o después de confirmar el pago. Se cierra cuando el material queda aprobado.</div>}
          <div className="mt-4 space-y-3">
            {datos.publicaciones.map((contenido, i) => {
              const propios = datos.archivos.filter(a=>a.contenidoId===contenido.id);
              const limite = maximo(contenido.tipo);
              const completo = propios.length >= (contenido.tipo === "carrusel" ? 2 : 1);
              return <div key={contenido.id} className="rounded-sm border border-borde bg-crema p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-tinta">{contenido.tipo === "reel" ? <Film size={16}/> : <FileImage size={16}/>} Contenido {i+1} · {nombreTipo(contenido.tipo) + (() => { const f = String(contenido.formato || contenido.proporcion || contenido.ratio || (contenido.tipo === "reel" ? "9:16" : "4:5")); const m = f.match(/\(([^)]+)\)/); return m ? ` (${m[1]})` : (f.includes(':') ? ` (${f})` : ''); })()}</div>
                  <span className={`text-[11px] font-medium ${completo ? "text-emerald-700" : "text-tinta-apagado"}`}>{propios.length}/{limite} archivos</span>
                {contenido.tipo === "reel" && <p className="mt-2 text-[11px] leading-4 text-tinta-suave"><span className="block">Max. 100 MB</span><span className="block">Max. 90 seg</span><span className="block">Min. 720x1280</span><span className="block">Max. 1080x1920</span><span className="block">(recomendado)</span></p>}
                </div>
                {!!contenido.descripcion && <p className="mt-2 line-clamp-2 text-xs text-tinta-suave">{contenido.descripcion}</p>}
                {propios.map(a => <div key={a.posicion} className="mt-2 rounded-sm bg-white p-2 text-xs">
                  <div className="flex items-center gap-2">
                    {a.revision === "rechazado" ? <XCircle size={15} className="shrink-0 text-red-600" /> : <CheckCircle2 size={15} className={a.revision === "aprobado" ? "shrink-0 text-emerald-600" : "shrink-0 text-terracota"}/>}
                    <span className="min-w-0 flex-1 break-words text-tinta-suave">{a.nombre} · {a.revision === "aprobado" ? "Aprobado técnicamente" : a.revision === "rechazado" ? "Corrección solicitada" : "En revisión"}</span>
                    {datos.habilitada && a.revision !== "aprobado" && <button type="button" disabled={procesando} onClick={()=>eliminar(contenido.id,a.posicion)} className="rounded-sm p-1 text-tinta-suave hover:text-red-700" aria-label={`Eliminar ${a.nombre}`}><Trash2 size={15}/></button>}
                  </div>
                  {a.revision === "rechazado" && <p className="mt-2 rounded-sm bg-amber-50 p-2 leading-5 text-amber-900">Motivo técnico: {a.motivoRevision || "Consultá con Administración el motivo de la corrección."}</p>}
                  {progresoPorArchivo[`${contenido.id}:${a.posicion}`] != null && <div className="mt-2" role="status"><p className="text-xs text-tinta-suave">Subiendo archivos • {a.posicion + 1} de {limite} • {progresoPorArchivo[`${contenido.id}:${a.posicion}`]}%</p><div className="mt-1 h-2 overflow-hidden rounded-sm bg-borde"><div className="h-full rounded-sm bg-terracota transition-all" style={{ width: `${progresoPorArchivo[`${contenido.id}:${a.posicion}`]}%` }} /></div></div>}
                  {datos.habilitada && a.revision === "rechazado" && (
                    <label className="mt-2 block font-medium text-terracota-oscuro">
                      Reemplazar este archivo corregido
                      <input type="file" accept={acepta(contenido.tipo)} disabled={procesando}
                        onChange={e=>{const elegidos=Array.from(e.target.files||[]);e.target.value="";cargarArchivos(contenido,elegidos,a.posicion);}}
                        className="mt-2 block w-full text-xs text-tinta-suave file:mr-2 file:rounded-sm file:border-0 file:bg-terracota-suave file:px-3 file:py-2 file:font-medium file:text-terracota-oscuro disabled:opacity-50" />
                    </label>
                  )}
                </div>)}
                {Object.entries(progresoPorArchivo).filter(([k]) => k.startsWith(`${contenido.id}:`)).filter(([k]) => !propios.some(a => `${contenido.id}:${a.posicion}` === k)).map(([k, pct]) => {
            const pos = Number(k.split(":")[1] || 0);
            return (
              <div key={k} className="mt-2" role="status">
                <p className="text-xs text-tinta-suave">Subiendo archivos • {pos + 1} de {limite} • {pct}%</p>
                <div className="mt-1 h-2 overflow-hidden rounded-sm bg-borde"><div className="h-full rounded-sm bg-terracota transition-all" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
          {datos.habilitada && !propios.some(x => x.revision === "rechazado") && (contenido.tipo === "carrusel" ? propios.length < 10 : propios.length === 0) && (
                  <label className="mt-3 block text-xs font-medium text-terracota-oscuro">
                    Seleccionar archivos
                    <input type="file" accept={acepta(contenido.tipo)} multiple={contenido.tipo === "carrusel"} disabled={procesando}
                      onChange={e=>{const elegidos=Array.from(e.target.files||[]);e.target.value="";cargarArchivos(contenido,elegidos);}}
                      className="mt-2 block w-full text-xs text-tinta-suave file:mr-2 file:rounded-sm file:border-0 file:bg-terracota-suave file:px-3 file:py-2 file:font-medium file:text-terracota-oscuro disabled:opacity-50" />
                  {errorPorContenido[contenido.id] && <p className="mt-2 text-xs text-red-700">{errorPorContenido[contenido.id]}</p>}</label>
                )}
                {contenido.tipo === "carrusel" && <p className="mt-2 text-[11px] text-tinta-apagado">Un carrusel requiere entre 2 y 10 imágenes.</p>}
              </div>;
            })}
          </div>
        </>
      )}
      
      {aviso && <p className="mt-3 text-xs text-emerald-700" role="status">{aviso}</p>}
      <button type="button" disabled={procesando} onClick={recargar} className="mt-3 inline-flex items-center gap-2 rounded-sm border border-borde bg-white px-3 py-2 text-xs font-medium text-tinta-suave disabled:opacity-50"><RefreshCw size={14}/> Actualizar contenidos</button>
    </section>
  );
}
