"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, Style } from "@/lib/catalog.types";

const PAGE_SIZE = 12;

export default function CatalogBrowser({
  products,
  styles,
  initialStyleId = "all",
}: {
  products: Product[];
  styles: Style[];
  initialStyleId?: string;
}) {
  const [page, setPage] = useState(1);

  const knownStyleIds = useMemo(() => new Set(styles.map((style) => style.id)), [styles]);
  const selectedStyleId =
    initialStyleId !== "all" && !knownStyleIds.has(initialStyleId) ? "all" : initialStyleId;

  const filtered = useMemo(() => {
    return products
      .filter((product) => selectedStyleId === "all" || product.styleId === selectedStyleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products, selectedStyleId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {paginated.length > 0 ? (
        <div className="catalogGrid grid grid-cols-2 gap-3 md:grid-cols-4">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <h3 className="displayText text-[1.8rem] font-semibold">No encontramos productos</h3>
          <p className="mt-2 text-black/60">
            Prueba otro texto de busqueda o cambia el filtro de estilo.
          </p>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="revealIn revealInDelay1 flex items-center justify-center gap-2">
          <button
            className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <span className="pill bg-white/90">
            {currentPage} / {totalPages}
          </span>

          <button
            className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </nav>
      ) : null}
    </div>
  );
}
