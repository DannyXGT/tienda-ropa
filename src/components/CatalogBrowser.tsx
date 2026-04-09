"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, Style } from "@/lib/catalog.types";
import { getStartingPrice } from "@/lib/pricing";

type SortKey = "recent" | "priceAsc" | "priceDesc" | "nameAsc";

const PAGE_SIZE = 12;

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isSortKey(value: string): value is SortKey {
  return value === "recent" || value === "priceAsc" || value === "priceDesc" || value === "nameAsc";
}

export default function CatalogBrowser({
  products,
  styles,
  initialStyleId = "all",
  initialQuery = "",
  initialSort = "recent",
}: {
  products: Product[];
  styles: Style[];
  initialStyleId?: string;
  initialQuery?: string;
  initialSort?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [styleId, setStyleId] = useState(initialStyleId);
  const [sort, setSort] = useState<SortKey>(isSortKey(initialSort) ? initialSort : "recent");
  const [page, setPage] = useState(1);

  const knownStyleIds = useMemo(() => new Set(styles.map((style) => style.id)), [styles]);
  const selectedStyleId = styleId !== "all" && !knownStyleIds.has(styleId) ? "all" : styleId;

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());

    const list = products.filter((product) => {
      if (selectedStyleId !== "all" && product.styleId !== selectedStyleId) {
        return false;
      }

      if (!q) {
        return true;
      }

      const haystack = normalizeText(
        [product.name, product.description ?? "", product.styleName].join(" ")
      );
      return haystack.includes(q);
    });

    list.sort((a, b) => {
      if (sort === "priceAsc") {
        return getStartingPrice(a) - getStartingPrice(b);
      }

      if (sort === "priceDesc") {
        return getStartingPrice(b) - getStartingPrice(a);
      }

      if (sort === "nameAsc") {
        return a.name.localeCompare(b.name, "es");
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [products, query, selectedStyleId, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <section className="card revealIn p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="block">
            <span className="mb-1 block text-sm text-black/58">Buscar en catalogo</span>
            <input
              className="input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Ej: vestido rojo, enterizo, satin..."
            />
          </label>

          <label className="block md:min-w-52">
            <span className="mb-1 block text-sm text-black/58">Estilo</span>
            <select
              className="input"
              value={selectedStyleId}
              onChange={(event) => {
                setStyleId(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todos los estilos</option>
              {styles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name} ({style.productCount})
                </option>
              ))}
            </select>
          </label>

          <label className="block md:min-w-52">
            <span className="mb-1 block text-sm text-black/58">Ordenar</span>
            <select
              className="input"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortKey);
                setPage(1);
              }}
            >
              <option value="recent">Mas recientes</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="nameAsc">Nombre A-Z</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-black/60">
          <p>
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"} en catalogo.
          </p>
          <p>
            Pagina {currentPage} de {totalPages}
          </p>
        </div>
      </section>

      {paginated.length > 0 ? (
        <div className="catalogGrid grid grid-cols-2 gap-4 md:grid-cols-4">
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
