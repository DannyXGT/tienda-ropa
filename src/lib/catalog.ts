import "server-only";

import { cache } from "react";
import type {
  HomeGallery,
  Product,
  SizeLabel,
  Style,
  Variant,
  VariantSize,
} from "@/lib/catalog.types";
import { sanityClient } from "@/lib/sanity/client";
import {
  HOME_GALLERY_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PUBLISHED_PRODUCTS_QUERY,
} from "@/lib/sanity/queries";

type SanityVariantSize = {
  _key?: string;
  size?: string;
  priceOverride?: number | null;
  active?: boolean;
};

type SanityVariant = {
  _key?: string;
  colorName?: string;
  hex?: string | null;
  images?: string[];
  sizes?: SanityVariantSize[];
};

type SanityProduct = {
  _id?: string;
  slug?: string;
  name?: string;
  description?: string;
  category?: string;
  priceBase?: number;
  featuredHome?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  createdAt?: string;
  variants?: SanityVariant[];
};

const ALLOWED_SIZES = new Set<SizeLabel>(["S", "M", "L", "XL"]);
const COLOR_NAME_TO_HEX: Record<string, string> = {
  rojo: "#dc2626",
  red: "#dc2626",
  vino: "#7f1d1d",
  burgundy: "#7f1d1d",
  granate: "#7f1d1d",
  rosado: "#ec4899",
  rosa: "#ec4899",
  pink: "#ec4899",
  fucsia: "#d946ef",
  azul: "#2563eb",
  blue: "#2563eb",
  marino: "#1e3a8a",
  navy: "#1e3a8a",
  celeste: "#38bdf8",
  turquoise: "#06b6d4",
  turquesa: "#06b6d4",
  verde: "#16a34a",
  green: "#16a34a",
  esmeralda: "#10b981",
  amarillo: "#eab308",
  yellow: "#eab308",
  naranja: "#f97316",
  orange: "#f97316",
  morado: "#7c3aed",
  purple: "#7c3aed",
  lila: "#a855f7",
  negro: "#111827",
  black: "#111827",
  blanco: "#f8fafc",
  white: "#f8fafc",
  gris: "#6b7280",
  gray: "#6b7280",
  grey: "#6b7280",
  beige: "#d6c2a6",
  cafe: "#7c4a2d",
  cafeoscuro: "#5a3a22",
  marron: "#7c4a2d",
  brown: "#7c4a2d",
  camel: "#b48657",
};

function slugify(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized || "sin-categoria";
}

function normalizeColorToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function normalizeHex(raw?: string | null): string | null {
  if (!raw) return null;
  const candidate = raw.trim();
  if (!candidate) return null;

  const prefixed = candidate.startsWith("#") ? candidate : `#${candidate}`;
  const shortHex = /^#([0-9a-fA-F]{3})$/;
  const longHex = /^#([0-9a-fA-F]{6})$/;

  if (shortHex.test(prefixed) || longHex.test(prefixed)) {
    return prefixed.toLowerCase();
  }

  return null;
}

function resolveColorHex(rawHex?: string | null, colorName?: string): string | null {
  const parsedHex = normalizeHex(rawHex);
  if (parsedHex) {
    return parsedHex;
  }

  if (!colorName) {
    return null;
  }

  const token = normalizeColorToken(colorName);
  if (COLOR_NAME_TO_HEX[token]) {
    return COLOR_NAME_TO_HEX[token];
  }

  for (const [knownName, knownHex] of Object.entries(COLOR_NAME_TO_HEX)) {
    if (token.includes(knownName)) {
      return knownHex;
    }
  }

  return null;
}

function normalizeSize(size: SanityVariantSize, index: number): VariantSize | null {
  const normalizedLabel = typeof size.size === "string" ? size.size.toUpperCase() : "";
  if (!ALLOWED_SIZES.has(normalizedLabel as SizeLabel)) {
    return null;
  }

  return {
    id: size._key ?? `${normalizedLabel}-${index}`,
    size: normalizedLabel as SizeLabel,
    priceOverride:
      typeof size.priceOverride === "number" && Number.isFinite(size.priceOverride)
        ? size.priceOverride
        : null,
    active: size.active !== false,
  };
}

function normalizeVariant(variant: SanityVariant, index: number): Variant | null {
  if (!variant.colorName?.trim()) {
    return null;
  }

  const sizes = (variant.sizes ?? [])
    .map((size, sizeIndex) => normalizeSize(size, sizeIndex))
    .filter((size): size is VariantSize => Boolean(size));

  return {
    colorId: variant._key ?? `color-${index}`,
    colorName: variant.colorName.trim(),
    hex: resolveColorHex(variant.hex, variant.colorName),
    images: (variant.images ?? []).filter(
      (image): image is string => typeof image === "string" && image.length > 0
    ),
    sizes,
  };
}

function normalizeProduct(product: SanityProduct): Product | null {
  if (!product._id || !product.slug || !product.name || !product.category) {
    return null;
  }

  const styleName = product.category.trim();
  const variants = (product.variants ?? [])
    .map((variant, index) => normalizeVariant(variant, index))
    .filter((variant): variant is Variant => Boolean(variant));

  return {
    id: product._id,
    slug: product.slug,
    name: product.name.trim(),
    styleId: slugify(styleName),
    styleName,
    priceBase:
      typeof product.priceBase === "number" && Number.isFinite(product.priceBase)
        ? product.priceBase
        : 0,
    description: product.description?.trim() || "",
    variants,
    createdAt: product.createdAt ?? new Date(0).toISOString(),
    featuredHome: product.featuredHome === true,
    newArrival: product.newArrival === true,
    bestSeller: product.bestSeller === true,
  };
}

const getPublishedProductsFromSanity = cache(async (): Promise<Product[]> => {
  if (!sanityClient) {
    return [];
  }

  const result = await sanityClient.fetch<SanityProduct[]>(PUBLISHED_PRODUCTS_QUERY);
  return result
    .map((product) => normalizeProduct(product))
    .filter((product): product is Product => Boolean(product));
});

export async function getPublishedProducts(): Promise<Product[]> {
  return getPublishedProductsFromSanity();
}

export async function getStyles(): Promise<Style[]> {
  const products = await getPublishedProductsFromSanity();
  const stylesMap = new Map<string, Style>();

  for (const product of products) {
    const existing = stylesMap.get(product.styleId);
    if (existing) {
      existing.productCount += 1;
      continue;
    }

    stylesMap.set(product.styleId, {
      id: product.styleId,
      name: product.styleName,
      description: `Coleccion ${product.styleName}`,
      productCount: 1,
    });
  }

  return [...stylesMap.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getStyleById(id: string): Promise<Style | null> {
  const styles = await getStyles();
  return styles.find((style) => style.id === id) ?? null;
}

export async function getProductsByStyle(styleId: string): Promise<Product[]> {
  const products = await getPublishedProductsFromSanity();
  return products.filter((product) => product.styleId === styleId);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!sanityClient) {
    return null;
  }

  const result = await sanityClient.fetch<SanityProduct | null>(PRODUCT_BY_SLUG_QUERY, { slug });
  if (!result) {
    return null;
  }

  return normalizeProduct(result);
}

const getHomeGalleryFromSanity = cache(async (): Promise<HomeGallery | null> => {
  if (!sanityClient) {
    return null;
  }

  const result = await sanityClient.fetch<HomeGallery | null>(HOME_GALLERY_QUERY);
  if (!result?.images?.length) {
    return null;
  }

  return {
    images: result.images.filter(
      (image): image is string => typeof image === "string" && image.length > 0
    ),
  };
});

export async function getHomeGalleryImages(): Promise<string[]> {
  const gallery = await getHomeGalleryFromSanity();
  return gallery?.images ?? [];
}
