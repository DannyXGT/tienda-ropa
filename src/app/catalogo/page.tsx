import SectionTitle from "@/components/SectionTitle";
import CatalogBrowser from "@/components/CatalogBrowser";
import { getPublishedProducts, getStyles } from "@/lib/catalog";

type CatalogSearchParams = {
  style?: string;
};

export const revalidate = 0;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<CatalogSearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const [products, styles] = await Promise.all([getPublishedProducts(), getStyles()]);

  const initialStyleId =
    typeof params.style === "string" && styles.some((style) => style.id === params.style)
      ? params.style
      : "all";
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Colecciones"
        subtitle="Piezas disponibles organizadas por los estilos de la boutique."
      />

      <CatalogBrowser
        products={products}
        styles={styles}
        initialStyleId={initialStyleId}
      />
    </div>
  );
}
