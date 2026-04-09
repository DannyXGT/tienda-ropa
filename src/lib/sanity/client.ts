import { createClient } from "@sanity/client";

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET;

export const sanityClient =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2025-01-01",
        useCdn: true,
        perspective: "published",
      })
    : null;
