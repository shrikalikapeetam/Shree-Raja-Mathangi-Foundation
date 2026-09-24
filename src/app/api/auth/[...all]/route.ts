import { adminConfigured, getAuth } from "@/lib/auth";
import { adminEnabled } from "@/lib/admin-enabled";
export const runtime = "nodejs";
async function handler(request: Request) {
  if (!adminEnabled())
    return Response.json({ message: "Not found" }, { status: 404 });
  if (!adminConfigured())
    return Response.json(
      { message: "Admin sign-in is not configured yet." },
      { status: 503 },
    );
  return getAuth().handler(request);
}
export { handler as GET, handler as POST };
