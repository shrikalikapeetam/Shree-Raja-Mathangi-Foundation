import { NotFoundError } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";
import { getPageByUID } from "@/prismicio";
import { components } from "@/slices";

export default async function Home() {
  let page;
  try {
    page = await getPageByUID("homepage");
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
  if (!page) notFound();

  return (
    <main>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
