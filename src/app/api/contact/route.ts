import nodemailer from "nodemailer";
import { validateInquiryField, type InquiryField } from "@/slices/ContactInquiry/validation";

export const runtime = "nodejs";
const RECIPIENT = "pritam.soni13@gmail.com";

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
    return Response.json({ error: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  const port = Number(process.env.SMTP_PORT ?? "587");
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !Number.isInteger(port) || port < 1 || port > 65535) {
    return Response.json({ error: "Email delivery is not configured yet. Please try again later." }, { status: 503 });
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
      to: RECIPIENT,
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
    return Response.json({ error: "Unable to send your message right now. Please try again later." }, { status: 502 });
  }
}
