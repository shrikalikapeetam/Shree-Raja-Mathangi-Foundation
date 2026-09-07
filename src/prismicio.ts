import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ?? "your-repository-name";

export function createClient(config: prismic.ClientConfig = {}) {
  const client = prismic.createClient(repositoryName, config);

  enableAutoPreviews({ client });

  return client;
}