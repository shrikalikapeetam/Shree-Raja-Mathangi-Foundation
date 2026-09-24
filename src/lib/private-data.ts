import "server-only";
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
function key() {
  const value = Buffer.from(process.env.DONOR_DATA_KEY || "", "base64");
  if (value.length !== 32)
    throw new Error("DONOR_DATA_KEY must contain a base64 encoded 32-byte key");
  return value;
}
export function encryptPan(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((b) => b.toString("base64"))
    .join(".");
}
export function decryptPan(value: string) {
  const [iv, tag, encrypted] = value
    .split(".")
    .map((v) => Buffer.from(v, "base64"));
  const cipher = createDecipheriv("aes-256-gcm", key(), iv);
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(encrypted), cipher.final()]).toString(
    "utf8",
  );
}
