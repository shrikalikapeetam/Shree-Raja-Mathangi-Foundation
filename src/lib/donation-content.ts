import type { Content } from "@prismicio/client";

const modalFields = [
  "modal_title",
  "modal_subtitle",
  "modal_description",
  "modal_seva_title",
  "modal_seva",
  "modal_donation_amount_title",
  "modal_amounts",
  "modal_enter_amount_label",
  "modal_donor_information_title",
  "modal_full_name_label",
  "modal_email_label",
  "modal_phone_label",
  "modal_pan_label",
  "modal_info_title",
  "modal_info",
  "modal_highlight_text",
  "modal_submit_text",
  "modal_submitting_text",
  "modal_success_title",
  "modal_success_description",
  "modal_done_label",
  "modal_close_label",
] as const;
export type DonationContent = Pick<
  Content.LayoutDocument["data"],
  (typeof modalFields)[number]
>;
export function getDonationContent(
  data: Content.LayoutDocument["data"],
): DonationContent {
  return Object.fromEntries(
    modalFields.map((key) => [key, data[key]]),
  ) as DonationContent;
}
export function getSevaOptions(content: DonationContent) {
  const seen = new Set<string>();
  return (content.modal_seva ?? []).flatMap((item) => {
    const id = item.seva_id?.trim();
    const name = item.title?.trim();
    if (!id || !name || seen.has(id)) return [];
    seen.add(id);
    return [{ id, name, description: item.subtitle ?? "" }];
  });
}
