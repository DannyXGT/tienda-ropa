"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product, Variant, VariantSize } from "@/lib/catalog.types";
import { getPriceForSize } from "@/lib/pricing";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  colorId: string;
  colorName: string;
  size: string;
  qty: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  addItem: (p: Product, v: Variant, size: VariantSize, qty?: number) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartCtx | null>(null);

function k(i: Pick<CartItem, "productId" | "colorId" | "size">) {
  return `${i.productId}__${i.colorId}__${i.size}`;
}
export function cartItemKey(i: Pick<CartItem, "productId" | "colorId" | "size">) {
  return k(i);
}

const STORAGE_KEY = "boutique_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, isHydrated]);

  const api = useMemo<CartCtx>(() => {
    const addItem: CartCtx["addItem"] = (p, v, size, qty = 1) => {
      const key = k({ productId: p.id, colorId: v.colorId, size: size.size });
      const unitPrice = getPriceForSize(p, size);

      setItems(prev => {
        const idx = prev.findIndex(x => k(x) === key);
        const next = [...prev];
        if (idx >= 0) {
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        next.push({
          productId: p.id,
          slug: p.slug,
          name: p.name,
          price: unitPrice,
          colorId: v.colorId,
          colorName: v.colorName,
          size: size.size,
          qty,
          image: v.images[0] || "",
        });
        return next;
      });
    };

    const removeItem: CartCtx["removeItem"] = (key) => {
      setItems(prev => prev.filter(x => k(x) !== key));
    };

    const setQty: CartCtx["setQty"] = (key, qty) => {
      setItems(prev => prev.map(x => (k(x) === key ? { ...x, qty: Math.max(1, qty) } : x)));
    };

    const clear = () => setItems([]);

    const count = items.reduce((a, b) => a + b.qty, 0);
    const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);

    return { items, addItem, removeItem, setQty, clear, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
