import "server-only";

export function adminEnabled() {
  return process.env.ADMIN_ENABLED === "true";
}
