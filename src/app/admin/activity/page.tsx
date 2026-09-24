import { desc } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { activityLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const p = await searchParams;
  const page = Math.max(1, Math.min(100000, Math.floor(Number(p.page) || 1)));
  const rows = await getDb()
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(51)
    .offset((page - 1) * 50);
  return (
    <section className="space-y-5">
      <h2 className="text-2xl text-foundation-ink">Activity log</h2>
      <p className="text-sm">
        Submission receipts and admin follow-up changes.
      </p>
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {["When", "Who", "Activity", "Record"].map((t) => (
                <th key={t} className="p-4" scope="col">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-4">
                  {row.createdAt.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
                <td className="p-4">{row.actor}</td>
                <td className="p-4">{row.action}</td>
                <td className="p-4 font-mono text-xs">{row.recordId || "—"}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  No activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav aria-label="Activity pages" className="flex gap-5">
        {page > 1 && <Link href={`?page=${page - 1}`}>Previous</Link>}
        <span>Page {page}</span>
        {rows.length > 50 && <Link href={`?page=${page + 1}`}>Next</Link>}
      </nav>
    </section>
  );
}
