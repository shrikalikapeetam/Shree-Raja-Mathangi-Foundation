import { cn } from "@/lib/utils";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function FeaturedProfile({
  slice,
  index,
}: SliceComponentProps<Content.FeaturedProfileSlice>) {
  return (
    <section
      className="bg-legacy-surface section-py"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={slice.primary.anchor_id || ""}
    >
      <div className="container">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10",
          )}
        >
          <div className="relative isolate h-auto overflow-hidden rounded-xl bg-foundation-ink md:rounded-2xl xl:rounded-3xl">
            {isFilled.image(slice.primary.featured_image) && (
              <PrismicNextImage fallbackAlt=""
                field={{
                  ...slice.primary.featured_image,
                  alt:
                    slice.primary.featured_image.alt ??
                    slice.primary.overlay_title ??
                    "",
                }}
                loading={index < 2 ? "eager" : "lazy"}
                fetchPriority={index < 2 ? "high" : "auto"}
                imgixParams={{ q: 40, fit: "crop", ar: "2:3" }}
                sizes={
                  "(min-width: 1280px) 588px, (min-width: 1024px) calc((100vw - 100px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                }
                className="object-cover size-full aspect-1/1.5"
              />
            )}
            <div className="flex inset-0 flex-col justify-end bg-foundation-ink/70 w-full absolute h-full min-w-0 gap-4 p-6 text-white wrap-anywhere sm:p-7 md:p-8 lg:p-9 xl:p-10">
              {isFilled.keyText(slice.primary.overlay_pretitle) && (
                <span className="w-fit rounded-full border border-foundation-gold/60 bg-foundation-ink/40 px-4 py-1 text-base text-foundation-gold">
                  {slice.primary.overlay_pretitle}
                </span>
              )}
              {isFilled.keyText(slice.primary.overlay_title) && (
                <h2>{slice.primary.overlay_title}</h2>
              )}
              {isFilled.keyText(slice.primary.overlay_description) && (
                <p className="leading-relaxed text-foundation-gold">
                  {slice.primary.overlay_description}
                </p>
              )}
              {isFilled.richText(slice.primary.overlay_details) && (
                <div className="border-t border-white/25 pt-4 [&_a]:text-foundation-gold [&_a]:underline [&_a]:underline-offset-4 [&_li]:text-base [&_li]:leading-relaxed">
                  <PrismicRichText field={slice.primary.overlay_details} />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
            {isFilled.richText(slice.primary.content) && (
              <div className="wrap-anywhere flex flex-col gap-4 text-foundation-body [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_h3]:text-foundation-ink [&_h4]:text-foundation-accent [&_li]:leading-relaxed [&_p]:leading-relaxed">
                <PrismicRichText
                  field={slice.primary.content}
                  components={{
                    heading4: ({ children }) => (
                      <h3 className="header4 text-foundation-accent">
                        {children}
                      </h3>
                    ),
                  }}
                />
              </div>
            )}

            {(isFilled.keyText(slice.primary.callout_title) ||
              isFilled.richText(slice.primary.callout_content)) && (
              <aside className="flex flex-col gap-4 rounded-lg border-l-4 border-foundation-accent bg-white p-4 md:rounded-xl md:p-5 xl:p-6">
                {isFilled.keyText(slice.primary.callout_title) && (
                  <h4 className="text-foundation-ink wrap-anywhere">
                    {slice.primary.callout_title}
                  </h4>
                )}
                {isFilled.richText(slice.primary.callout_content) && (
                  <div className="space-y-4 wrap-anywhere text-foundation-body [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-relaxed">
                    <PrismicRichText field={slice.primary.callout_content} />
                  </div>
                )}
              </aside>
            )}

            {isFilled.richText(slice.primary.quote) && (
              <blockquote className="border-t border-foundation-gold/70 pt-6 text-foundation-ink italic sm:pt-7 md:pt-8 lg:pt-9 xl:pt-10">
                <div className="space-y-4 wrap-anywhere [&_p]:leading-relaxed">
                  <PrismicRichText field={slice.primary.quote} />
                </div>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
