export const causes = [
  {
    id: "go-samrakshnam",
    name: "Go Samrakshnam",
    description: "Fodder & Cow Care",
  },
  {
    id: "vedic-education",
    name: "Vedic Education",
    description: "Gurukul & Scholars",
  },
  {
    id: "temple-management",
    name: "Temple Management",
    description: "Pooja & Renovation",
  },
] as const;
export type Cause = (typeof causes)[number]["id"];
export type DonationInput = {
  requestId: string;
  cause: Cause;
  amount: number;
  name: string;
  email: string;
  phone: string;
  pan: string;
};
export function validateDonation(body: unknown): DonationInput {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("Please complete the donation form.");
  const b = body as Record<string, unknown>;
  const text = (key: string) =>
    typeof b[key] === "string" ? b[key].trim() : "";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      text("requestId"),
    )
  )
    throw new Error("Please reopen the form and try again.");
  if (!causes.some((c) => c.id === b.cause))
    throw new Error("Select a seva cause.");
  if (
    typeof b.amount !== "number" ||
    !Number.isSafeInteger(b.amount) ||
    b.amount < 100 ||
    b.amount > 100000000
  )
    throw new Error("Enter an amount between ₹1 and ₹10,00,000.");
  if (text("name").length < 2 || text("name").length > 120)
    throw new Error("Enter your full name (2–120 characters).");
  if (
    text("email").length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email"))
  )
    throw new Error("Enter a valid email address.");
  if (
    !/^\+?[\d ()-]{7,25}$/.test(text("phone")) ||
    text("phone").replace(/\D/g, "").length < 7
  )
    throw new Error("Enter a valid phone number.");
  const pan = text("pan").toUpperCase();
  if (pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(pan))
    throw new Error("Enter a valid PAN or leave it blank.");
  return {
    requestId: text("requestId"),
    cause: b.cause as Cause,
    amount: b.amount,
    name: text("name"),
    email: text("email").toLowerCase(),
    phone: text("phone"),
    pan,
  };
}
