"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { donations, contactMessages, activityLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
export async function updateStatus(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id"));
  const kind = String(form.get("kind"));
  const status = String(form.get("status"));
  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !["donation", "contact"].includes(kind) ||
    !["new", "contacted", "closed"].includes(status)
  )
    throw Error("Invalid status update");
  const table = kind === "donation" ? donations : contactMessages;
  await getDb().transaction(async (tx) => {
    const [updated] = await tx
      .update(table)
      .set({ status })
      .where(eq(table.id, id))
      .returning({ id: table.id });
    if (!updated) throw Error("Submission not found");
    await tx
      .insert(activityLogs)
      .values({
        actor: admin.email,
        action: `${kind} marked ${status}`,
        recordId: id,
      });
  });
  revalidatePath("/admin", "layout");
}
