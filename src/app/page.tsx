import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/catalog.types";
import { getPublishedProducts, getStyles } from "@/lib/catalog";

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 11.5c0 4.142-3.582 7.5-8 7.5a8.6 8.6 0 0 1-3.98-.96L4 19l1.14-3.42A7.16 7.16 0 0 1 4 11.5C4 7.358 7.582 4 12 4s8 3.358 8 7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.3c.2-.4.5-.4.7-.4h.6c.2 0 .4.1.5.3l.6 1.5c.1.2.1.4 0 .6l-.4.6c-.1.2-.1.4 0 .6.4.7 1.3 1.5 2.1 1.9.2.1.4.1.6 0l.7-.4c.2-.1.4-.1.6 0l1.4.7c.2.1.3.3.3.5v.6c0 .2 0 .5-.3.6-.5.4-1.3.7-2 .6-1.3-.2-2.9-1.1-4.2-2.4-1.2-1.2-2.2-2.8-2.4-4.2-.1-.7.2-1.5.6-2Z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

function pickHeroImages(images: string[]): [string, string, string] {
  const fallback = [
    "/products/set-linen/beige-1.jpg",
    "/products/dress-satin/red-1.jpg",
    "/products/set-linen/black-1.jpg",
  ];

  return [images[0] || fallback[0], images[1] || fallback[1], images[2] || fallback[2]];
}

function sortRecent(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function takeUnique(primary: Product[], fallback: Product[], limit: number): Product[] {
  const list: Product[] = [];
  const seen = new Set<string>();

  for (const product of [...primary, ...fallback]) {
    if (seen.has(product.id)) {
      continue;
    }
    seen.add(product.id);
    list.push(product);
    if (list.length >= limit) {
      break;
    }
  }

  return list;
}

function ProductSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle: string;
  products: Product[];
}) {
  return (
    <section className="revealIn space-y-3.5 sm:space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h2 className="displayText text-[1.85rem] font-semibold sm:text-[2rem]">{title}</h2>
          <p className="mt-1 max-w-[48ch] text-sm text-black/58">{subtitle}</p>
        </div>

        <Link href="/catalogo" className="pill w-fit hover:bg-white">
          Ver catalogo <IconArrow />
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="catalogGrid grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-6 text-black/60">Aun no hay productos disponibles en esta seccion.</div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const [products, styles] = await Promise.all([getPublishedProducts(), getStyles()]);

  const recent = sortRecent(products);
  const featured = takeUnique(
    products.filter((product) => product.featuredHome),
    recent,
    4
  );
  const newArrivals = takeUnique(
    products.filter((product) => product.newArrival),
    recent,
    4
  );
  const bestSellers = takeUnique(
    products.filter((product) => product.bestSeller),
    featured.length ? featured : recent,
    4
  );

  const heroImages = pickHeroImages(
    featured.flatMap((product) => product.variants.flatMap((variant) => variant.images))
  );

  return (
    <div className="space-y-8 md:space-y-11">
      <section className="card homeHero revealIn overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.02fr_.98fr]">
          <div className="order-2 p-5 pt-6 sm:p-7 md:order-1 md:p-10">
            <div className="pill w-fit">
              <IconWhatsApp />
              Atencion por WhatsApp y pago coordinado
            </div>

            <h1 className="displayText mt-4 text-[2rem] leading-[1.02] font-semibold sm:text-[2.2rem] md:mt-5 md:text-[3.1rem]">
              Tu boutique de vestidos elegantes, lista para ti.
            </h1>

            <p className="mt-3 max-w-[52ch] text-[1.02rem] text-black/67 sm:text-[1.05rem]">
              Descubre piezas exclusivas, elige color y talla disponible, y confirma tu pedido por
              WhatsApp en minutos.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link href="/catalogo" className="btn btn-primary w-full justify-center sm:w-auto">
                Ver catalogo <IconArrow />
              </Link>
              <Link href="/carrito" className="btn btn-ghost w-full justify-center sm:w-auto">
                Ver carrito <IconArrow />
              </Link>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-7 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {styles.slice(0, 6).map((style) => (
                <Link
                  key={style.id}
                  href={`/catalogo?style=${style.id}`}
                  className="shrink-0 rounded-full border border-[#be185d]/22 bg-[#fce7f3] px-3 py-1.5 text-[13px] font-bold text-[#9d174d] shadow-[0_8px_18px_rgba(157,23,77,.10)] transition hover:-translate-y-[1px] hover:border-[#be185d]/36 hover:bg-[#fbcfe8] active:translate-y-0"
                >
                  {style.name}
                </Link>
              ))}
              {styles.length > 6 ? (
                <Link
                  href="/catalogo"
                  className="shrink-0 rounded-full border border-[#be185d]/22 bg-[#fce7f3] px-3 py-1.5 text-[13px] font-bold text-[#9d174d] shadow-[0_8px_18px_rgba(157,23,77,.10)] transition hover:-translate-y-[1px] hover:border-[#be185d]/36 hover:bg-[#fbcfe8] active:translate-y-0"
                >
                  Ver mas
                </Link>
              ) : null}
            </div>
          </div>

          <div className="order-1 heroMediaSurface relative min-h-[290px] sm:min-h-[340px] md:order-2 md:min-h-[430px]">
            <div className="absolute inset-0 p-4 sm:p-5 md:p-8">
              <div className="relative h-full w-full">
                <div className="heroMediaCard absolute left-2 top-2 h-[64%] w-[53%] -rotate-[2.4deg] overflow-hidden rounded-[1.3rem] sm:top-4 sm:rounded-[1.8rem] md:top-5 md:rounded-[2rem]">
                  <Image src={heroImages[0]} alt="Look principal" fill className="object-cover" priority />
                </div>

                <div className="heroMediaCard absolute right-2 top-8 h-[58%] w-[46%] rotate-[2.6deg] overflow-hidden rounded-[1.3rem] sm:top-12 sm:rounded-[1.8rem] md:top-14 md:rounded-[2rem]">
                  <Image src={heroImages[1]} alt="Look elegante" fill className="object-cover" />
                </div>

                <div className="heroMediaCard absolute bottom-2 left-[27%] h-[39%] w-[49%] -rotate-[1.2deg] overflow-hidden rounded-[1.2rem] sm:bottom-4 sm:rounded-[1.6rem] md:bottom-5 md:rounded-[1.8rem]">
                  <Image src={heroImages[2]} alt="Look secundario" fill className="object-cover" />
                </div>

                <div className="heroGlow absolute -bottom-20 -right-14 h-56 w-56 rounded-full blur-3xl sm:h-64 sm:w-64 md:h-72 md:w-72" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="card homeHint revealIn revealInDelay1 p-4 text-[0.95rem] leading-relaxed text-black/62 md:p-5 md:text-sm">
        Novedades cada semana: explora lo mas nuevo, lo mas pedido y una seleccion especial para
        encontrar tu proximo look.
      </div>

      <ProductSection
        title="Novedades"
        subtitle="Piezas recien agregadas al catalogo."
        products={newArrivals}
      />

      <ProductSection
        title="Mas pedidos"
        subtitle="Los favoritos que mas eligen nuestras clientas."
        products={bestSellers}
      />

      <ProductSection
        title="Destacados"
        subtitle="Una seleccion especial de la boutique."
        products={featured.length ? featured : recent.slice(0, 4)}
      />
    </div>
  );
}
