import type { MetadataRoute } from "next";
import { getPublicPages } from "@/lib/pages";
import { absoluteURL, isIndexable, pagePath } from "@/lib/seo";

export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable) return [];
  return (await getPublicPages()).map((page) => ({
    url: absoluteURL(pagePath(page.uid)),
    lastModified: page.last_publication_date,
  }));
}
