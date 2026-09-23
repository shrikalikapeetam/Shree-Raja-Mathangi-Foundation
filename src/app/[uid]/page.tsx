import { SliceZone } from "@prismicio/react";
import { draftMode } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { getPage } from "@/lib/pages";
import { pageMetadata, pageSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { components } from "@/slices";

export async function generateMetadata({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  if (uid === "homepage") permanentRedirect("/");
  const [page, { isEnabled }] = await Promise.all([getPage(uid), draftMode()]);
  return pageMetadata(page, isEnabled);
}

export default async function Page({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  if (uid === "homepage") permanentRedirect("/");
  const page = await getPage(uid);
  return (
    <main id="main-content" className="min-h-screen">
      <JsonLd data={pageSchema(page)} />
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
