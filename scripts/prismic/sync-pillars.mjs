/**
 * Run with: node --env-file=.env.local scripts/prismic/sync-pillars.mjs
 * Add --apply to upload assets/models and save the homepage as a Prismic draft.
 * Existing homepage fields, tags, and slices are preserved.
 */
import { withSEODefaults } from "./seo-content.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@prismicio/client";
import { createPillarSlices, pillarImages } from "./pillar-content.mjs";

const apply = process.argv.includes("--apply");
const config = JSON.parse(
  await fs.readFile(
    new URL("../../slicemachine.config.json", import.meta.url),
    "utf8",
  ),
);
const repository =
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME || config.repositoryName;
const token = process.env.PRISMIC_WRITE_TOKEN;
const output = path.resolve(".slicemachine/pillar-migration");
await fs.mkdir(output, { recursive: true });
const client = createClient(repository, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
const homepage = await client.getByUID("page", "homepage");
const contact = await client.getByUID("page", "contact");
const model = JSON.parse(
  await fs.readFile("src/slices/PillarFeature/model.json", "utf8"),
);

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      repository,
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const body = await response.text();
  if (!response.ok)
    throw new Error(
      `${options.method || "GET"} ${new URL(url).pathname}: ${response.status} ${body.slice(0, 600)}`,
    );
  return body ? JSON.parse(body) : null;
}
const post = (url, data) =>
  request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
const pause = () => new Promise((resolve) => setTimeout(resolve, 1100));
const save = (name, value) =>
  fs.writeFile(path.join(output, name), JSON.stringify(value, null, 2) + "\n");

const images = Object.fromEntries(
  pillarImages.map((image) => [
    image.name,
    {
      id: image.name,
      url: `/images/pillars/${image.name}.png`,
      alt: image.alt,
      dimensions: { width: 1536, height: 1024 },
      copyright: null,
    },
  ]),
);

if (apply) {
  if (!token)
    throw new Error("PRISMIC_WRITE_TOKEN must be configured in .env.local.");
  const pageModel = await request(
    "https://customtypes.prismic.io/customtypes/page",
  );
  const remoteSlices = await request("https://customtypes.prismic.io/slices");
  await save("page-model.before.json", pageModel);
  const existing = remoteSlices.find((slice) => slice.id === model.id);
  if (existing) await save("slice-model.before.json", existing);
  const zone = Object.values(pageModel.json)
    .flatMap(Object.values)
    .find((field) => field.type === "Slices" && field.config?.choices?.hero);
  if (!zone)
    throw new Error("Could not safely identify the homepage slice zone.");
  await post(
    `https://customtypes.prismic.io/slices/${existing ? "update" : "insert"}`,
    model,
  );
  zone.config.choices.pillar_feature = { type: "SharedSlice" };
  const localPageModel = JSON.parse(
    await fs.readFile("customtypes/page/index.json", "utf8"),
  );
  const existingFields = new Set(
    Object.values(pageModel.json).flatMap((tab) => Object.keys(tab)),
  );
  pageModel.json["SEO & Metadata"] ||= {};
  for (const [key, field] of Object.entries(
    localPageModel.json["SEO & Metadata"],
  )) {
    if (!existingFields.has(key)) pageModel.json["SEO & Metadata"][key] = field;
  }
  await post("https://customtypes.prismic.io/customtypes/update", pageModel);

  let manifest = {};
  try {
    manifest = JSON.parse(
      await fs.readFile(path.join(output, "assets.json"), "utf8"),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  for (const image of pillarImages) {
    if (!manifest[image.name]) {
      const body = new FormData();
      body.append(
        "file",
        new Blob([await fs.readFile(image.path)], { type: "image/png" }),
        `pillar-${image.name}.png`,
      );
      body.append("alt", image.alt);
      body.append(
        "notes",
        "AI-generated illustrative image for the Three Pillars section. Replace with an authentic project photograph when available.",
      );
      const asset = await request("https://asset-api.prismic.io/assets", {
        method: "POST",
        body,
      });
      if (!asset.id || !asset.url)
        throw new Error(
          `Asset upload did not return an ID and URL for ${image.name}.`,
        );
      manifest[image.name] = asset;
      await save("assets.json", manifest);
      await pause();
    }
    const asset = manifest[image.name];
    images[image.name] = {
      id: asset.id,
      url: asset.url,
      alt: image.alt,
      dimensions: { width: asset.width, height: asset.height },
      copyright: null,
    };
  }
}

const pillars = createPillarSlices(images, contact.id);
const slices = homepage.data.slices.filter(
  (slice) => slice.slice_type !== "pillar_feature",
);
const heroIndex = slices.findIndex((slice) => slice.slice_type === "hero");
slices.splice(heroIndex < 0 ? 0 : heroIndex + 1, 0, ...pillars);
const payload = {
  title: "Homepage",
  uid: homepage.uid,
  tags: homepage.tags,
  data: withSEODefaults("homepage", { ...homepage.data, slices }),
};
await save("homepage.before.json", homepage);
await save("homepage.prepared.json", payload);
console.log(
  `Prepared ${pillars.length} pillar slices; preserved ${homepage.data.slices.filter((slice) => slice.slice_type !== "pillar_feature").length} existing slices.`,
);

if (apply) {
  const current = await client.getByUID("page", "homepage");
  if (current.last_publication_date !== homepage.last_publication_date)
    throw new Error(
      "Homepage changed while preparing this update. Re-run to merge the latest version.",
    );
  await pause();
  const result = await request(
    `https://migration.prismic.io/documents/${homepage.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  await save("migration-result.json", result);
  console.log(
    "Pillar model and images uploaded. Homepage content saved to Prismic's migration release for review and publication.",
  );
} else {
  console.log(
    "Preview only. No Prismic models, assets, or documents changed. Use --apply after reviewing the prepared content.",
  );
}
