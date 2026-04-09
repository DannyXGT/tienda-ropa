import SectionTitle from "@/components/SectionTitle";
import CatalogBrowser from "@/components/CatalogBrowser";
import { getPublishedProducts, getStyles } from "@/lib/catalog";

type CatalogSearchParams = {
  style?: string;
  q?: string;
  sort?: string;
};

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
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const initialSort = typeof params.sort === "string" ? params.sort : "recent";

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Catalogo"
        subtitle="Filtra por estilo, busca por nombre y ordena para encontrar piezas rapido."
      />

      <CatalogBrowser
        products={products}
        styles={styles}
        initialStyleId={initialStyleId}
        initialQuery={initialQuery}
        initialSort={initialSort}
      />
    </div>
  );
}
