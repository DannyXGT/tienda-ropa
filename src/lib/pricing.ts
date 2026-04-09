import type { Product, Variant, VariantSize } from "@/lib/catalog.types";

export function getVisibleSizes(variant: Variant): VariantSize[] {
  return variant.sizes.filter((size) => size.active && size.stock > 0);
}

export function getPriceForSize(product: Product, size?: VariantSize | null): number {
  return size?.priceOverride ?? product.priceBase;
}

export function getStartingPrice(product: Product): number {
  const prices = product.variants
    .flatMap((variant) => getVisibleSizes(variant))
    .map((size) => getPriceForSize(product, size));

  if (!prices.length) {
    return product.priceBase;
  }

  return Math.min(...prices);
}
