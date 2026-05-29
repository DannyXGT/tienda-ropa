import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/catalog.types";
import { getHomeGalleryImages, getPublishedProducts } from "@/lib/catalog";
import { WHATSAPP_PHONE } from "@/lib/storeConfig";

export const revalidate = 0;

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
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    list.push(product);
    if (list.length >= limit) break;
  }

  return list;
}

function ProductSection({
  title,
  subtitle,
  products,
  whatsappHref,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  whatsappHref: string;
}) {
  return (
    <section className="revealIn space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h2 className="displayText text-[1.8rem] font-semibold sm:text-[2rem]">{title}</h2>
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
        <div className="card emptyStateCard p-5 sm:p-7">
          <span className="emptyStateBadge">ATENCION BOUTIQUE</span>
          <h3 className="displayText text-[1.42rem] font-semibold sm:text-[1.65rem]">
            Muy pronto nuevas piezas
          </h3>
          <p className="mt-2 max-w-[56ch] text-sm text-black/67 sm:text-[.97rem]">
            Estamos preparando una seleccion especial para esta categoria.
          </p>
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-4 !rounded-full !px-5 !py-2.5 text-sm"
          >
            Consultar por WhatsApp
          </Link>
        </div>
      )}
    </section>
  );
}

function TrustStrip() {
  const points = [
    "Pedido directo por WhatsApp",
    "Consulta disponibilidad antes de confirmar",
    "Entrega coordinada",
    "Atencion personalizada",
  ];

  return (
    <section className="revealIn">
      <div className="rounded-2xl border border-black/10 bg-white/50 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {points.map((point) => (
            <div
              key={point}
              className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[11px] font-medium sm:text-xs"
            >
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [products, homeGalleryImages] = await Promise.all([
    getPublishedProducts(),
    getHomeGalleryImages(),
  ]);

  const recent = sortRecent(products);
  const featured = takeUnique(
    products.filter((product) => product.featuredHome),
    recent,
    4
  );
  const newArrivals = recent.filter((product) => product.newArrival);
  const allProducts = recent;

  const productHeroImages = featured.flatMap((product) =>
    product.variants.flatMap((variant) => variant.images)
  );

  const heroImages = pickHeroImages(homeGalleryImages.length ? homeGalleryImages : productHeroImages);
  const heroMain = heroImages[0];
  const heroSecondary = heroImages.slice(1, 4);
  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola, quiero asesoria para elegir un look")}`;

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="card homeHero revealIn overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.02fr_.98fr]">
          <div className="order-1 p-4 pt-5 sm:p-6 md:order-1 md:p-7">
            <h1 className="displayText mt-1 w-full max-w-[16ch] text-center text-[1.45rem] leading-[1.08] font-semibold sm:text-[1.8rem] md:text-left md:text-[2.25rem]">
              Ten la libertad de usar lo que te haga sentir unica
            </h1>

            <p className="mt-2 w-full max-w-[46ch] text-center text-[.93rem] leading-relaxed text-black/67 sm:text-[.98rem] md:text-left">
              Viste lo que eres, sin moldes, sin estereotipos, solo tu personalidad.
            </p>

            <div className="mt-4 flex flex-col items-center gap-2 md:items-start">
              <Link href="/#nuevo-ingreso" className="btn btn-primary heroCtaPrimary !min-h-0 !px-4 !py-2.5 !text-sm">
                Ver nuevo ingreso
              </Link>
              <Link href="/estilos" className="text-sm font-semibold text-black/72 underline-offset-4 hover:underline">
                Comprar por categoria
              </Link>
            </div>

            <div className="mt-4 md:hidden">
              <div className="grid grid-cols-[1fr_.95fr] gap-2 rounded-2xl border border-black/8 bg-[#0f1426]/45 p-2">
                <div className="relative min-h-[220px] overflow-hidden rounded-2xl">
                  <Image
                    src={heroMain}
                    alt="Look principal Bea Millis"
                    fill
                    sizes="48vw"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="grid grid-rows-3 gap-2">
                  {heroSecondary.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative min-h-[68px] overflow-hidden rounded-2xl">
                      <Image
                        src={src}
                        alt={`Look secundario Bea Millis ${index + 1}`}
                        fill
                        sizes="44vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 heroMediaSurface relative hidden md:block md:min-h-[355px]">
            <div className="heroEditorial absolute inset-0 p-3.5">
              <div className="heroMainFrame">
                <Image
                  src={heroMain}
                  alt="Look principal Bea Millis"
                  fill
                  sizes="(max-width: 1200px) 40vw, 32vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="heroThumbRail">
                {heroSecondary.map((src, index) => (
                  <div key={`${src}-${index}`} className="heroThumb">
                    <Image
                      src={src}
                      alt={`Look secundario Bea Millis ${index + 1}`}
                      fill
                      sizes="18vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      <div id="nuevo-ingreso" className="scroll-mt-24" />
      <ProductSection
        title="Nuevo ingreso"
        subtitle="Piezas recien agregadas a la tienda."
        products={newArrivals}
        whatsappHref={whatsappHref}
      />

      <ProductSection
        title="Todos los productos"
        subtitle="Explora toda la coleccion disponible."
        products={allProducts}
        whatsappHref={whatsappHref}
      />
    </div>
  );
}

