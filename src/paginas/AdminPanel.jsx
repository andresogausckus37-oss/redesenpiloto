import { useState } from "react";
const CORREO_PRUEBA = "andresogausckus37@gmail.com";
export default function AdminPanel() {
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const resetear = async () => {
    setCargando(true); setError(""); setResultado(null);
    try {
      const vista = await fetch("/api/admin/servicios/publicaciones/reset-pruebas", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: CORREO_PRUEBA, vistaPrevia: true }),
      }).then(r => r.json());
      if (!vista.ok) throw new Error(vista.error || "No se pudo consultar.");
      const total = Object.values(vista.conteo || {}).reduce((a, b) => a + b, 0);
      if (total === 0) { setResultado({ mensaje: "No hay nada para borrar de la prueba." }); return; }
      const confirmar = window.prompt(`Se van a borrar ${total} documentos de la prueba (${vista.pedidoIds.length} pedidos). Escribi BORRAR TODO para confirmar.`);
      if (confirmar !== "BORRAR TODO") return;
      const res = await fetch("/api/admin/servicios/publicaciones/reset-pruebas", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: CORREO_PRUEBA, confirmar: "BORRAR TODO" }),
      }).then(r => r.json());
      if (!res.ok) throw new Error(res.error || "No se pudo resetear.");
      setResultado({ mensaje: "Prueba borrada. Podes registrar de nuevo con el mismo correo.", borrados: res.borrados });
    } catch (e) { setError(e.message || "No se pudo resetear."); }
    finally { setCargando(false); }
  };
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 20 }}>
      <h1>Panel admin</h1>
      <p>Seccion momentanea para pruebas. Mas adelante aca van clientes y cuentas.</p>
      <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h2>Resetear prueba</h2>
        <p>Borra solo todo lo del correo de prueba: <strong>{CORREO_PRUEBA}</strong>. Nunca borra otro cliente.</p>
        <button type="button" onClick={resetear} disabled={cargando}>
          {cargando ? "Reseteando..." : "Resetear prueba"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {resultado && <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(resultado, null, 2)}</pre>}
      </section>
    </div>
  );
}
