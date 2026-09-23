import { cache } from "react";
import { createClient, NotFoundError } from "@prismicio/client";
import { notFound } from "next/navigation";
import { getPageByUID, repositoryName } from "@/prismicio";

export const getPage = cache(async (uid: string) => {
  try {
    const page = await getPageByUID(uid);
    if (!page) notFound();
    return page;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
});

// Crawler feeds must always use published content, never a preview cookie.
export const getPublicPages = cache(async () => {
  const client = createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    fetchOptions: { next: { revalidate: 300, tags: ["prismic"] } },
  });
  const pages = await client.getAllByType("page");
  return pages
    .filter((page) => page.uid && !page.data.noindex)
    .sort((a, b) => a.uid.localeCompare(b.uid));
});
