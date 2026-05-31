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
      <article className="group card cardHover productCard overflow-hidden">
        <div className="relative aspect-[4/5] w-full bg-black/5">
          {img1 ? (
            <>
              <Image
                src={img1}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <Image
                src={img2}
                alt={`${product.name} alternate`}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-black/40">Sin imagen</div>
          )}

          <div className="absolute left-2.5 top-2.5 pill bg-white/86 text-[11px]">
            {product.variants.length} colores
          </div>

          <div className="absolute right-2.5 bottom-2.5">
            <div className="productDetailCta rounded-full border border-white/24 bg-black/35 px-2.5 py-1.5 text-center text-[11px] font-semibold tracking-[.02em] text-white/95 backdrop-blur-md">
              Ver detalle
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0">
              <div className="text-[.92rem] font-bold leading-tight tracking-tight sm:text-[1rem]">
                {product.name}
              </div>
            </div>

            <div className="productPriceChip shrink-0 rounded-xl px-2.5 py-1.5 text-[.92rem] font-extrabold">
              {moneyGTQ(startingPrice)}
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2">
            {product.variants.slice(0, 5).map((variant) => (
              <span
                key={variant.colorId}
                title={variant.colorName}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 sm:h-4 sm:w-4"
                style={{ backgroundColor: variant.hex || "#d1d5db" }}
              />
            ))}
            {product.variants.length > 5 ? (
              <span className="text-[11px] muted">+{product.variants.length - 5}</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
