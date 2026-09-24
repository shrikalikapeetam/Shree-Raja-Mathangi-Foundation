import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfigured, getAuth } from "./auth";
import { isConfiguredAdminEmail } from "./admin-emails";
export async function requireAdmin() {
  if (!adminConfigured()) redirect("/sign-in");
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (
    !session?.user.emailVerified ||
    !isConfiguredAdminEmail(session.user.email)
  )
    redirect("/sign-in");
  return session.user;
}
