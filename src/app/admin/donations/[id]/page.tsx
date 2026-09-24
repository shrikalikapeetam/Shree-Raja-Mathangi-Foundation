import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { donations } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { decryptPan } from "@/lib/private-data";
import { getLayout } from "@/prismicio";
import { getSevaOptions } from "@/lib/donation-content";
import AdminStatusForm from "@/components/AdminStatusForm";
export default async function DonationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const layout = await getLayout();
  const causes = layout ? getSevaOptions(layout.data) : [];
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [row] = await getDb()
    .select()
    .from(donations)
    .where(eq(donations.id, id))
    .limit(1);
  if (!row) notFound();
  return (
    <section className="space-y-6 rounded-2xl border bg-white p-6">
      <Link href="/admin/donations" className="text-foundation-accent">
        ← Donation pledges
      </Link>
      <h2 className="text-2xl text-foundation-ink">{row.name}</h2>
      <dl className="grid gap-5 sm:grid-cols-2">
        {[
          ["Email", row.email],
          ["Phone", row.phone],
          [
            "Seva cause",
            causes.find((c) => c.id === row.cause)?.name || row.cause,
          ],
          ["Pledged amount", `₹${(row.amount / 100).toLocaleString("en-IN")}`],
          ["PAN", row.pan ? decryptPan(row.pan) : "Not provided"],
          [
            "Received",
            row.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-foundation-body">{label}</dt>
            <dd className="mt-1 break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm">
        This record is a pledge. It does not confirm receipt of payment.
      </p>
      <AdminStatusForm id={row.id} kind="donation" status={row.status} />
    </section>
  );
}
