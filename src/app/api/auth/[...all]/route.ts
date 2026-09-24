import { adminConfigured, getAuth } from "@/lib/auth";
export const runtime = "nodejs";
async function handler(request: Request) {
  if (!adminConfigured())
    return Response.json(
      { message: "Admin sign-in is not configured yet." },
      { status: 503 },
    );
  return getAuth().handler(request);
}
export { handler as GET, handler as POST };
