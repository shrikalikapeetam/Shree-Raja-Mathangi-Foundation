import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { emailOTP } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { isConfiguredAdminEmail } from "./admin-emails";

export function adminConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.BETTER_AUTH_SECRET &&
    process.env.BETTER_AUTH_URL &&
    process.env.ADMIN_EMAILS &&
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_FROM,
  );
}
function createAuth() {
  if (!adminConfigured())
    throw new Error("Admin authentication is not configured");
  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    rateLimit: { enabled: true, storage: "database", window: 60, max: 20 },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 60 },
    databaseHooks: {
      session: {
        create: {
          after: async (session) => {
            const [user] = await getDb()
              .select({ email: schema.user.email })
              .from(schema.user)
              .where(eq(schema.user.id, session.userId));
            if (user)
              await getDb()
                .insert(schema.activityLogs)
                .values({ actor: user.email, action: "Admin signed in" });
          },
        },
        delete: {
          before: async (session) => {
            const [user] = await getDb()
              .select({ email: schema.user.email })
              .from(schema.user)
              .where(eq(schema.user.id, session.userId));
            if (user)
              await getDb()
                .insert(schema.activityLogs)
                .values({ actor: user.email, action: "Admin session ended" });
          },
        },
      },
    },
    plugins: [
      emailOTP({
        expiresIn: 300,
        allowedAttempts: 3,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
          // Do not send codes to addresses outside the admin allowlist.
          if (type !== "sign-in" || !isConfiguredAdminEmail(email)) return;
          const port = Number(process.env.SMTP_PORT || 587);
          const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port,
            secure: port === 465,
            requireTLS: port !== 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            connectionTimeout: 10000,
            socketTimeout: 20000,
          });
          await transport.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Shree Raja Mathangi Foundation — Admin sign-in code",
            text: `Your sign-in code is ${otp}. It expires in 5 minutes. Do not share this code.`,
          });
        },
      }),
    ],
  });
}
let auth: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (auth ??= createAuth());
}
