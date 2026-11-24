import crypto from "node:crypto";
const DB = "andres_imprimibles";
const CORREO_PRUEBA = "andresogausckus37@gmail.com";
const CONFIRMAR = "BORRAR TODO";
function responder(datos, status = 200) {
  return new Response(JSON.stringify(datos), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
export async function ejecutarAdminResetPruebas(request, env, adminAutorizado) {
  if (!adminAutorizado) return responder({ ok: false, error: "No autorizado." }, 401);
  if (request.method !== "POST") return responder({ ok: false, error: "Metodo no permitido." }, 405);
  let cuerpo = {};
  try { cuerpo = await request.json(); } catch { return responder({ ok: false, error: "Cuerpo invalido." }, 400); }
  const correo = String(cuerpo.correo || "").trim().toLowerCase();
  if (correo !== CORREO_PRUEBA) return responder({ ok: false, error: "Solo se puede resetear el correo de prueba." }, 403);
  const soloVista = cuerpo.vistaPrevia === true;
  if (!soloVista && cuerpo.confirmar !== CONFIRMAR) return responder({ ok: false, error: "Escribi BORRAR TODO para confirmar." }, 400);
  if (!env?.MONGODB_URI) return responder({ ok: false, error: "Sin base de datos." }, 503);
  const { MongoClient } = await import("mongodb");
  const mongo = new MongoClient(env.MONGODB_URI);
  try {
    await mongo.connect();
    const db = mongo.db(DB);
    const emailHash = crypto.createHash("sha256").update(correo).digest("hex");
    const usuarioId = `correo:${emailHash}`;
    const cuenta = await db.collection("clientes_usuarios").findOne({ _id: usuarioId }, { projection: { _id: 1, email: 1 } });
    const pedidos = await db.collection("pedidos_servicios").find({ clienteUsuarioId: usuarioId }, { projection: { pedidoId: 1 } }).toArray();
    const pedidoIds = pedidos.map(p => p.pedidoId).filter(Boolean);
    const renovaciones = await db.collection("renovaciones_transferencia_reales").find({ $or: [{ clienteUsuarioId: usuarioId }, { pedidoId: { $in: pedidoIds } }, { email: correo }] }, { projection: { _id: 1 } }).toArray();
    const renovacionIds = renovaciones.map(r => r._id);
    const planes = [
      ["pedidos_servicios", { clienteUsuarioId: usuarioId }],
      ["calendarios_clientes_activos", { $or: [{ _id: { $in: pedidoIds } }, { pedidoId: { $in: pedidoIds } }] }],
      ["solicitudes_programacion_servicios", { $or: [{ clienteUsuarioId: usuarioId }, { pedidoId: { $in: pedidoIds } }] }],
      ["archivos_servicios", { pedidoId: { $in: pedidoIds } }],
      ["cargas_archivos_servicios", { pedidoId: { $in: pedidoIds } }],
      ["conexiones_meta_pedidos", { pedidoId: { $in: pedidoIds } }],
      ["meta_oauth_pedidos", { pedidoId: { $in: pedidoIds } }],
      ["meta_oauth_instagram_pedidos", { pedidoId: { $in: pedidoIds } }],
      ["cuentas_conectadas", { primerCorreo: correo }],
      ["clientes_pruebas_reservas", { $or: [{ _id: `cuenta:${usuarioId}` }, { pedidoId: { $in: pedidoIds } }] }],
      ["renovaciones_transferencia_reales", { $or: [{ clienteUsuarioId: usuarioId }, { pedidoId: { $in: pedidoIds } }, { email: correo }] }],
      ["medios_renovaciones_reales", { renovacionId: { $in: renovacionIds } }],
      ["clientes_sesiones", { usuarioId }],
      ["clientes_codigos", { _id: emailHash }],
      ["clientes_limites", { _id: { $regex: emailHash } }],
      ["clientes_usuarios", { _id: usuarioId }],
    ];
    if (soloVista) {
      const conteo = {};
      for (const [nombre, filtro] of planes) conteo[nombre] = await db.collection(nombre).countDocuments(filtro);
      return responder({ ok: true, vistaPrevia: true, correo, usuarioId, pedidoIds, conteo });
    }
    const borrados = {};
    for (const [nombre, filtro] of planes) {
      const r = await db.collection(nombre).deleteMany(filtro);
      borrados[nombre] = r.deletedCount || 0;
    }
    return responder({ ok: true, correo, usuarioId, pedidoIds, borrados });
  } catch (e) {
    return responder({ ok: false, error: "No se pudo resetear la prueba." }, 503);
  } finally { await mongo.close().catch(() => {}); }
}
