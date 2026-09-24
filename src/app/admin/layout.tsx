import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import AdminSignOut from "@/components/AdminSignOut";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Foundation admin",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <main id="main-content" className="min-h-screen bg-legacy-surface py-24">
      <div className="container">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-foundation-accent">
              Shree Raja Mathangi Foundation
            </p>
            <h1 className="mt-2 text-3xl text-foundation-ink">Admin panel</h1>
            <p className="mt-2 text-sm">{admin.email}</p>
          </div>
          <AdminSignOut />
        </header>
        <div className="grid gap-6 lg:grid-cols-[210px_1fr]">
          <nav
            aria-label="Admin navigation"
            className="flex flex-wrap gap-2 self-start rounded-2xl border bg-white p-4 lg:flex-col"
          >
            {[
              ["/admin", "Overview"],
              ["/admin/donations", "Donation pledges"],
              ["/admin/contact-messages", "Contact inquiries"],
              ["/admin/activity", "Activity log"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-3 font-medium text-foundation-ink hover:bg-legacy-surface"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
