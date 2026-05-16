import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { getProductsByStyle, getStyleById } from "@/lib/catalog";

export const revalidate = 0;

export default async function StyleDetailPage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style: styleSlug } = await params;
  const style = await getStyleById(styleSlug);
  if (!style) return <div className="text-black/60">Estilo no encontrado.</div>;

  const list = await getProductsByStyle(styleSlug);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <SectionTitle title={style.name} subtitle={`${list.length} producto${list.length === 1 ? "" : "s"}`} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
