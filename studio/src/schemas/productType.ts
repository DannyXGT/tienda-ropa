import { defineArrayMember, defineField, defineType } from "sanity";

const sizeOptions = ["XS", "S", "M", "L", "XL"];

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceBase",
      title: "Base price",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredHome",
      title: "Featured on home",
      type: "boolean",
      initialValue: false,
      description: "Seccion principal de recomendados en portada.",
    }),
    defineField({
      name: "newArrival",
      title: "New arrival",
      type: "boolean",
      initialValue: false,
      description: "Aparece en la seccion Nuevos en portada.",
    }),
    defineField({
      name: "bestSeller",
      title: "Best seller",
      type: "boolean",
      initialValue: false,
      description: "Aparece en la seccion Mas pedidos en portada.",
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "colorVariant",
          title: "Color",
          type: "object",
          fields: [
            defineField({
              name: "colorName",
              title: "Color name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "colorHex",
              title: "Color HEX",
              type: "string",
              description: "Opcional. Ejemplo: #111827",
            }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              validation: (rule) => rule.required().min(1),
              of: [
                defineArrayMember({
                  type: "image",
                  options: { hotspot: true },
                }),
              ],
            }),
            defineField({
              name: "sizes",
              title: "Sizes",
              type: "array",
              validation: (rule) => rule.required().min(1),
              of: [
                defineArrayMember({
                  name: "sizeOption",
                  title: "Size",
                  type: "object",
                  fields: [
                    defineField({
                      name: "size",
                      title: "Size",
                      type: "string",
                      options: {
                        list: sizeOptions.map((size) => ({ title: size, value: size })),
                        layout: "radio",
                      },
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "priceOverride",
                      title: "Price override",
                      type: "number",
                      validation: (rule) => rule.min(0),
                    }),
                    defineField({
                      name: "active",
                      title: "Active",
                      type: "boolean",
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: {
                      size: "size",
                      active: "active",
                    },
                    prepare({ size, active }) {
                      return {
                        title: size ?? "N/A",
                        subtitle: active ? "Active" : "Inactive",
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "colorName",
              media: "images.0",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      published: "published",
      featuredHome: "featuredHome",
      newArrival: "newArrival",
      bestSeller: "bestSeller",
    },
    prepare({ title, category, published, featuredHome, newArrival, bestSeller }) {
      const visibility = published ? "Publicado" : "No publicado";
      const tags = [
        featuredHome ? "Home" : null,
        newArrival ? "Nuevo" : null,
        bestSeller ? "Mas pedidos" : null,
      ].filter(Boolean);
      const labels = tags.length ? ` | ${tags.join(", ")}` : "";
      return {
        title: title ?? "Sin titulo",
        subtitle: `${category ?? "Sin categoria"} - ${visibility}${labels}`,
      };
    },
  },
});
