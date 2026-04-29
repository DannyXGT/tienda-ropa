import { defineArrayMember, defineField, defineType } from "sanity";

export const homeGalleryType = defineType({
  name: "homeGallery",
  title: "Fotos de portada",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titulo interno",
      type: "string",
      initialValue: "Portada principal",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "enabled",
      title: "Usar en portada",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "images",
      title: "Fotos",
      type: "array",
      description: "Sube hasta 10 fotos. La tienda usa el documento activo mas reciente.",
      validation: (rule) => rule.required().min(1).max(10),
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      enabled: "enabled",
      media: "images.0",
    },
    prepare({ title, enabled, media }) {
      return {
        title: title ?? "Fotos de portada",
        subtitle: enabled ? "Activo en portada" : "Inactivo",
        media,
      };
    },
  },
});
