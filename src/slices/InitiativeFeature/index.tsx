import { isFilled, type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function InitiativeFeature({
  slice,
}: SliceComponentProps<Content.InitiativeFeatureSlice>) {
  const initiatives = slice.primary.initiatives.filter((item) =>
    isFilled.keyText(item.description),
  );

  return (
    <section
      className="container section-my"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={slice.primary.anchor_id || ""}
    >
      <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
        {isFilled.richText(slice.primary.description) && (
          <div className="flex flex-col gap-4 border-b border-foundation-gold/70 pb-6 sm:pb-7 md:pb-8 lg:pb-9 xl:pb-10">
            <div className="space-y-4 wrap-anywhere text-foundation-ink [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-relaxed [&_p]:text-foundation-body">
              <PrismicRichText
                field={slice.primary.description}
                components={{
                  heading2: ({ children }) => (
                    <>
                      <h2>{children}</h2>
                      <span
                        aria-hidden="true"
                        className="block h-1 w-20 rounded-full bg-foundation-accent"
                      />
                    </>
                  ),
                }}
              />
            </div>
          </div>
        )}

        {initiatives.length > 0 && (
          <ul className="m-0 grid list-none gap-x-8 gap-y-6 p-0 sm:grid-cols-2 sm:gap-y-7 md:gap-x-10 md:gap-y-8 lg:gap-x-12 lg:gap-y-9 xl:gap-x-16 xl:gap-y-10">
            {initiatives.map((item, index) => (
              <li
                key={index}
                className="m-0 flex min-w-0 flex-col gap-6 before:block before:h-px before:w-16 before:bg-foundation-gold before:content-[''] first:before:hidden sm:gap-7 sm:[&:nth-child(2)]:before:hidden md:gap-8 lg:gap-9 xl:gap-10"
              >
                <p className="header4 wrap-anywhere font-sans font-medium leading-relaxed text-foundation-ink">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        )}

        {isFilled.keyText(slice.primary.highlight_text) && (
          <div className="overflow-hidden rounded-lg border-l-8 border-foundation-accent bg-foundation-ink bg-(image:--banner-background) p-6 text-(--foundation-cream) shadow-sm sm:p-7 md:rounded-xl md:p-8 lg:p-9 xl:rounded-2xl xl:p-10">
            <p className="header3 wrap-anywhere font-serif font-normal leading-relaxed">
              {slice.primary.highlight_text}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
