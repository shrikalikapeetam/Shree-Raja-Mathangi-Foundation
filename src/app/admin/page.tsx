import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/db";
import { donations, contactMessages } from "@/db/schema";
export default async function AdminPage() {
  await requireAdmin();
  const db = getDb();
  const [[pledges], [contacts], [newPledges], [newContacts]] =
    await Promise.all([
      db.select({ value: count() }).from(donations),
      db.select({ value: count() }).from(contactMessages),
      db
        .select({ value: count() })
        .from(donations)
        .where(eq(donations.status, "new")),
      db
        .select({ value: count() })
        .from(contactMessages)
        .where(eq(contactMessages.status, "new")),
    ]);
  return (
    <>
      <section className="rounded-2xl bg-foundation-ink p-8 text-white">
        <p className="text-sm uppercase tracking-widest text-foundation-gold">
          Foundation activity
        </p>
        <h2 className="mt-3 text-3xl">Every act of seva, in one place.</h2>
        <p className="mt-3 text-white/80">
          Review supporter pledges, respond to inquiries and track follow-up.
          Pledges are not completed payments.
        </p>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Donation pledges", pledges.value, "/admin/donations"],
          ["Contact inquiries", contacts.value, "/admin/contact-messages"],
          [
            "Awaiting review",
            newPledges.value + newContacts.value,
            "/admin/donations",
          ],
        ].map(([label, value, href]) => (
          <Link
            href={String(href)}
            key={label}
            className="rounded-2xl border bg-white p-6"
          >
            <p className="text-4xl font-semibold text-foundation-ink">
              {value}
            </p>
            <h3 className="mt-3 text-base">{label}</h3>
          </Link>
        ))}
      </section>
    </>
  );
}
