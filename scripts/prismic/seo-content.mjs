const defaults = {
  homepage: {
    meta_title: "Shree Raja Mathangi Foundation",
    meta_description:
      "Supporting cow care, Vedic education and temple preservation to protect India's spiritual and cultural heritage for future generations.",
    schema_type: "WebPage",
  },
  about: {
    meta_title: "About | Shree Raja Mathangi Foundation",
    meta_description:
      "Learn about Shree Raja Mathangi Foundation and its commitment to cow welfare, authentic Vedic learning and the preservation of India's sacred heritage.",
    schema_type: "AboutPage",
  },
  contact: {
    meta_title: "Contact | Shree Raja Mathangi Foundation",
    meta_description:
      "Contact Shree Raja Mathangi Foundation to support cow care, Vedic education and temple preservation through donations, sponsorship or volunteering.",
    schema_type: "ContactPage",
  },
};

export function withSEODefaults(uid, source) {
  const values = defaults[uid];
  const data = structuredClone(source);
  if (!values) return data;
  for (const [key, value] of Object.entries(values))
    if (!data[key]) data[key] = value;
  data.og_title ||= data.meta_title;
  data.og_description ||= data.meta_description;
  data.noindex ??= false;
  return data;
}
