import type { Metadata } from "next";
import { asImageSrc, asText, type Content } from "@prismicio/client";

export const siteName = "Shree Raja Mathangi Foundation";
export const siteDescription =
  "Supporting cow care, Vedic education and temple preservation to protect India's spiritual and cultural heritage for future generations.";

const configuredURL = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const origin = new URL(configuredURL || "http://localhost:3000");
if (
  !["http:", "https:"].includes(origin.protocol) ||
  origin.username ||
  origin.password ||
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash
) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be an absolute website origin, such as https://your-domain.org.",
  );
}
export const siteURL = origin.origin;
export const isIndexable =
  Boolean(configuredURL) &&
  process.env.NODE_ENV === "production" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
export const absoluteURL = (path: string) =>
  new URL(path, `${siteURL}/`).toString();
export const pagePath = (uid: string) =>
  uid === "homepage" ? "/" : `/${encodeURIComponent(uid)}`;

const descriptions: Record<string, string> = {
  homepage: siteDescription,
  about:
    "Learn about Shree Raja Mathangi Foundation and its commitment to cow welfare, authentic Vedic learning and the preservation of India's sacred heritage.",
  contact:
    "Contact Shree Raja Mathangi Foundation to support cow care, Vedic education and temple preservation through donations, sponsorship or volunteering.",
};

export function pageSEO(page: Content.PageDocument) {
  const title =
    page.data.meta_title?.trim() ||
    (page.uid === "homepage"
      ? siteName
      : `${asText(page.data.title) || page.uid} | ${siteName}`);
  const description =
    page.data.meta_description?.trim() ||
    descriptions[page.uid] ||
    page.data.slices
      .flatMap((slice) => {
        if (slice.slice_type !== "hero") return [];
        return slice.primary.content
          .filter((block) => block.type === "paragraph")
          .map((block) => ("text" in block ? block.text : ""));
      })
      .join(" ")
      .slice(0, 160) ||
    siteDescription;
  return { title, description, url: absoluteURL(pagePath(page.uid)) };
}

export function pageMetadata(
  page: Content.PageDocument,
  preview = false,
): Metadata {
  const { title, description, url } = pageSEO(page);
  const socialTitle = page.data.og_title?.trim() || title;
  const socialDescription = page.data.og_description?.trim() || description;
  const imageField = asImageSrc(page.data.og_image)
    ? page.data.og_image
    : page.data.meta_image;
  const image =
    asImageSrc(imageField) || absoluteURL("/images/social-card.png");
  const index = isIndexable && !preview && !page.data.noindex;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: {
      index,
      follow: !preview,
      googleBot: {
        index,
        follow: !preview,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName,
      title: socialTitle,
      description: socialDescription,
      url,
      images: [
        {
          url: image,
          alt: imageField.alt || siteName,
          ...(imageField.dimensions
            ? {
                width: imageField.dimensions.width,
                height: imageField.dimensions.height,
              }
            : { width: 1200, height: 630 }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: image, alt: imageField.alt || siteName }],
    },
  };
}

export function pageSchema(page: Content.PageDocument) {
  const { title, description, url } = pageSEO(page);
  const type =
    page.data.schema_type ||
    (page.uid === "about"
      ? "AboutPage"
      : page.uid === "contact"
        ? "ContactPage"
        : "WebPage");
  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteURL("/") },
  ];
  if (page.uid !== "homepage")
    breadcrumbs.push({
      "@type": "ListItem",
      position: 2,
      name: asText(page.data.title) || title,
      item: url,
    });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "en-IN",
        datePublished: page.first_publication_date,
        dateModified: page.last_publication_date,
        isPartOf: { "@id": absoluteURL("/#website") },
        about: { "@id": absoluteURL("/#organization") },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbs,
      },
    ],
  };
}
