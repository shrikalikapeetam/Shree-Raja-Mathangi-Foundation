import assert from "node:assert/strict";
const base = (process.env.AUDIT_BASE_URL || "http://localhost:3100").replace(
  /\/$/,
  "",
);
const get = (path, options = {}) =>
  fetch(base + path, { headers: { "User-Agent": "Googlebot" }, ...options });
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert.ok(urls.length > 0);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
const descriptions = new Set();
for (const url of urls) {
  const route = new URL(url).pathname;
  const response = await get(route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  assert.ok(title && description, route + ": metadata");
  assert.ok(!titles.has(title), route + ": unique title");
  assert.ok(!descriptions.has(description), route + ": unique description");
  titles.add(title);
  descriptions.add(description);
  assert.equal(
    new URL(html.match(/rel="canonical" href="([^"]+)"/)?.[1]).href,
    new URL(url).href,
    route + ": canonical",
  );
  for (const property of ["og:title", "og:description", "og:url", "og:image"])
    assert.ok(html.includes(`property="${property}"`), route + ": " + property);
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    route + ": one main heading",
  );
  const graphs = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ].flatMap((m) => JSON.parse(m[1])["@graph"] || []);
  for (const type of ["NGO", "WebSite", "BreadcrumbList"])
    assert.ok(
      graphs.some((g) => g["@type"] === type),
      route + ": " + type,
    );
  assert.ok(
    graphs.some((g) => g["@id"] === url + "#webpage"),
    route + ": page schema",
  );
  const internal = [...html.matchAll(/<a\s[^>]*href="([^"#?]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith("/") && !h.startsWith("//"));
  for (const href of new Set(internal))
    assert.ok((await get(href)).ok, route + ": link " + href);
  console.log("PASS", route, "metadata, schema, heading, internal links");
}
const robots = await get("/robots.txt").then((r) => r.text());
assert.ok(
  robots.includes("Allow: /") &&
    robots.includes("Disallow: /api/") &&
    robots.includes("/sitemap.xml"),
);
const llms = await get("/llms.txt").then((r) => r.text());
for (const url of urls) assert.ok(llms.includes(url), "llms published page");
const manifest = await get("/manifest.webmanifest").then((r) => r.json());
for (const icon of manifest.icons) assert.ok((await get(icon.src)).ok);
for (const path of [
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
  "/images/social-card.png",
])
  assert.ok((await get(path)).ok, path);
const redirect = await get("/homepage", { redirect: "manual" });
assert.equal(redirect.status, 308);
assert.equal(redirect.headers.get("location"), "/");
const missing = await get("/seo-verification-page-does-not-exist");
assert.equal(missing.status, 404);
assert.ok((await missing.text()).includes('name="robots" content="noindex"'));
const simulator = await get("/slice-simulator").then((r) => r.text());
assert.ok(simulator.includes("noindex"));
console.log(
  "PASS sitemap, robots, llms, manifest, icons, social image, redirect, 404, simulator noindex",
);
