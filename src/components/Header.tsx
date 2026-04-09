"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/state/cart";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "bea_millis_theme";

function Icon({ name }: { name: "tag" | "bag" | "theme" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" as const };
  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="M20 13l-7 7-11-11V2h7l11 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M7 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "theme") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2.7v2.4M12 18.9v2.4M21.3 12h-2.4M5.1 12H2.7M18.9 5.1l-1.7 1.7M6.8 17.2l-1.7 1.7M18.9 18.9l-1.7-1.7M6.8 6.8 5.1 5.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M6 7l1-3h10l1 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M5 7h14l-1 14H6L5 7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 11v-1a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function NavPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        "pill whitespace-nowrap transition rounded-2xl px-2.5 py-2 sm:px-4 hover:-translate-y-[1px] active:translate-y-[1px]",
        active
          ? "bg-white border-black/20 shadow-[0_14px_30px_rgba(18,18,24,.12)]"
          : "pillSoft hover:bg-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const isCatalogo =
    pathname?.startsWith("/catalogo") ||
    pathname?.startsWith("/estilos") ||
    pathname?.startsWith("/producto");
  const isCarrito = pathname?.startsWith("/carrito");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preferred: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initialTheme: ThemeMode =
      stored === "dark" || stored === "light" ? stored : preferred;

    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const q = searchQuery.trim();
    if (!q) {
      router.push("/catalogo");
      return;
    }

    router.push(`/catalogo?q=${encodeURIComponent(q)}`);
  }

  function onToggleTheme() {
    const currentTheme: ThemeMode =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme: ThemeMode = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgb(var(--bg))]/92 backdrop-blur-xl">
      <div className="containerX">
        <div className="py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f472b6] to-[#be185d] text-sm font-extrabold tracking-wide text-white shadow-[0_14px_32px_rgba(157,23,77,.30)] sm:h-11 sm:w-11">
                BM
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block max-w-[8.5rem] truncate text-[0.98rem] font-semibold tracking-tight text-black sm:max-w-none sm:text-[1.05rem]">
                  bea millis
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.26em] text-black/45 sm:block">
                  boutique
                </span>
              </span>
            </Link>

            <form onSubmit={onSearchSubmit} className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
              <input
                className="input !h-11 min-w-0 flex-1 !rounded-2xl !px-4 !py-2.5"
                placeholder="Buscar en catalogo..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button type="submit" className="btn btn-primary !h-11 !rounded-2xl !px-4 !py-2.5">
                Buscar
              </button>
              <Link href="/catalogo" className="btn btn-ghost !h-11 !rounded-2xl !px-4 !py-2.5">
                Filtros
              </Link>
            </form>

            <nav className="flex shrink-0 items-center gap-1.5 text-sm sm:gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="pill themeToggle transition rounded-2xl px-2.5 py-2 hover:bg-white/90 sm:px-3"
                aria-label="Cambiar tema"
                title="Cambiar tema"
              >
                <span className="themeIconWrap">
                  <Icon name="theme" />
                </span>
                <span className="hidden lg:inline">Tema</span>
              </button>

              <NavPill href="/catalogo" active={!!isCatalogo}>
                <Icon name="tag" />
                <span className="hidden sm:inline">Catalogo</span>
              </NavPill>

              <NavPill href="/carrito" active={!!isCarrito}>
                <Icon name="bag" />
                <span className="hidden sm:inline">Carrito</span>
                <span className="ml-0.5 rounded-full bg-black/6 px-2 py-0.5 text-xs font-black sm:ml-1">
                  {count}
                </span>
              </NavPill>
            </nav>
          </div>

          <form onSubmit={onSearchSubmit} className="mt-3 flex items-center gap-2 md:hidden">
            <input
              className="input !h-11 min-w-0 flex-1 !rounded-2xl !px-4 !py-2.5"
              placeholder="Buscar en catalogo..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="submit" className="btn btn-primary !h-11 !rounded-2xl !px-4 !py-2.5">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
