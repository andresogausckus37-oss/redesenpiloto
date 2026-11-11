import { MessageCircle } from "lucide-react";

// Botón flotante típico abajo a la derecha - aparece en toda la web
// Cambiá el número por tu WhatsApp real: 549 + código + número sin 0 ni 15
const WHATSAPP_URL = "https://wa.me/5493548619293?text=Hola%20Redes%20en%20Piloto%2C%20tengo%20una%20consulta";

export default function WhatsAppFlotante() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition hover:scale-105 hover:brightness-95 active:scale-95"
    >
      <MessageCircle size={28} />
      {/* Punto verde de "en línea" */}
      <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
    </a>
  );
}
