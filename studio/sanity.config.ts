import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/schemas";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.VITE_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.VITE_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "Falta SANITY_STUDIO_PROJECT_ID (o VITE_SANITY_PROJECT_ID) en studio/.env"
  );
}

export default defineConfig({
  name: "default",
  title: "bea millis admin",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
