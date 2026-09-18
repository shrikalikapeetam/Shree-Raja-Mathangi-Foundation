import { readFile } from "node:fs/promises";
import { createClient } from "@prismicio/client";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const config = JSON.parse(
  await readFile(new URL("../slicemachine.config.json", import.meta.url), "utf8"),
);
const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME || config.repositoryName;
const client = createClient(repositoryName, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});

try {
  const repository = await client.getRepository();
  const documents = await client.get({ pageSize: 1 });
  console.log(`Connected to Prismic: ${repositoryName}`);
  console.log(`Content types: ${Object.keys(repository.types).join(", ") || "none"}`);
  console.log(`Published documents: ${documents.total_results_size}`);
} catch (error) {
  // Request URLs can contain a private read token; do not print them.
  console.error("Prismic connection failed. Check the repository name, network, and read access token.");
  console.error(`Error type: ${error instanceof Error ? error.name : "Unknown"}`);
  process.exitCode = 1;
}
