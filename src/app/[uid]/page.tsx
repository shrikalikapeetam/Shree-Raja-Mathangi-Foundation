import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { asImageSrc, asText, NotFoundError } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { getPageByUID } from "@/prismicio";
import { components } from "@/slices";

const getPage = cache(async (uid: string) => {
  try {
    const page = await getPageByUID(uid);
    if (!page) notFound();
    return page;
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PageProps<"/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const page = await getPage(uid);
  const title =
    page.data.meta_title ||
    asText(page.data.title) ||
    "Shree Raja Mathangi Foundation";
  const description = page.data.meta_description || undefined;
  const image = asImageSrc(page.data.meta_image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image
        ? { images: [{ url: image, alt: page.data.meta_image.alt || title }] }
        : {}),
    },
  };
}

export default async function Page({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  const page = await getPage(uid);

  return (
    <main className="min-h-screen">
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
