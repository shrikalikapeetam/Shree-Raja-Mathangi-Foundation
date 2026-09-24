export type InquiryField = "name" | "gender" | "phone" | "email" | "message";
export const genderOptions = ["Male", "Female", "Others"] as const;

export function validateInquiryField(
  name: InquiryField,
  value: string,
): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "This field is required.";
  }
  const limits = {
    name: 120,
    gender: 80,
    phone: 40,
    email: 254,
    message: 5000,
  };
  if (trimmed.length > limits[name]) {
    return `Please use ${limits[name]} characters or fewer.`;
  }
  if (
    name === "gender" &&
    !genderOptions.some((option) => option === trimmed)
  ) {
    return "Select Male, Female or Others.";
  }
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address.";
  }
  if (name === "phone") {
    const digits = trimmed.replace(/\D/g, "");
    if (
      !/^\+?[\d\s().-]+$/.test(trimmed) ||
      digits.length < 7 ||
      digits.length > 15
    ) {
      return "Enter a phone number with 7–15 digits, including the country code if needed.";
    }
  }
  return "";
}
