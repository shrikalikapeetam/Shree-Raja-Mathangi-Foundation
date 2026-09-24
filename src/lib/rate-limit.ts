import "server-only";

import { createHmac } from "node:crypto";
import { lt, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { rateLimitWindows } from "@/db/schema";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

function clientIp(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function anonymizedClientKey(request: Request) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("Missing BETTER_AUTH_SECRET");

  return createHmac("sha256", secret).update(clientIp(request)).digest("hex");
}

export async function enforceRateLimit(
  request: Request,
  options: RateLimitOptions,
) {
  const now = Date.now();
  const windowStart = Math.floor(now / options.windowMs) * options.windowMs;
  const resetAt = new Date(windowStart + options.windowMs);
  const key = `${options.key}:${windowStart}:${anonymizedClientKey(request)}`;

  // Expired buckets have no further use. This keeps the free database-backed
  // limiter bounded without storing visitors' raw IP addresses.
  await getDb()
    .delete(rateLimitWindows)
    .where(lt(rateLimitWindows.expiresAt, new Date(now)));

  const [bucket] = await getDb()
    .insert(rateLimitWindows)
    .values({ key, expiresAt: resetAt })
    .onConflictDoUpdate({
      target: rateLimitWindows.key,
      set: { count: sql`${rateLimitWindows.count} + 1` },
    })
    .returning({ count: rateLimitWindows.count });

  return {
    allowed: bucket.count <= options.limit,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt.getTime() - now) / 1000)),
  };
}
