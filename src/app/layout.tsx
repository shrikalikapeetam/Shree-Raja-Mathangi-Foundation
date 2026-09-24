import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Cinzel, Geist } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { getLayout, repositoryName } from "@/prismicio";
import "./globals.css";
import { draftMode } from "next/headers";
import { asImageSrc } from "@prismicio/client";
import JsonLd from "@/components/JsonLd";
import { Toaster } from "@/components/ui/toast";
import {
  siteName,
  siteDescription,
  siteURL,
  absoluteURL,
  isIndexable,
} from "@/lib/seo";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  robots: { index: isIndexable, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: siteName, capable: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#132e73" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [layout, { isEnabled }] = await Promise.all([getLayout(), draftMode()]);
  const name = layout
    ? [layout.data.trust_name, layout.data.trust_name2]
        .filter(Boolean)
        .join(" ") || siteName
    : siteName;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": absoluteURL("/#organization"),
        name,
        url: absoluteURL("/"),
        description: siteDescription,
        ...(layout && asImageSrc(layout.data.logo)
          ? { logo: asImageSrc(layout.data.logo) }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": absoluteURL("/#website"),
        name,
        url: absoluteURL("/"),
        inLanguage: "en-IN",
        publisher: { "@id": absoluteURL("/#organization") },
      },
    ],
  };
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cinzel.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-white focus:p-4 focus:text-foundation-ink"
        >
          Skip to main content
        </a>
        <JsonLd data={schema} />
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
        {isEnabled && <PrismicPreview repositoryName={repositoryName} />}
      </body>
    </html>
  );
}
