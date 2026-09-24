import { and, desc, eq, ilike, or, count } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { donations } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { causes } from "@/lib/donations";
import AdminStatusForm from "@/components/AdminStatusForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = (params.q || "").slice(0, 120);
  const status = ["new", "contacted", "closed"].includes(params.status || "")
    ? params.status
    : "";
  const page = Math.max(
    1,
    Math.min(100000, Math.floor(Number(params.page) || 1)),
  );
  const where = and(
    status ? eq(donations.status, status) : undefined,
    q
      ? or(ilike(donations.name, `%${q}%`), ilike(donations.email, `%${q}%`))
      : undefined,
  );
  const [rows, [total]] = await Promise.all([
    getDb()
      .select({
        id: donations.id,
        name: donations.name,
        email: donations.email,
        cause: donations.cause,
        amount: donations.amount,
        status: donations.status,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .where(where)
      .orderBy(desc(donations.createdAt))
      .limit(25)
      .offset((page - 1) * 25),
    getDb().select({ value: count() }).from(donations).where(where),
  ]);
  const pageUrl = (n: number) =>
    `/admin/donations?${new URLSearchParams({ q, status: status || "", page: String(n) })}`;
  return (
    <section className="space-y-5">
      <h2 className="text-2xl text-foundation-ink">
        Donation pledges <span className="text-base">({total.value})</span>
      </h2>
      <form className="flex flex-wrap gap-3">
        <label htmlFor="donor-search" className="sr-only">
          Search donor name or email
        </label>
        <Input
          id="donor-search"
          name="q"
          placeholder="Search name or email"
          defaultValue={q}
          className="max-w-xs"
        />
        <label htmlFor="filter-status" className="sr-only">
          Filter status
        </label>
        <select
          id="filter-status"
          name="status"
          defaultValue={status}
          className="rounded-lg border bg-white p-2"
        >
          <option value="">All statuses</option>
          {["new", "contacted", "closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <Button variant="brand">Filter</Button>
      </form>
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Donation pledges, newest first. Amounts are pledged, not paid.
          </caption>
          <thead className="bg-legacy-surface">
            <tr>
              {["Donor", "Cause", "Pledged", "Received", "Follow-up"].map(
                (t) => (
                  <th key={t} scope="col" className="p-4">
                    {t}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-4">
                  <Link
                    className="font-semibold text-foundation-ink underline"
                    href={`/admin/donations/${row.id}`}
                  >
                    {row.name}
                  </Link>
                  <p className="mt-1">{row.email}</p>
                </td>
                <td className="p-4">
                  {causes.find((c) => c.id === row.cause)?.name || row.cause}
                </td>
                <td className="p-4">
                  ₹{(row.amount / 100).toLocaleString("en-IN")}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {row.createdAt.toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
                <td className="p-4">
                  <AdminStatusForm
                    id={row.id}
                    kind="donation"
                    status={row.status}
                  />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  No pledges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav aria-label="Donation pages" className="flex gap-5">
        {page > 1 && <Link href={pageUrl(page - 1)}>Previous</Link>}
        <span>Page {page}</span>
        {page * 25 < total.value && <Link href={pageUrl(page + 1)}>Next</Link>}
      </nav>
    </section>
  );
}
