import InquiryForm from "./InquiryForm";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function ContactInquiry({
  slice,
}: SliceComponentProps<Content.ContactInquirySlice>) {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="section-py bg-legacy-surface "
    >
      <div className="container flex flex-col md:flex-row gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20">
        {(isFilled.keyText(slice.primary.office_title) ||
          slice.primary.contact_details.length > 0) && (
          <aside className="rounded-xl md:rounded-2xl xl:rounded-3xl flex-1 border border-foundation-gold/70 bg-foundation-white p-6 shadow-sm sm:p-7 md:p-8 lg:p-9 xl:p-10 flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
            {isFilled.keyText(slice.primary.office_title) && (
              <h2 className="flex items-center gap-3 text-foundation-ink">
                {slice.primary.office_title}
              </h2>
            )}
            <div className="flex flex-col gap-4">
              {slice.primary.contact_details.map((detail, index) => {
                if (
                  !isFilled.keyText(detail.title) &&
                  !isFilled.richText(detail.description)
                ) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-1 rounded-lg md:rounded-xl xl:rounded-2xl border border-foundation-gold/40 bg-legacy-surface p-4 md:p-5 xl:p-6"
                  >
                    {isFilled.keyText(detail.title) && (
                      <h3 className="header6 uppercase tracking-wider text-foundation-ink">
                        {detail.title}
                      </h3>
                    )}
                    <div className="wrap-anywhere text-foundation-body [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foundation-ink">
                      <PrismicRichText field={detail.description} />
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        <div className="rounded-xl md:rounded-2xl xl:rounded-3xl flex-1 border border-foundation-gold/70 bg-foundation-white p-6 shadow-sm sm:p-7 md:p-8 lg:p-9 xl:p-10 flex flex-col gap-4">
          {isFilled.keyText(slice.primary.form_title) && (
            <h2 className="text-foundation-ink">{slice.primary.form_title}</h2>
          )}
          {isFilled.keyText(slice.primary.form_description) && (
            <p className="text-(--foundation-muted)">
              {slice.primary.form_description}
            </p>
          )}
          <InquiryForm labels={{
            name_label: slice.primary.name_label,
            gender_label: slice.primary.gender_label,
            phone_number_label: slice.primary.phone_number_label,
            email_label: slice.primary.email_label,
            message_label: slice.primary.message_label,
            submit_label: slice.primary.submit_label,
          }} />
        </div>
      </div>
    </section>
  );
}
