"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, SizeLabel } from "@/lib/catalog.types";

type SortMode = "recent" | "price-asc" | "price-desc";

function getProductSizes(product: Product): SizeLabel[] {
  return Array.from(
    new Set(
      product.variants.flatMap((variant) =>
        variant.sizes.filter((size) => size.active).map((size) => size.size)
      )
    )
  );
}

function getStartingPrice(product: Product): number {
  const prices = product.variants
    .flatMap((variant) => variant.sizes)
    .filter((size) => size.active)
    .map((size) => size.priceOverride ?? product.priceBase);

  return prices.length ? Math.min(...prices) : product.priceBase;
}

export default function StyleProductGrid({ products }: { products: Product[] }) {
  const [size, setSize] = useState<SizeLabel | "">("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");

  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((product) => getProductSizes(product)))),
    [products]
  );

  const colors = useMemo(
    () =>
      Array.from(new Set(products.flatMap((product) => product.variants.map((variant) => variant.colorName))))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "es")),
    [products]
  );

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSize = size ? getProductSizes(product).includes(size) : true;
      const matchesColor = color
        ? product.variants.some((variant) => variant.colorName === color)
        : true;

      return matchesSize && matchesColor;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return getStartingPrice(a) - getStartingPrice(b);
      if (sort === "price-desc") return getStartingPrice(b) - getStartingPrice(a);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, size, color, sort]);

  const hasFilters = Boolean(size || color || sort !== "recent");

  function clearFilters() {
    setSize("");
    setColor("");
    setSort("recent");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="filterButton" onClick={clearFilters}>
          Filtro y orden
        </button>

        <select className="filterSelect" value={size} onChange={(event) => setSize(event.target.value as SizeLabel | "")}>
          <option value="">Talla</option>
          {sizes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select className="filterSelect" value={color} onChange={(event) => setColor(event.target.value)}>
          <option value="">Color</option>
          {colors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select className="filterSelect" value="" disabled>
          <option>Categoria</option>
        </select>

        <select className="filterSelect" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
          <option value="recent">Precio</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>

      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          {size ? (
            <button type="button" className="filterChip" onClick={() => setSize("")}>
              {size} x
            </button>
          ) : null}
          {color ? (
            <button type="button" className="filterChip" onClick={() => setColor("")}>
              {color} x
            </button>
          ) : null}
          {sort !== "recent" ? (
            <button type="button" className="filterChip" onClick={() => setSort("recent")}>
              {sort === "price-asc" ? "Menor precio" : "Mayor precio"} x
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="text-sm text-black/62">
        {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="catalogGrid grid grid-cols-2 gap-3 md:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-6 text-center text-black/62">No hay productos con esos filtros.</div>
      )}
    </div>
  );
}
