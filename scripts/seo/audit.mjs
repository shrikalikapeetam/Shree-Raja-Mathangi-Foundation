import fs from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import * as chromeLauncher from "chrome-launcher";

const base = (process.env.AUDIT_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const output = path.resolve(process.env.AUDIT_OUTPUT || "reports/lighthouse");
await fs.mkdir(output, { recursive: true });
const sitemap = await fetch(base + "/sitemap.xml").then((r) => {
  if (!r.ok) throw new Error("Sitemap could not be fetched");
  return r.text();
});
const paths = [
  ...new Set(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    ),
  ),
];
if (!paths.length)
  throw new Error(
    "No indexable sitemap pages. Configure NEXT_PUBLIC_SITE_URL for the production build.",
  );
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--disable-gpu"],
  ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
});
const summary = [];
try {
  for (const pathname of paths) {
    for (const device of ["mobile", "desktop"]) {
      const url = base + pathname;
      console.log("Auditing", device, url);
      const result = await lighthouse(
        url,
        { port: chrome.port, output: ["html", "json"], logLevel: "error" },
        device === "desktop" ? desktopConfig : undefined,
      );
      if (!result || result.lhr.runtimeError)
        throw new Error(
          JSON.stringify(result?.lhr.runtimeError || "No report"),
        );
      const name =
        (pathname === "/" ? "home" : pathname.slice(1).replaceAll("/", "-")) +
        "-" +
        device;
      await fs.writeFile(path.join(output, name + ".html"), result.report[0]);
      await fs.writeFile(path.join(output, name + ".json"), result.report[1]);
      const entry = {
        path: pathname,
        device,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, category]) => [
            key,
            Math.round(category.score * 100),
          ]),
        ),
        failures: Object.values(result.lhr.audits)
          .filter(
            (audit) =>
              audit.score !== null &&
              audit.score < 1 &&
              !["informative", "manual", "notApplicable"].includes(
                audit.scoreDisplayMode,
              ),
          )
          .map((audit) => ({
            id: audit.id,
            title: audit.title,
            value: audit.displayValue,
          })),
      };
      summary.push(entry);
      await fs.writeFile(
        path.join(output, "summary.json"),
        JSON.stringify(summary, null, 2),
      );
      console.log(JSON.stringify(entry));
    }
  }
} finally {
  await chrome.kill();
}
