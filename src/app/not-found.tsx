import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="container section-py flex min-h-[60vh] flex-col items-center justify-center gap-5 pt-40 text-center"
    >
      <h1 className="text-foundation-ink">Page not found</h1>
      <p>This page may have moved or is no longer available.</p>
      <Link href="/" className="font-semibold underline">
        Return to the homepage
      </Link>
    </main>
  );
}
