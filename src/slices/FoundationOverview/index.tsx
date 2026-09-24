import AnimatedSection from "@/components/AnimatedSection";
import SectionOrnament from "@/components/SectionOrnament";
import { cn } from "@/lib/utils";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function FoundationOverview({
  slice,
}: SliceComponentProps<Content.FoundationOverviewSlice>) {
  const hasImage = isFilled.image(slice.primary.featured_image);
  const hasIntroduction =
    isFilled.richText(slice.primary.title_description) ||
    isFilled.richText(slice.primary.description);
  const items = slice.primary.repetable_item.filter((item) =>
    isFilled.keyText(item.title),
  );

  return (
    <AnimatedSection
      className="container section-my"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={slice.primary.anchor_id || ""}
    >
      <SectionOrnament kind="rings" />
      <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
        {(hasImage || hasIntroduction) && (
          <div
            className={cn(
              "grid items-center gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10",
              hasImage && hasIntroduction && "md:grid-cols-2",
            )}
          >
            {isFilled.image(slice.primary.featured_image) && (
              <div data-reveal="image" className="slice-image relative aspect-4/3 min-w-0 overflow-hidden rounded-xl bg-legacy-surface md:rounded-2xl xl:rounded-3xl">
                <PrismicNextImage fallbackAlt=""
                  field={{
                    ...slice.primary.featured_image,
                    alt: slice.primary.featured_image.alt ?? "",
                  }}
                  alt={slice.primary.featured_image.alt ? undefined : ""}
                  fill
                  sizes={
                    hasIntroduction
                      ? "(min-width: 1280px) 588px, (min-width: 768px) 50vw, 100vw"
                      : "(min-width: 1280px) 1216px, 100vw"
                  }
                  className="object-cover"
                />
              </div>
            )}
            {hasIntroduction && (
              <div data-reveal="up" className="flex min-w-0 flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
                {isFilled.richText(slice.primary.title_description) && (
                  <div className="wrap-anywhere text-foundation-ink [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-relaxed [&_strong]:text-foundation-accent">
                    <PrismicRichText
                      field={slice.primary.title_description}
                      components={{
                        heading2: ({ children }) => (
                          <>
                            <h2>{children}</h2>
                            <span
                              aria-hidden="true"
                              data-reveal="line"
                              className="block h-1 w-20 rounded-full bg-foundation-accent"
                            />
                          </>
                        ),
                      }}
                    />
                  </div>
                )}
                {isFilled.richText(slice.primary.description) && (
                  <div className="wrap-anywhere pt-6 sm:pt-7 md:pt-8 lg:pt-9 xl:pt-10 border-t border-foundation-gold/70 text-foundation-ink [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-relaxed">
                    <PrismicRichText field={slice.primary.description} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {items.length > 0 && (
          <ul data-stagger className="m-0 grid list-none gap-0 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <li
                key={index}
                className={cn(
                  "m-0 flex min-w-0 items-center justify-center border-foundation-gold/70 p-4 text-center sm:p-5 md:p-6 lg:p-7 xl:p-8",
                  index > 0 && "border-t",
                  index < 2 && "sm:border-t-0",
                  index % 2 !== 0 && "sm:border-l",
                  "lg:border-l-0",
                  index < 3 && "lg:border-t-0",
                  index % 3 !== 0 && "lg:border-l",
                )}
              >
                <p className="wrap-anywhere leading-relaxed text-foundation-ink">
                  {item.title}
                </p>
              </li>
            ))}
          </ul>
        )}

        {isFilled.richText(slice.primary.highlights) && (
          <div data-reveal="up" className="slice-panel-detail rounded-lg bg-legacy-surface p-4 md:rounded-xl md:p-5 xl:rounded-2xl xl:p-6">
            <div className="space-y-3 wrap-anywhere border-l-4 border-foundation-accent pl-4 text-foundation-ink md:pl-5 xl:pl-6 [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_li]:text-base [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-none [&_ul]:pl-0">
              <PrismicRichText field={slice.primary.highlights} />
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
