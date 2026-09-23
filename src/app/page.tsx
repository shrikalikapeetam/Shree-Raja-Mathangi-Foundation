import { SliceZone } from "@prismicio/react";
import { draftMode } from "next/headers";
import { getPage } from "@/lib/pages";
import { pageMetadata, pageSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { components } from "@/slices/server";

export async function generateMetadata() {
  const [page, { isEnabled }] = await Promise.all([
    getPage("homepage"),
    draftMode(),
  ]);
  return pageMetadata(page, isEnabled);
}

export default async function Home() {
  const page = await getPage("homepage");
  return (
    <main id="main-content">
      <JsonLd data={pageSchema(page)} />
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
