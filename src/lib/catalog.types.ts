export type SizeLabel = "S" | "M" | "L" | "XL";

export type VariantSize = {
  id: string;
  size: SizeLabel;
  stock: number;
  priceOverride: number | null;
  active: boolean;
};

export type Variant = {
  colorId: string;
  colorName: string;
  hex?: string | null;
  images: string[];
  sizes: VariantSize[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  styleId: string;
  styleName: string;
  priceBase: number;
  description?: string;
  variants: Variant[];
  createdAt: string;
  featuredHome: boolean;
  newArrival: boolean;
  bestSeller: boolean;
};

export type Style = {
  id: string;
  name: string;
  description?: string;
  productCount: number;
};
