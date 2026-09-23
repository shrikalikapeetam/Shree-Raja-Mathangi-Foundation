import { getPublicPages } from "@/lib/pages";
import { isIndexable, pageSEO, siteName, siteDescription } from "@/lib/seo";

export const revalidate = 300;
const plain = (value: string) => value.replace(/[\r\n\[\]<>]/g, " ");
export async function GET() {
  if (!isIndexable)
    return new Response("Not available on this environment.\n", {
      status: 404,
      headers: {
        "X-Robots-Tag": "noindex",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  const pages = await getPublicPages();
  const links = pages.map((page) => {
    const { title, description, url } = pageSEO(page);
    return `- [${plain(title)}](${url}): ${plain(description)}`;
  });
  return new Response(
    [
      `# ${siteName}`,
      "",
      `> ${siteDescription}`,
      "",
      "## Published pages",
      "",
      ...links,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
