"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import type { Product, SizeLabel } from "@/lib/catalog.types";
import { moneyGTQ } from "@/lib/money";
import ColorSwatches from "@/components/ColorSwatches";
import SizePicker from "@/components/SizePicker";
import { getPriceForSize, getVisibleSizes } from "@/lib/pricing";
import { useCart } from "@/state/cart";

const SIZE_MEASUREMENTS: Record<SizeLabel, { bust: string; waist: string; hip: string }> = {
  XS: { bust: "75 cm", waist: "63 cm", hip: "75-80 cm" },
  S: { bust: "80 cm", waist: "64 cm", hip: "88-90 cm" },
  M: { bust: "90 cm", waist: "72 cm", hip: "90-104 cm" },
  L: { bust: "100 cm", waist: "85 cm", hip: "92-110 cm" },
  XL: { bust: "110 cm", waist: "95 cm", hip: "110-125 cm" },
};

const SIZE_FIT_NOTES: Record<string, string> = {
  XS: "XS está diseñado para chicas que usan pantalón talla 0, talla 1/2 máximo.",
  S: "S está diseñado para chicas que usan pantalón talla 2/3.",
  M: "M está diseñado para chicas que usan pantalón talla 3/4, talla 5/6 máximo.",
  L: "L está diseñado para chicas que usan pantalón talla 5/6, talla 7/8 máximo.",
  XL: "XL está diseñado para chicas que usan pantalón talla 10, y máximo 14.",
};

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const isPointerDraggingRef = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
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
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  function snapToNearestImage(behavior: ScrollBehavior = "smooth") {
    if (!carouselRef.current) return;
    const slideWidth = carouselRef.current.clientWidth;
    if (slideWidth <= 0) return;
    const targetIndex = Math.max(
      0,
      Math.min(Math.round(carouselRef.current.scrollLeft / slideWidth), Math.max(images.length - 1, 0))
    );
    carouselRef.current.scrollTo({ left: targetIndex * slideWidth, behavior });
    setImgIdx(targetIndex);
  }

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

  function handleCarouselScroll() {
    if (!carouselRef.current) return;
    const slideWidth = carouselRef.current.clientWidth;
    if (slideWidth <= 0) return;
    const nextIndex = Math.round(carouselRef.current.scrollLeft / slideWidth);
    if (nextIndex !== imgIdx) {
      setImgIdx(Math.max(0, Math.min(nextIndex, Math.max(images.length - 1, 0))));
    }

    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }
    if (!isPointerDraggingRef.current) {
      snapTimeoutRef.current = setTimeout(() => {
        snapToNearestImage("smooth");
      }, 90);
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !carouselRef.current) return;
    isPointerDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = carouselRef.current.scrollLeft;
    setIsDragging(true);
    carouselRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isPointerDraggingRef.current || !carouselRef.current) return;
    const delta = event.clientX - dragStartXRef.current;
    carouselRef.current.scrollLeft = dragStartScrollRef.current - delta;
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !carouselRef.current) return;
    isPointerDraggingRef.current = false;
    setIsDragging(false);
    if (carouselRef.current.hasPointerCapture(event.pointerId)) {
      carouselRef.current.releasePointerCapture(event.pointerId);
    }
    snapToNearestImage("smooth");
  }

  return (
    <div className="grid items-start gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1.05fr_.95fr]">
      <section className="revealIn space-y-4 lg:sticky lg:top-24">
        <div className="card overflow-hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={[
              "relative h-[40vh] min-h-[224px] max-h-[520px] w-full snap-x snap-mandatory overflow-x-auto bg-[#0f1320] sm:min-h-[272px] md:h-[52vh] lg:h-[62vh] lg:min-h-[620px] lg:max-h-[760px]",
              isDragging ? "cursor-grabbing select-none" : "cursor-grab",
            ].join(" ")}
          >
            {images.length > 0 ? (
              <div className="flex h-full w-full">
                {images.map((src, index) => (
                  <div key={`${src}-${index}`} className="relative h-full min-w-full snap-center [scroll-snap-stop:always]">
                    <Image src={src} alt={`${product.name} ${index + 1}`} fill className="object-contain" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-black/40">Sin imagen</div>
            )}

            <div className="absolute left-4 top-4 z-30 rounded-full bg-[rgba(14,18,28,0.72)] px-3 py-1.5 text-sm font-semibold text-white">
              {images.length ? `${imgIdx + 1} / ${images.length}` : "1 / 1"}
            </div>
          </div>
        </div>
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

          {product.description ? (
            <p className="mt-3 text-[1rem] text-black/62">{product.description}</p>
          ) : null}

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
              {selectedSize ? <span className="font-semibold text-black">{selectedSize.size}</span> : null}
            </div>

            {sizes.length > 0 ? (
              <>
                <SizePicker sizes={sizes} value={size} onChange={setSize} />
                {selectedSize ? (
                  <div className="measurementGuide mt-3 overflow-hidden rounded-2xl border border-black/8 bg-white/74">
                    <div className="grid grid-cols-4 border-b border-black/8 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-black/48">
                      <span>Talla</span>
                      <span>Busto</span>
                      <span>Cintura</span>
                      <span>Cadera</span>
                    </div>
                    <div className="grid grid-cols-4 bg-[#fce7f3] px-3 py-2 text-xs font-bold text-[#9d174d] sm:text-sm">
                      <span>{selectedSize.size}</span>
                      <span>{SIZE_MEASUREMENTS[selectedSize.size].bust}</span>
                      <span>{SIZE_MEASUREMENTS[selectedSize.size].waist}</span>
                      <span>{SIZE_MEASUREMENTS[selectedSize.size].hip}</span>
                    </div>
                    <div className="border-t border-black/8 px-3 py-2.5 text-sm text-black/70">
                      {SIZE_FIT_NOTES[selectedSize.size]}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-black/52">
                No hay tallas activas en este color.
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
        </div>
      </section>
    </div>
  );
}
