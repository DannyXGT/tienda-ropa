"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart, cartItemKey } from "@/state/cart";
import { moneyGTQ } from "@/lib/money";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_PHONE } from "@/lib/storeConfig";

export default function CartPage() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();

  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const waUrl = useMemo(() => {
    const msg = buildWhatsAppMessage({
      items,
      subtotal,
      customerName: name,
      customerZone: zone,
      customerAddress: address,
      notes,
    });
    return buildWhatsAppUrl(WHATSAPP_PHONE, msg);
  }, [items, subtotal, name, zone, address, notes]);

  const canCheckout = items.length > 0;
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="grid items-start gap-6 lg:gap-8 lg:grid-cols-[1.08fr_.92fr]">
      <section className="revealIn space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:items-end">
          <div>
            <h1 className="text-[2rem] font-semibold tracking-tight">Carrito</h1>
            <p className="mt-1 text-sm text-black/68">
              {itemCount} articulo{itemCount === 1 ? "" : "s"} seleccionado
              {itemCount === 1 ? "" : "s"}.
            </p>
          </div>

          {items.length > 0 ? (
            <button className="btn btn-ghost w-full sm:w-auto" onClick={clear}>
              Vaciar carrito
            </button>
          ) : null}
        </div>

        {!items.length ? (
          <div className="card p-6 text-center sm:p-8">
            <h2 className="displayText text-[1.7rem] font-semibold">Tu carrito esta vacio</h2>
            <p className="mx-auto mt-2 max-w-md text-black/68">
              Agrega un vestido para continuar con tu pedido por WhatsApp.
            </p>
            <Link href="/estilos" className="btn btn-primary mt-5">
              Ver estilos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const key = cartItemKey(item);
              const lineTotal = item.price * item.qty;

              return (
                <article key={key} className="card revealIn p-3.5 sm:p-4 md:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/10 sm:h-28 sm:w-24">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-black/35">
                          Sin foto
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-[1.12rem] font-semibold tracking-tight">
                            {item.name}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#fce7f3] px-2.5 py-1 text-xs font-semibold text-[#9d174d]">
                              Color: {item.colorName}
                            </span>
                            <span className="rounded-full border border-black/12 bg-white px-2.5 py-1 text-xs font-semibold text-black/72">
                              Talla: {item.size}
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-[1.1rem] font-black text-[#be185d]">
                            {moneyGTQ(lineTotal)}
                          </div>
                          <div className="mt-0.5 text-xs text-black/62">{moneyGTQ(item.price)} c/u</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center overflow-hidden rounded-2xl border border-black/12 bg-white">
                          <button
                            className="uiControlButton px-3.5 py-2 text-black/75 hover:bg-black/5"
                            onClick={() => setQty(key, item.qty - 1)}
                          >
                            -
                          </button>
                          <div className="min-w-11 text-center text-sm font-semibold">{item.qty}</div>
                          <button
                            className="uiControlButton px-3.5 py-2 text-black/75 hover:bg-black/5"
                            onClick={() => setQty(key, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="text-sm font-semibold text-black/62 hover:text-black sm:self-center"
                          onClick={() => removeItem(key)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="revealIn revealInDelay1 lg:sticky lg:top-24">
        <div className="card p-5 sm:p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm text-black/68">Subtotal</div>
              <div className="mt-1 text-[1.7rem] font-black tracking-tight text-[#be185d] sm:text-[1.9rem]">
                {moneyGTQ(subtotal)}
              </div>
            </div>

            <div className="rounded-full bg-[#fce7f3] px-3 py-1 text-[11px] font-bold text-[#9d174d] sm:text-xs">
              {itemCount} articulo{itemCount === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-5 grid gap-3.5">
            <label className="block">
              <div className="mb-1 text-sm text-black/72">Nombre</div>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-sm text-black/72">Zona / Ciudad</div>
              <input
                className="input"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="Ej: Zona 11 / Mixco"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-sm text-black/72">Direccion</div>
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Direccion de entrega"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-sm text-black/72">Notas (opcional)</div>
              <textarea
                className="input min-h-24"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: entregar en la tarde / referencia"
              />
            </label>

            <a
              href={canCheckout ? waUrl : "#"}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!canCheckout}
              className={
                canCheckout
                  ? "btn btn-primary w-full"
                  : "btn pointer-events-none w-full bg-black/10 text-black/30"
              }
            >
              Finalizar por WhatsApp
            </a>

            <div className="text-xs text-black/66">
              * Se abrira WhatsApp con tu pedido listo para enviar.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
