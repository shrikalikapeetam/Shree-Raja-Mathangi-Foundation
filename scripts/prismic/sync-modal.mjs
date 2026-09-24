/** Prepare the Layout Modal update. --apply saves a migration draft; it never publishes. */
import fs from "node:fs/promises";
import { createClient } from "@prismicio/client";
import { modalContent } from "./modal-content.mjs";
const config = JSON.parse(await fs.readFile("slicemachine.config.json", "utf8"));
const repository = process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME || config.repositoryName;
const client = createClient(repository, { accessToken: process.env.PRISMIC_ACCESS_TOKEN });
const layout = await client.getSingle("layout");
const directory = ".slicemachine/modal-migration";
await fs.mkdir(directory, { recursive: true });
const data = { ...layout.data };
// Preserve any content already entered by an editor.
for (const [key, value] of Object.entries(modalContent)) {
  const existing = data[key];
  if (existing == null || existing === "" || (Array.isArray(existing) && !existing.length)) data[key] = value;
}
const payload = { title: "Layout", data, tags: layout.tags };
await fs.writeFile(`${directory}/layout.before.json`, JSON.stringify(layout, null, 2));
await fs.writeFile(`${directory}/layout.prepared.json`, JSON.stringify(payload, null, 2));
console.log(`Prepared Modal content for Layout ${layout.id}.`);
if (process.argv.includes("--apply")) {
  if (!process.env.PRISMIC_WRITE_TOKEN) throw new Error("PRISMIC_WRITE_TOKEN is required");
  const latest = await client.getByID(layout.id);
  if (latest.last_publication_date !== layout.last_publication_date) throw new Error("Layout changed; prepare the update again.");
  const response = await fetch(`https://migration.prismic.io/documents/${layout.id}`, {
    method: "PUT",
    headers: { repository, Authorization: `Bearer ${process.env.PRISMIC_WRITE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Prismic migration returned HTTP ${response.status}`);
  console.log("Saved to the migration release. Review the Layout draft before publishing.");
}
