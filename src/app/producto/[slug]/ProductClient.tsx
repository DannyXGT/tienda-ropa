"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog.types";
import { moneyGTQ } from "@/lib/money";
import ColorSwatches from "@/components/ColorSwatches";
import SizePicker from "@/components/SizePicker";
import { getPriceForSize, getVisibleSizes } from "@/lib/pricing";
import { useCart } from "@/state/cart";

export default function ProductClient({ product }: { product: Product }) {
  const { addItem, clear } = useCart();
  const router = useRouter();

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [colorId, setColorId] = useState(product.variants[0]?.colorId ?? "");
  const variant = useMemo(
    () => product.variants.find((item) => item.colorId === colorId) ?? product.variants[0],
    [product.variants, colorId]
  );

  const sizes = useMemo(() => (variant ? getVisibleSizes(variant) : []), [variant]);
  const [size, setSize] = useState<string>(sizes[0]?.size ?? "");
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  function onChangeColor(next: string) {
    setColorId(next);
    setImgIdx(0);

    const nextVariant = product.variants.find((item) => item.colorId === next) ?? product.variants[0];
    const nextSizes = nextVariant ? getVisibleSizes(nextVariant) : [];
    setSize(nextSizes[0]?.size ?? "");
  }

  const images = variant?.images ?? [];
  const selectedSize = sizes.find((sizeOption) => sizeOption.size === size) ?? sizes[0] ?? null;
  const displayPrice = getPriceForSize(product, selectedSize);
  const canAddToCart = Boolean(variant && selectedSize);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  function showFeedback(message: string) {
    setFeedback(message);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 2400);
  }

  function handleAddToCart() {
    if (!variant || !selectedSize) return;

    addItem(product, variant, selectedSize, qty);
    showFeedback("Producto agregado al carrito.");
  }

  function handleBuyNow() {
    if (!variant || !selectedSize) return;

    clear();
    addItem(product, variant, selectedSize, qty);
    showFeedback("Listo, te llevamos al carrito para finalizar.");
    router.push("/carrito");
  }

  return (
    <div className="grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1.04fr_.96fr]">
      <section className="revealIn space-y-4">
        <div className="card overflow-hidden">
          <div className="relative h-[50vh] min-h-[280px] max-h-[620px] w-full bg-[#fdf2f8] sm:min-h-[340px] md:h-[64vh] lg:h-[68vh]">
            {images[imgIdx] ? (
              <Image src={images[imgIdx]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-black/40">Sin imagen</div>
            )}

            <div className="absolute left-4 top-4 pill bg-white/88">
              {images.length ? `${imgIdx + 1} / ${images.length}` : "1 / 1"}
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setImgIdx(index)}
                className={[
                  "relative h-16 overflow-hidden rounded-2xl ring-1 transition md:h-20 hover:-translate-y-[1px]",
                  index === imgIdx
                    ? "ring-[#ec4899] shadow-[0_8px_20px_rgba(157,23,77,.22)]"
                    : "ring-black/10 hover:ring-black/25",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="revealIn revealInDelay1 lg:pt-1">
        <div className="card p-5 sm:p-6 md:p-7 lg:sticky lg:top-24">
          <div className="text-[11px] uppercase tracking-[0.2em] text-black/45">Coleccion</div>
          <h1 className="displayText mt-2 text-[2rem] leading-[1.02] font-semibold sm:text-[2.2rem]">
            {product.name}
          </h1>

          <div className="mt-2.5 text-[1.9rem] font-black tracking-tight text-[#be185d] sm:mt-3 sm:text-[2rem]">
            {moneyGTQ(displayPrice)}
          </div>

          <p className="mt-3 text-[1rem] text-black/62">
            {product.description || "Pieza seleccionada en bea millis."}
          </p>

          <div className="mt-7 space-y-2">
            <div className="flex items-center justify-between text-sm text-black/64">
              <span>Color</span>
              <span className="font-semibold text-black">{variant?.colorName ?? "N/A"}</span>
            </div>
            <ColorSwatches variants={product.variants} value={colorId} onChange={onChangeColor} />
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-black/64">
              <span>Talla</span>
              {selectedSize ? (
                <span className="rounded-full bg-[#fce7f3] px-2.5 py-1 text-xs font-semibold text-[#9d174d]">
                  Stock {selectedSize.stock}
                </span>
              ) : null}
            </div>

            {sizes.length > 0 ? (
              <SizePicker sizes={sizes} value={size} onChange={setSize} />
            ) : (
              <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-black/52">
                Sin tallas disponibles en este color.
              </div>
            )}
          </div>

          <div className="mt-7 space-y-3 rounded-2xl border border-black/8 bg-white/72 p-3 sm:p-3.5">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex w-full items-center justify-between overflow-hidden rounded-2xl border border-black/12 bg-white sm:w-auto sm:justify-start">
                <button
                  className="uiControlButton px-4 py-2 text-black/75 hover:bg-black/5 sm:px-4"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                >
                  -
                </button>
                <div className="min-w-10 text-center font-semibold sm:min-w-10">{qty}</div>
                <button
                  className="uiControlButton px-4 py-2 text-black/75 hover:bg-black/5 sm:px-4"
                  onClick={() => setQty((current) => current + 1)}
                >
                  +
                </button>
              </div>

              <button
                className={
                  canAddToCart
                    ? "btn btn-primary w-full sm:flex-1"
                    : "btn w-full cursor-not-allowed bg-black/10 text-black/40 sm:flex-1"
                }
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                Agregar al carrito
              </button>
            </div>

            <button
              className={
                canAddToCart
                  ? "btn w-full border-[#f472b6]/45 bg-[#fce7f3] text-[#9d174d] shadow-[0_12px_24px_rgba(157,23,77,.18)] hover:bg-[#fbcfe8]"
                  : "btn w-full cursor-not-allowed bg-black/10 text-black/40"
              }
              onClick={handleBuyNow}
              disabled={!canAddToCart}
            >
              Comprar ahora
            </button>

            <div
              role="status"
              aria-live="polite"
              className={[
                "rounded-xl px-3 py-2 text-sm transition",
                feedback
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-transparent text-transparent",
              ].join(" ")}
            >
              {feedback ?? " "}
            </div>
          </div>

          <div className="mt-4 text-xs text-black/47">
            * Finalizas el pedido por WhatsApp (sin tarjeta).
          </div>
        </div>
      </section>
    </div>
  );
}
