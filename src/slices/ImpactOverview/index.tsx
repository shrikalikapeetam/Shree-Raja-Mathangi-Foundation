import { cn } from "@/lib/utils";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function ImpactOverview({
  slice,
}: SliceComponentProps<Content.ImpactOverviewSlice>) {
  const hasIntroduction =
    isFilled.keyText(slice.primary.title) ||
    isFilled.richText(slice.primary.description);
  const statements = slice.primary.repetable_item.filter((item) =>
    isFilled.keyText(item.impact_statement),
  );

  return (
    <section
      className="container section-my"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={slice.primary.anchor_id || ""}
    >
      <div
        className={cn(
          "flex flex-col md:flex-row gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10",
        )}
      >
        {hasIntroduction && (
          <div className="relative flex-1 max-w-xl isolate flex justify-between flex-col gap-6 overflow-hidden rounded-xl border border-foundation-gold/40 bg-foundation-ink bg-(image:--banner-background) p-6 text-(--foundation-cream) shadow-sm sm:gap-7 sm:p-7 md:gap-8 md:rounded-2xl md:p-8 lg:gap-9 lg:p-9 xl:gap-10 xl:rounded-3xl xl:p-10">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 400 400"
              fill="none"
              className="pointer-events-none absolute -bottom-12 -left-40 -z-10 size-96 text-foundation-white/10"
            >
              {[70, 100, 130, 160, 190].map((radius) => (
                <circle
                  key={radius}
                  cx="200"
                  cy="200"
                  r={radius}
                  stroke="currentColor"
                />
              ))}
            </svg>
            <div className="flex flex-col gap-4">
              {isFilled.keyText(slice.primary.title) && (
                <h2 className="wrap-anywhere">{slice.primary.title}</h2>
              )}
              <div
                aria-hidden="true"
                className="h-1 w-20 bg-foundation-accent"
              />

              {isFilled.richText(slice.primary.description) && (
                <div className="flex flex-col gap-4">
                  <PrismicRichText
                    field={slice.primary.description}
                    components={{
                      paragraph: ({ children }) => <p>{children}</p>,
                    }}
                  />
                </div>
              )}
            </div>
            {isFilled.keyText(slice.primary.highlight_text) && (
              <p className="text-foundation-white/90 header4 font-sans font-normal space-y-3 border-t border-foundation-gold/80 pt-5 md:pt-5 xl:pt-6 [&_a]:text-inherit [&_a]:underline">
                {slice.primary.highlight_text}
              </p>
            )}
          </div>
        )}

        {statements.length > 0 && (
          <ol className="m-0 flex flex-1 list-none flex-col divide-y divide-foundation-gold/70 p-0">
            {statements.map((item, index) => (
              <li
                key={index}
                className="m-0 flex flex-1 items-center gap-4 py-4 sm:gap-5 sm:py-5 md:gap-6 md:py-6 lg:gap-7 lg:py-7 xl:gap-8 xl:py-8"
              >
                <span
                  aria-hidden="true"
                  className="w-12 shrink-0 font-serif text-8xl leading-none font-normal tabular-nums text-foundation-accent md:w-14 md:text-9xl xl:w-16 xl:text-10xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="min-w-0 wrap-anywhere font-sans leading-snug font-semibold text-foundation-ink header3">
                  {item.impact_statement}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
