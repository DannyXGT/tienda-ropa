import { createClient } from "@sanity/client";

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET;
const validProjectId = typeof projectId === "string" && /^[a-z0-9-]+$/.test(projectId);
const validDataset = typeof dataset === "string" && /^[a-z0-9_-]+$/.test(dataset);
const normalizedProjectId = validProjectId ? projectId : null;
const normalizedDataset = validDataset ? dataset : null;

export const sanityClient =
  normalizedProjectId && normalizedDataset
    ? createClient({
        projectId: normalizedProjectId,
        dataset: normalizedDataset,
        apiVersion: "2025-01-01",
        useCdn: true,
        perspective: "published",
      })
    : null;
