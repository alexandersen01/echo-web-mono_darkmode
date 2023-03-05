import {env} from "@/env.mjs";
import {createClient} from "next-sanity";

export const sanityClient = createClient({
  projectId: "pgq2pd26",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});
