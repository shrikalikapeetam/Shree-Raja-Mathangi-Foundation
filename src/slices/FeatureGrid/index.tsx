import AnimatedSection from "@/components/AnimatedSection";
import SectionOrnament from "@/components/SectionOrnament";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function FeatureGrid({
  slice,
}: SliceComponentProps<Content.FeatureGridSlice>) {
  return (
    <AnimatedSection
      className="section-py border-y border-orange-100 bg-legacy-surface"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={slice.primary.anchor_id || ""}
    >
      <SectionOrnament kind="diamonds" />
      <div className="container flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
        {(isFilled.keyText(slice.primary.pretitle) ||
          isFilled.keyText(slice.primary.title) ||
          isFilled.richText(slice.primary.introduction)) && (
          <header data-reveal="up" className="mx-auto flex w-full flex-col items-center gap-4 text-center">
            {isFilled.keyText(slice.primary.pretitle) && (
              <span className="w-fit rounded-4xl border border-orange-200 bg-yellow-100/60 px-4 py-1 text-base font-semibold text-foundation-ink shadow shadow-amber-50">
                {slice.primary.pretitle}
              </span>
            )}
            {isFilled.keyText(slice.primary.title) && (
              <h2 className="text-balance text-foundation-ink">
                {slice.primary.title}
              </h2>
            )}
            {isFilled.richText(slice.primary.introduction) && (
              <div className="space-y-3 max-w-3xl wrap-anywhere text-foundation-body [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-relaxed [&_strong]:text-foundation-ink">
                <PrismicRichText field={slice.primary.introduction} />
              </div>
            )}
          </header>
        )}

        {isFilled.group(slice.primary.cards) && (
          <ul data-stagger className="grid list-none gap-4 p-0 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:gap-6">
            {slice.primary.cards.map((card, index) =>
              isFilled.keyText(card.title) ||
              isFilled.keyText(card.description) ||
              isFilled.richText(card.key_description) ? (
                <li
                  key={index}
                  className="slice-card slice-card-accent flex min-w-0 flex-col gap-4 rounded-xl border border-foundation-gold/70 bg-foundation-white p-4 shadow-sm sm:p-5 md:rounded-2xl md:p-6 lg:p-7 xl:rounded-3xl xl:p-8"
                >
                  {isFilled.keyText(card.title) && (
                    <h3 className="header6 wrap-anywhere text-foundation-ink">
                      {card.title}
                    </h3>
                  )}
                  {isFilled.keyText(card.description) && (
                    <p className="wrap-anywhere leading-relaxed text-foundation-body">
                      {card.description}
                    </p>
                  )}
                  {isFilled.richText(card.key_description) && (
                    <div className="flex flex-col gap-3 border-t border-foundation-gold/40 pt-4 md:pt-5 xl:pt-6">
                      {isFilled.keyText(slice.primary.key_title) && (
                        <h4 className="font-sans text-base font-semibold text-foundation-accent">
                          {slice.primary.key_title}
                        </h4>
                      )}
                      <div className="space-y-3 wrap-anywhere text-(--foundation-muted) [&_a]:text-foundation-accent [&_a]:underline [&_a]:underline-offset-4 [&_li]:text-base [&_li]:leading-relaxed [&_p]:leading-relaxed [&_strong]:text-foundation-ink">
                        <PrismicRichText field={card.key_description} />
                      </div>
                    </div>
                  )}
                </li>
              ) : null,
            )}
          </ul>
        )}
      </div>
    </AnimatedSection>
  );
}
