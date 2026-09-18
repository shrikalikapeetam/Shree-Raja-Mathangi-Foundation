import type { Metadata } from "next";
import { Cinzel, Geist } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import "./globals.css";

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
  title: "Shree Raja Mathangi Foundation",
  description: "A Prismic-powered foundation website.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
