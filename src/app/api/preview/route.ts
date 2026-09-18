import { redirectToPreviewURL } from "@prismicio/next";
import type { NextRequest } from "next/server";
import { createClient, linkResolver } from "@/prismicio";

export async function GET(request: NextRequest) {
  return redirectToPreviewURL({ client: await createClient(), linkResolver, request });
}
