import { desc } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import AdminStatusForm from "@/components/AdminStatusForm";
export default async function ContactMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const p = await searchParams;
  const page = Math.max(1, Math.min(100000, Math.floor(Number(p.page) || 1)));
  const rows = await getDb()
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(26)
    .offset((page - 1) * 25);
  return (
    <section className="space-y-5">
      <h2 className="text-2xl text-foundation-ink">Contact inquiries</h2>
      {!rows.length && (
        <p className="rounded-2xl border bg-white p-8">No inquiries yet.</p>
      )}
      {rows.slice(0, 25).map((row) => (
        <article
          key={row.id}
          className="space-y-4 rounded-2xl border bg-white p-6"
        >
          <div className="flex flex-wrap justify-between gap-3">
            <h3 className="text-xl text-foundation-ink">{row.name}</h3>
            <time className="text-sm" dateTime={row.createdAt.toISOString()}>
              {row.createdAt.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </time>
          </div>
          <p className="break-words">
            <a className="underline" href={`mailto:${row.email}`}>
              {row.email}
            </a>{" "}
            · {row.phone}
            {row.gender && ` · ${row.gender}`}
          </p>
          <p className="whitespace-pre-wrap break-words">{row.message}</p>
          <AdminStatusForm id={row.id} kind="contact" status={row.status} />
        </article>
      ))}
      <nav aria-label="Inquiry pages" className="flex gap-5">
        {page > 1 && <Link href={`?page=${page - 1}`}>Previous</Link>}
        <span>Page {page}</span>
        {rows.length > 25 && <Link href={`?page=${page + 1}`}>Next</Link>}
      </nav>
    </section>
  );
}
