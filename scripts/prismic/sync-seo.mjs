/** Dry run by default; --apply updates model fields and saves content to the migration release. Does not publish. */
import { withSEODefaults } from "./seo-content.mjs";
import fs from "node:fs/promises";
import { createClient } from "@prismicio/client";

const apply = process.argv.includes("--apply");
const config = JSON.parse(
  await fs.readFile("slicemachine.config.json", "utf8"),
);
const repository =
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME || config.repositoryName;
const token = process.env.PRISMIC_WRITE_TOKEN;
const client = createClient(repository, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
const pages = await client.getAllByType("page");
const out = ".slicemachine/seo-migration";
await fs.mkdir(out, { recursive: true });
async function request(url, method = "GET", body) {
  const response = await fetch(url, {
    method,
    headers: {
      repository,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok)
    throw new Error(
      `${method} ${new URL(url).pathname}: HTTP ${response.status}`,
    );
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
const local = JSON.parse(
  await fs.readFile("customtypes/page/index.json", "utf8"),
);
await fs.writeFile(
  `${out}/seo-model-fields.json`,
  JSON.stringify(local.json["SEO & Metadata"], null, 2),
);
if (apply) {
  if (!token) throw new Error("PRISMIC_WRITE_TOKEN is required.");
  const remote = await request(
    "https://customtypes.prismic.io/customtypes/page",
  );
  await fs.writeFile(
    `${out}/page-model.before.json`,
    JSON.stringify(remote, null, 2),
  );
  // Merge only missing SEO fields; preserve remote tabs and existing field definitions.
  const existing = new Set(
    Object.values(remote.json).flatMap((tab) => Object.keys(tab)),
  );
  remote.json["SEO & Metadata"] ||= {};
  for (const [key, field] of Object.entries(local.json["SEO & Metadata"])) {
    if (!existing.has(key)) remote.json["SEO & Metadata"][key] = field;
  }
  await request(
    "https://customtypes.prismic.io/customtypes/update",
    "POST",
    remote,
  );
}
for (const page of pages) {
  if (page.uid === "homepage" && process.argv.includes("--skip-homepage"))
    continue;
  const data = withSEODefaults(page.uid, page.data);
  const body = { title: data.meta_title, uid: page.uid, data, tags: page.tags };
  await fs.writeFile(
    `${out}/${page.uid}.before.json`,
    JSON.stringify(page, null, 2),
  );
  await fs.writeFile(
    `${out}/${page.uid}.prepared.json`,
    JSON.stringify(body, null, 2),
  );
  if (apply) {
    const latest = await client.getByID(page.id);
    if (latest.last_publication_date !== page.last_publication_date)
      throw new Error(`${page.uid} changed; rerun to preserve recent edits.`);
    await request(
      `https://migration.prismic.io/documents/${page.id}`,
      "PUT",
      body,
    );
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }
  console.log(`${apply ? "Saved draft" : "Prepared"}: ${page.uid}`);
}
