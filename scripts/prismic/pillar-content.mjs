// Content supplied for the foundation's three pillars. Images are illustrative.
const richText = (type, ...text) =>
  text.map((value) => ({ type, text: value, spans: [] }));

export const pillarImages = [
  {
    name: "goshala",
    path: "public/images/pillars/goshala.png",
    alt: "Illustration of indigenous cows in a shaded goshala",
  },
  {
    name: "vedic-education",
    path: "public/images/pillars/vedic-education.png",
    alt: "Illustration of Vedic students learning with an Acharya",
  },
  {
    name: "temple",
    path: "public/images/pillars/temple.png",
    alt: "Illustration of a South Indian temple courtyard and gopuram",
  },
];

export function createPillarSlices(images, contactId) {
  const defaults = {
    section_label: null,
    additional_image: {},
    image_caption: "Illustrative image — project photographs to follow.",
    initiatives_title: "Our Initiatives",
    statistics: [],
    donations_title: null,
    donations: [],
    note: null,
    image_on_right: false,
  };
  const cta = (text) =>
    contactId
      ? { link_type: "Document", id: contactId, text }
      : { link_type: "Any", text };
  const data = [
    {
      section_label: "OUR THREE PILLARS",
      anchor_id: "go-samrakshnam",
      pillar_name: "01 / Go Samrakshnam",
      title: richText("heading2", "Compassion for Every Cow"),
      introduction: richText(
        "paragraph",
        "The Foundation supports Goshalas that provide lifelong care for rescued, abandoned, aged, and indigenous cows.",
      ),
      featured_image: images.goshala,
      initiatives: richText(
        "list-item",
        "Cow rescue and rehabilitation",
        "Shelter and nutrition",
        "Veterinary healthcare",
        "Indigenous breed conservation",
        "Sustainable agriculture initiatives",
        "Community awareness programs",
      ),
      project_title: richText("heading3", "A home for lifelong care"),
      project_content: richText(
        "paragraph",
        "The Foundation has started constructing a goshala on a 4-acre plot near the Sri Raja Mathangi Sametha Sri Raja Rajeshwara Temple, located in Keezhanthurai Village near Arakonam, Tamil Nadu.",
        "The four-acre plot will house three sheds for 150 animals, a feed storage shed, a quarantine shed, and a clinic.",
        "On the remaining 3 acres, fodder grass is also cultivated to ensure year-round availability of green fodder for the cows.",
      ),
      statistics: [
        { value: "4 acres", label: "Goshala site" },
        { value: "150 animals", label: "Planned capacity" },
        { value: "3 acres", label: "Fodder cultivation" },
      ],
      cta: cta("Support Go Samrakshnam"),
    },
    {
      anchor_id: "vedic-education",
      pillar_name: "02 / Vedic Education",
      image_on_right: true,
      title: richText("heading2", "Preserving Ancient Wisdom"),
      introduction: richText(
        "paragraph",
        "The Vedas are among humanity's oldest living knowledge traditions. The Foundation supports institutions dedicated to preserving authentic Vedic learning while encouraging research and wider public understanding.",
      ),
      featured_image: images["vedic-education"],
      initiatives: richText(
        "list-item",
        "Scholarships for students",
        "Support for Gurukul institutions",
        "Teacher welfare",
        "Research and publications",
        "Heritage education programs",
        "Digital preservation projects",
      ),
      project_title: richText("heading3", "Supporting a living tradition"),
      project_content: richText(
        "paragraph",
        "The Foundation supports The Swamy Govinda Bagavatpatha Acharya Vedic Foundation, situated at No. 2, Mundaka Kanni Kovil 4th Street, Mylapore, Chennai – 600 004, Tamil Nadu.",
        "This Patasala offers a course on Shukla Yajurveda Madhyandiniya Shaka.",
        "There are 13 vidhyarthis currently undergoing studies. It is planned to expand the student base to 50 with three Acharyas from the next academic year.",
      ),
      statistics: [
        { value: "13", label: "Current students" },
        { value: "50", label: "Planned students" },
        { value: "3", label: "Planned Acharyas" },
      ],
      donations_title: "Support the Veda Patashala",
      donations: [
        { label: "Corpus fund", amount: 6000 },
        { label: "Sponsor one vidhyarthi for one year", amount: 60000 },
        { label: "Brahmana Bhojan for one day", amount: 5000 },
        { label: "Brahmana Bhojan for one meal", amount: 3000 },
      ],
      cta: cta("Support Vedic Education"),
    },
    {
      anchor_id: "temple-management",
      pillar_name: "03 / Temple Management",
      title: richText("heading2", "Preserving Sacred Spaces"),
      introduction: richText(
        "paragraph",
        "Temples have long served as centers of worship, culture, education, and community life. The Foundation works with temple administrators and communities to support the preservation and effective management of these sacred institutions.",
      ),
      featured_image: images.temple,
      initiatives: richText(
        "list-item",
        "Temple conservation and restoration",
        "Administrative support",
        "Digital record management",
        "Volunteer coordination",
        "Cultural and devotional programs",
        "Capacity building for temple management",
        "Heritage documentation and awareness",
      ),
      project_title: richText(
        "heading3",
        "Shri Raja Mathangi Sametha Shri Raja Rajeshwar Temple",
      ),
      project_content: richText(
        "paragraph",
        "The Foundation is now maintaining and managing the affairs of Shri Raja Mathangi Sametha Shri Raja Rajeshwar Temple, Kizhanthurai Village, Arakonam, Tamil Nadu.",
        "The temple houses the Dasa Maha Vidhyas.",
      ),
      note: "Names of the ten Dasa Maha Vidhyas and temple photographs will be added when supplied.",
      cta: cta("Support Temple Preservation"),
    },
  ];
  return data.map((primary) => ({
    slice_type: "pillar_feature",
    variation: "default",
    version: "",
    items: [],
    slice_label: null,
    primary: { ...defaults, ...primary },
  }));
}
