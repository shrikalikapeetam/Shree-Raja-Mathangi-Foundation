import type { MetadataRoute } from "next";
import { siteName, siteDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "Mathangi Foundation",
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "en-IN",
    background_color: "#fffdfa",
    theme_color: "#132e73",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
