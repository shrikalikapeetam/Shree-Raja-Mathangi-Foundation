/** Add the trustee section without replacing existing homepage content.
 * node --env-file=.env.local scripts/prismic/sync-trust-members.mjs [--apply]
 * --apply uploads the scoped model/assets and saves a migration draft.
 */
import fs from "node:fs/promises";
import { createClient } from "@prismicio/client";

const apply = process.argv.includes("--apply");
const config = JSON.parse(await fs.readFile("slicemachine.config.json", "utf8"));
const repository = config.repositoryName;
const token = process.env.PRISMIC_WRITE_TOKEN;
const directory = ".slicemachine/trust-members-migration";
await fs.mkdir(directory, { recursive: true });
const save = (name, value) => fs.writeFile(`${directory}/${name}.json`, JSON.stringify(value, null, 2));
const client = createClient(repository, { accessToken: process.env.PRISMIC_ACCESS_TOKEN });
const homepage = await client.getByUID("page", "homepage");
if (homepage.data.slices.some((slice) => slice.slice_type === "trust_members")) {
  console.log("Homepage already has Trust Members; no content overwritten.");
  process.exit(0);
}
const people = [
  { slug: "narayanan", name: "Shri. S. Narayanan", title: "Managing Trustee", description: "Agribusiness professional" },
  { slug: "kannan", name: "Shri. R. Kannan", title: "Trustee", description: "Entrepreneur in industrial solutions" },
  { slug: "srikirishnan", name: "Shri. Srikirishnan R", title: "Trustee", description: "IT business development professional" },
  { slug: "sujatha", name: "Smt. K. Sujatha", title: "Trustee", description: "Finance professional" },
];
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { repository, Authorization: `Bearer ${token}`, ...options.headers } });
  if (!response.ok) throw new Error(`${options.method || "GET"} ${new URL(url).pathname}: HTTP ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
const post = (url, value) => request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
let assets = {};
try { assets = JSON.parse(await fs.readFile(`${directory}/assets.json`, "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
if (apply) {
  if (!token) throw new Error("PRISMIC_WRITE_TOKEN is required.");
  const model = JSON.parse(await fs.readFile("src/slices/TrustMembers/model.json", "utf8"));
  const pageModel = await request("https://customtypes.prismic.io/customtypes/page");
  const remoteSlices = await request("https://customtypes.prismic.io/slices");
  await save("page-model.before", pageModel);
  const existing = remoteSlices.find((slice) => slice.id === model.id);
  if (existing) await save("slice-model.before", existing);
  await post(`https://customtypes.prismic.io/slices/${existing ? "update" : "insert"}`, model);
  const zone = pageModel.json.Main?.slices;
  if (zone?.type !== "Slices") throw new Error("Unexpected Page slice zone; aborting.");
  zone.config.choices.trust_members = { type: "SharedSlice" };
  await post("https://customtypes.prismic.io/customtypes/update", pageModel);
  for (const person of people) {
    if (assets[person.slug]) continue;
    const body = new FormData();
    body.append("file", new Blob([await fs.readFile(`public/images/trustees/${person.slug}-illustrative.png`)], { type: "image/png" }), `${person.slug}-illustrative.png`);
    body.append("alt", `Illustrative portrait placeholder for ${person.name}; not an actual trustee photograph`);
    body.append("notes", "AI-generated fictional portrait placeholder. Replace with the actual trustee photograph.");
    const asset = await request("https://asset-api.prismic.io/assets", { method: "POST", body });
    if (!asset.id || !asset.url || !asset.width || !asset.height) throw new Error("Incomplete image upload response.");
    assets[person.slug] = asset;
    await save("assets", assets);
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }
}
const richText = (text, type = "paragraph") => [{ type, text, spans: [] }];
const slice = {
  slice_type: "trust_members", slice_label: null, variation: "default", version: "initial", items: [],
  primary: {
    anchor_id: "trustees", pre_title: "Our trustees", title: richText("Members of the Trust", "heading2"),
    description: richText("Dedicated to service. Guided by experience."),
    image_caption: "Illustrative portraits — replace with actual trustee photographs.",
    members: people.map((person) => {
      const asset = assets[person.slug];
      return {
        profile_image: {
          id: asset?.id || person.slug,
          url: asset?.url || `/images/trustees/${person.slug}-illustrative.png`,
          dimensions: { width: asset?.width || 1254, height: asset?.height || 1254 },
          alt: `Illustrative portrait placeholder for ${person.name}; not an actual trustee photograph`, copyright: null,
        },
        name: person.name, title: person.title, description: richText(person.description), place: "Chennai",
      };
    }),
  },
};
const slices = [...homepage.data.slices];
// Place the section just before any contact section, otherwise at the end.
const contactIndex = slices.findIndex((item) => item.slice_type === "contact_inquiry");
slices.splice(contactIndex < 0 ? slices.length : contactIndex, 0, slice);
const payload = { title: "Homepage", uid: homepage.uid, tags: homepage.tags, data: { ...homepage.data, slices } };
await save("homepage.before", homepage);
await save("homepage.prepared", payload);
await fs.writeFile("src/slices/TrustMembers/mocks.json", JSON.stringify([slice], null, 2) + "\n");
console.log(`Prepared 4 trustees; preserved all ${homepage.data.slices.length} existing slices. Homepage: ${homepage.id}`);
if (apply) {
  const latest = await client.getByUID("page", "homepage");
  if (latest.last_publication_date !== homepage.last_publication_date) throw new Error("Homepage changed; rerun to merge latest content.");
  await request(`https://migration.prismic.io/documents/${homepage.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  console.log("Saved homepage draft in Prismic Migration release. Publish the reviewed Homepage document in the editor.");
}
