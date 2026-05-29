"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/state/cart";
import { WHATSAPP_PHONE } from "@/lib/storeConfig";

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
        "pill whitespace-nowrap transition rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 hover:-translate-y-[1px] active:translate-y-[1px]",
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const isCarrito = pathname?.startsWith("/carrito");
  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}`;
  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/estilos/vestidos", label: "Vestidos" },
    { href: "/estilos/enterizos", label: "Enterizos" },
    { href: "/#nuevo-ingreso", label: "Nuevo ingreso" },
    { href: whatsappHref, label: "Contacto", external: true },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preferred: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initialTheme: ThemeMode = stored === "dark" || stored === "light" ? stored : preferred;

    document.documentElement.setAttribute("data-theme", initialTheme);
    setThemeMode(initialTheme);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  function onToggleTheme() {
    const currentTheme: ThemeMode =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme: ThemeMode = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setThemeMode(nextTheme);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[rgb(var(--bg))]/88 backdrop-blur-xl">
      <div className="containerX">
        <div className="py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/8 bg-[rgb(var(--card))]/70 text-black/75 md:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_14px_30px_rgba(18,18,24,.14)] ring-1 ring-black/8 sm:h-14 sm:w-14">
                <Image src="/logo.jpeg" alt="Bea Millis" fill sizes="56px" className="object-cover" priority />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block max-w-[8rem] truncate text-[1rem] font-semibold tracking-tight text-black sm:max-w-none sm:text-[1.1rem]">
                  bea millis
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.26em] text-black/45 sm:block">
                  boutique
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 text-sm md:flex">
              {navLinks.map((link) => {
                const active =
                  !link.external &&
                  !link.href.startsWith("/#") &&
                  ((link.href === "/" && pathname === "/") ||
                    (link.href !== "/" && pathname?.startsWith(link.href)));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={["headerNavLink", active ? "is-active" : ""].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <nav className="flex shrink-0 items-center gap-1 text-sm sm:gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="pill themeToggle transition rounded-2xl px-2 py-1.5 hover:bg-white/90 sm:px-3 sm:py-2"
                aria-label="Cambiar tema"
                title="Cambiar tema"
              >
                <span className="themeIconWrap">
                  <Icon name="theme" />
                </span>
                <span className="hidden lg:inline">Tema</span>
              </button>

              <NavPill href="/carrito" active={!!isCarrito}>
                <Icon name="bag" />
                <span className="hidden sm:inline md:hidden lg:inline">Carrito</span>
                <span className="ml-0.5 rounded-full bg-black/6 px-2 py-0.5 text-xs font-black sm:ml-1">
                  {count}
                </span>
              </NavPill>
            </nav>
          </div>
        </div>
      </div>

      <div
        className={[
          "fixed inset-0 z-[9998] md:hidden transition-opacity duration-250",
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          className={[
            "absolute inset-0 backdrop-blur-[1.5px]",
            themeMode === "dark" ? "bg-black/38" : "bg-black/16",
          ].join(" ")}
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú lateral"
        />

        <aside
          className={[
            "fixed left-3 right-3 top-[68px] z-[9999] rounded-3xl border p-3 shadow-2xl transition-all duration-300 ease-out",
            sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[105%] opacity-0",
            themeMode === "dark"
              ? "border-white/14 bg-[#171c2a] text-white"
              : "border-neutral-200 bg-[#fbf7f1] text-neutral-950",
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center justify-between border-b px-1 pb-2.5",
              themeMode === "dark" ? "border-white/10" : "border-neutral-200",
            ].join(" ")}
          >
            <span className="text-[15px] font-semibold tracking-wide">Menú</span>
            <button
              type="button"
              className={[
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border",
                themeMode === "dark"
                  ? "border-white/15 bg-white/5 text-white"
                  : "border-neutral-300 bg-white text-neutral-800",
              ].join(" ")}
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="pt-2.5">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const active =
                  !link.external &&
                  !link.href.startsWith("/#") &&
                  ((link.href === "/" && pathname === "/") ||
                    (link.href !== "/" && pathname?.startsWith(link.href)));
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => setSidebarOpen(false)}
                      className={[
                        "flex h-11 items-center rounded-2xl px-4 text-[15px] font-medium transition",
                        active
                          ? themeMode === "dark"
                            ? "bg-white/10 text-rose-100"
                            : "bg-rose-100 text-rose-700"
                          : themeMode === "dark"
                            ? "text-neutral-200 hover:bg-white/10"
                            : "text-neutral-800 hover:bg-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={[
              "mt-3 border-t pt-2.5",
              themeMode === "dark" ? "border-white/10" : "border-neutral-200",
            ].join(" ")}
          >
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSidebarOpen(false)}
              className={[
                "flex h-10 items-center justify-center rounded-2xl border text-sm font-medium transition",
                themeMode === "dark"
                  ? "border-white/15 bg-white/5 text-neutral-100 hover:bg-white/10"
                  : "border-neutral-300 bg-white text-neutral-800 hover:bg-rose-50",
              ].join(" ")}
            >
              Pedidos por WhatsApp
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}

