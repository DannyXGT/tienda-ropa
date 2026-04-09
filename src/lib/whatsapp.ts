import type { CartItem } from "@/state/cart";
import { moneyGTQ } from "@/lib/money";

export function buildWhatsAppMessage(args: {
  items: CartItem[];
  subtotal: number;
  customerName: string;
  customerZone: string;
  customerAddress: string;
  notes: string;
}) {
  const { items, subtotal, customerName, customerZone, customerAddress, notes } = args;

  const lines: string[] = [];
  lines.push("Hola 👋 Quiero hacer este pedido:");
  lines.push("");

  items.forEach((it, idx) => {
    lines.push(
      `${idx + 1}) ${it.name} — Color: ${it.colorName} — Talla: ${it.size} — Cant: ${it.qty} — ${moneyGTQ(it.price)} c/u`
    );
  });

  lines.push("");
  lines.push(`Subtotal: ${moneyGTQ(subtotal)}`);
  lines.push("");
  lines.push(`Nombre: ${customerName || "-"}`);
  lines.push(`Zona/Ciudad: ${customerZone || "-"}`);
  lines.push(`Dirección: ${customerAddress || "-"}`);
  if (notes?.trim()) lines.push(`Notas: ${notes.trim()}`);
  lines.push("");
  lines.push("¿Me confirmas disponibilidad y total final, por favor?");

  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneDigitsOnly: string, message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${phoneDigitsOnly}?text=${text}`;
}
