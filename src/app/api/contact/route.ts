import { getDb } from "@/db";
import { contactMessages, activityLogs } from "@/db/schema";
import { enforceRateLimit } from "@/lib/rate-limit";
import nodemailer from "nodemailer";
import {
  validateInquiryField,
  type InquiryField,
} from "@/slices/ContactInquiry/validation";

export const runtime = "nodejs";
const RECIPIENTS = [
  "admin@shreerajamathangifoundation.org",
  "pritam.soni13@gmail.com",
];

export async function POST(request: Request) {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 20000) {
      return Response.json({ error: "Message is too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const submitted = body as Record<string, unknown>;
  const values: Partial<Record<InquiryField, string>> = {};
  const errors: Partial<Record<InquiryField, string>> = {};
  const names: InquiryField[] = ["name", "gender", "phone", "email", "message"];
  for (const name of names) {
    const value = submitted[name] ?? "";
    if (typeof value !== "string") {
      errors[name] = "Enter a valid text value.";
      continue;
    }
    values[name] = value.trim();
    const error = validateInquiryField(name, value);
    if (error) errors[name] = error;
  }
  if (Object.keys(errors).length) {
    return Response.json(
      { error: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  }

  let saved = false;
  if (process.env.DATABASE_URL) {
    try {
      const limit = await enforceRateLimit(request, {
        key: "contact",
        limit: 5,
        windowMs: 600000,
      });
      if (!limit.allowed)
        return Response.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      await getDb().transaction(async (tx) => {
        const [row] = await tx
          .insert(contactMessages)
          .values({
            name: values.name!,
            email: values.email!,
            phone: values.phone!,
            gender: values.gender,
            message: values.message!,
          })
          .returning({ id: contactMessages.id });
        await tx
          .insert(activityLogs)
          .values({
            actor: "Website",
            action: "Contact inquiry received",
            recordId: row.id,
          });
      });
      saved = true;
    } catch {
      return Response.json(
        { error: "Unable to save your inquiry. Please try again." },
        { status: 503 },
      );
    }
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  const port = Number(process.env.SMTP_PORT ?? "587");
  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !SMTP_FROM ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    return saved
      ? Response.json({ ok: true })
      : Response.json(
          {
            error:
              "Email delivery is not configured yet. Please try again later.",
          },
          { status: 503 },
        );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const result = await transporter.sendMail({
      from: SMTP_FROM,
      to: RECIPIENTS,
      replyTo: values.email,
      subject: "Shree Raja Mathangi Foundation — Contact inquiry",
      text: [
        `Name: ${values.name}`,
        `Gender: ${values.gender || "Not provided"}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone}`,
        "",
        "Message:",
        values.message,
      ].join("\n"),
    });
    if (!result.accepted.length) throw new Error("Recipient not accepted");
    return Response.json({ ok: true });
  } catch {
    // Once saved, notification failure must not invite duplicate submissions.
    return saved
      ? Response.json({ ok: true })
      : Response.json(
          {
            error:
              "Unable to send your message right now. Please try again later.",
          },
          { status: 502 },
        );
  }
}
