import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export type TextSectionProps = SliceComponentProps<Content.TextSectionSlice>;

export default function TextSection({ slice }: TextSectionProps) {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-legacy-surface text-legacy-ink"
    >
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        <PrismicRichText
          field={slice.primary.heading}
          components={{ heading2: ({ children }) => <h2 className="mb-6 font-semibold tracking-tight">{children}</h2> }}
        />
        <div className="max-w-3xl space-y-5 leading-8 text-legacy-muted [&_a]:text-legacy-ink [&_a]:underline [&_a]:underline-offset-4 [&_h3]:font-semibold [&_h3]:text-legacy-ink [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
          <PrismicRichText field={slice.primary.body} />
        </div>
      </div>
    </section>
  );
}
