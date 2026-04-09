import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/catalog.types";
import { moneyGTQ } from "@/lib/money";
import { getStartingPrice } from "@/lib/pricing";

export default function ProductCard({ product }: { product: Product }) {
  const img1 = product.variants?.[0]?.images?.[0] || "";
  const img2 = product.variants?.[0]?.images?.[1] || img1;
  const startingPrice = getStartingPrice(product);

  return (
    <Link href={`/producto/${product.slug}`} className="block revealIn">
      <article className="group card cardHover overflow-hidden">
        <div className="relative aspect-[4/5] w-full bg-black/5">
          {img1 ? (
            <>
              <Image
                src={img1}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.045]"
              />
              <Image
                src={img2}
                alt={`${product.name} alternate`}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-black/40">Sin imagen</div>
          )}

          <div className="absolute left-3 top-3 pill bg-white/86">
            {product.variants.length} colores
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[.98rem] font-bold tracking-tight sm:text-[1rem]">
                {product.name}
              </div>
              <div className="lineClamp3 mt-1 text-[13px] leading-[1.28] text-black/70 sm:text-xs sm:leading-[1.34]">
                {product.description ? product.description : "Seleccion exclusiva de temporada"}
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-[#fce7f3] px-2 py-1.5 text-[.9rem] font-extrabold text-[#9d174d] transition-transform duration-300 group-hover:-translate-y-0.5 sm:px-2.5">
              {moneyGTQ(startingPrice)}
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2 sm:mt-3">
            {product.variants.slice(0, 5).map((variant) => (
              <span
                key={variant.colorId}
                title={variant.colorName}
                className="h-4 w-4 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: variant.hex || "#d1d5db" }}
              />
            ))}
            {product.variants.length > 5 ? (
              <span className="text-xs muted">+{product.variants.length - 5}</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
