import { getProductBySlug } from "@/lib/catalog";
import ProductClient from "./ProductClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return <div className="text-black/60">Producto no encontrado.</div>;
  return <ProductClient product={product} />;
}
