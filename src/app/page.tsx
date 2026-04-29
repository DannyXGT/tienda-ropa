import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, Style } from "@/lib/catalog.types";
import { getHomeGalleryImages, getPublishedProducts, getStyles } from "@/lib/catalog";

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function pickHeroImages(images: string[]): string[] {
  const fallback = [
    "/products/set-linen/beige-1.jpg",
    "/products/dress-satin/red-1.jpg",
    "/products/set-linen/black-1.jpg",
    "/products/dress-satin/emerald-1.jpg",
    "/products/set-linen/beige-2.jpg",
    "/products/dress-satin/red-2.jpg",
    "/products/set-linen/black-2.jpg",
    "/products/dress-satin/emerald-2.jpg",
  ];
  const source = [...images, ...fallback].filter(Boolean);
  const result: string[] = [];

  for (let index = 0; result.length < 10; index += 1) {
    result.push(source[index % source.length]);
  }

  return result;
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

function StyleNav({ styles }: { styles: Style[] }) {
  const fallbackStyles = [
    { id: "vestidos", name: "Vestidos", href: "/estilos" },
    { id: "enterizos", name: "Enterizos", href: "/estilos" },
  ];

  const links = styles.length
    ? styles.map((style) => ({
        id: style.id,
        name: style.name,
        href: `/estilos/${style.id}`,
      }))
    : fallbackStyles;

  return (
    <section className="styleDeck revealIn">
      <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
        {links.slice(0, 8).map((style, index) => (
          <Link
            key={style.id}
            href={style.href}
            className="categoryButton group"
            style={{ "--category-index": index } as CSSProperties}
          >
            <span className="categoryButtonMark" aria-hidden="true" />
            <span className="categoryButtonText">{style.name}</span>
            <IconArrow />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [products, styles, homeGalleryImages] = await Promise.all([
    getPublishedProducts(),
    getStyles(),
    getHomeGalleryImages(),
  ]);

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

  const productHeroImages = featured.flatMap((product) =>
    product.variants.flatMap((variant) => variant.images)
  );
  const heroImages = pickHeroImages(homeGalleryImages.length ? homeGalleryImages : productHeroImages);

  return (
    <div className="space-y-8 md:space-y-11">
      <StyleNav styles={styles} />

      <section className="card homeHero revealIn overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.02fr_.98fr]">
          <div className="order-2 p-5 pt-6 sm:p-7 md:order-1 md:p-10">
            <div className="pill w-fit">
              Nueva temporada
            </div>

            <h1 className="displayText mt-4 text-[2rem] leading-[1.02] font-semibold sm:text-[2.2rem] md:mt-5 md:text-[3.1rem]">
              Tu boutique de vestidos elegantes, lista para ti.
            </h1>

            <p className="mt-3 max-w-[52ch] text-[1.02rem] text-black/67 sm:text-[1.05rem]">
              Descubre piezas exclusivas, elige tu color favorito y encuentra el ajuste que acompana
              tu proximo look.
            </p>
          </div>

          <div className="order-1 heroMediaSurface relative min-h-[380px] sm:min-h-[470px] md:order-2 md:min-h-[560px]">
            <div className="heroPhotoGrid absolute inset-0 p-3 sm:p-4 md:p-6">
              {heroImages.map((src, index) => (
                <div key={`${src}-${index}`} className={`heroTile heroTile${index + 1}`}>
                  <Image
                    src={src}
                    alt={`Look Bea Millis ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 45vw, 20vw"
                    className="object-cover"
                    priority={index < 4}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        title="Novedades"
        subtitle="Piezas recien agregadas a la tienda."
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
