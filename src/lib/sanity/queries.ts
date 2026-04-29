const PRODUCT_PROJECTION = `
  _id,
  "slug": slug.current,
  "name": title,
  description,
  "category": category,
  priceBase,
  published,
  featuredHome,
  newArrival,
  bestSeller,
  "createdAt": coalesce(createdAt, _createdAt),
  "variants": colors[]{
    _key,
    colorName,
    "hex": colorHex,
    "images": images[].asset->url,
    "sizes": sizes[]{
      _key,
      size,
      priceOverride,
      active
    }
  }
`;

export const PUBLISHED_PRODUCTS_QUERY = `
  *[_type == "product" && published == true]
    | order(coalesce(createdAt, _createdAt) desc) {
      ${PRODUCT_PROJECTION}
    }
`;

export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && published == true && slug.current == $slug][0] {
    ${PRODUCT_PROJECTION}
  }
`;

export const HOME_GALLERY_QUERY = `
  *[_type == "homeGallery" && enabled == true]
    | order(_createdAt desc)[0] {
      "images": images[].asset->url
    }
`;
