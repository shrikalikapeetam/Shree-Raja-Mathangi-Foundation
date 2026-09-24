import { getLayout } from "@/prismicio";
import { getSevaOptions } from "@/lib/donation-content";
import { getDb } from "@/db";
import { donations, activityLogs } from "@/db/schema";
import { validateDonation } from "@/lib/donations";
import { encryptPan } from "@/lib/private-data";
import { enforceRateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  let allowedCauses: string[];
  try {
    const layout = await getLayout();
    allowedCauses = layout
      ? getSevaOptions(layout.data).map((item) => item.id)
      : [];
    if (!allowedCauses.length) throw new Error("No configured causes");
  } catch {
    return Response.json(
      {
        error:
          "Donation options are currently unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 8000)
      return Response.json({ error: "Request too large." }, { status: 413 });
    data = validateDonation(JSON.parse(raw), allowedCauses);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof SyntaxError
            ? "Invalid request."
            : error instanceof Error
              ? error.message
              : "Invalid form.",
      },
      { status: 400 },
    );
  }
  if (
    !process.env.DATABASE_URL ||
    !process.env.BETTER_AUTH_SECRET ||
    !process.env.DONOR_DATA_KEY
  )
    return Response.json(
      {
        error:
          "Online pledges are not available yet. Please contact the foundation directly.",
      },
      { status: 503 },
    );
  try {
    const limit = await enforceRateLimit(request, {
      key: "donations",
      limit: 5,
      windowMs: 600000,
    });
    if (!limit.allowed)
      return Response.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    await getDb().transaction(async (tx) => {
      const [row] = await tx
        .insert(donations)
        .values({ ...data, pan: data.pan ? encryptPan(data.pan) : null })
        .onConflictDoNothing({ target: donations.requestId })
        .returning({ id: donations.id });
      if (row)
        await tx.insert(activityLogs).values({
          actor: "Website",
          action: "Donation pledge received",
          recordId: row.id,
        });
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Unable to save your pledge. Please try again." },
      { status: 503 },
    );
  }
}
