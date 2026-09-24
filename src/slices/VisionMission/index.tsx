import AnimatedSection from "@/components/AnimatedSection";
import SectionOrnament from "@/components/SectionOrnament";
import { isFilled, type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

export default function VisionMission({
  slice,
}: SliceComponentProps<Content.VisionMissionSlice>) {
  return (
    <AnimatedSection
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="container section-my"
      id={slice.primary.anchor_id || ""}
    >
      <SectionOrnament kind="sun" />
      <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 md:flex-row lg:gap-9 xl:gap-10">
        <article data-reveal="left" className="slice-panel-detail flex flex-col w-full md:max-w-md gap-6 rounded-xl border border-foundation-gold/40 bg-foundation-ink bg-(image:--banner-background) p-4 text-(--foundation-cream) shadow-lg sm:gap-7 sm:p-5 md:gap-8 md:rounded-2xl md:p-6 lg:gap-9 lg:p-7 xl:gap-10 xl:rounded-3xl xl:p-8">
          {isFilled.keyText(slice.primary.vision_pretitle) && (
            <span className="rounded-4xl border border-foundation-gold/40 bg-foundation-white/10 px-4 py-1 text-base font-semibold w-fit uppercase tracking-wider text-foundation-gold">
              {slice.primary.vision_pretitle}
            </span>
          )}
          {isFilled.keyText(slice.primary.vision_title) && (
            <h2>{slice.primary.vision_title}</h2>
          )}
          {isFilled.keyText(slice.primary.vision_quote) && (
            <blockquote className="border-l-3 header4 font-sans font-normal border-foundation-accent pl-4 leading-relaxed text-foundation-white/80 md:pl-5 xl:pl-6">
              {slice.primary.vision_quote}
            </blockquote>
          )}
        </article>

        <article data-reveal="right" className="slice-panel-detail flex min-w-0 flex-col gap-4 rounded-xl border border-foundation-gold/70 bg-legacy-surface p-4 shadow-sm sm:p-5 md:rounded-2xl md:p-6 lg:p-7 xl:rounded-3xl xl:p-8">
          {isFilled.keyText(slice.primary.mission_pretitle) && (
            <span className="rounded-4xl w-fit border border-orange-200 bg-orange-100/60 px-4 py-1 text-base font-semibold uppercase tracking-wider text-foundation-accent shadow shadow-amber-50">
              {slice.primary.mission_pretitle}
            </span>
          )}
          {isFilled.keyText(slice.primary.mission_title) && (
            <h2 className="text-foundation-ink">
              {slice.primary.mission_title}
            </h2>
          )}
          {isFilled.keyText(slice.primary.mission_description) && (
            <p className="leading-relaxed text-foundation-body">
              {slice.primary.mission_description}
            </p>
          )}
          {isFilled.group(slice.primary.pillars) && (
            <ul data-stagger className="grid list-none gap-4 p-0 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {slice.primary.pillars.map((pillar, index) =>
                isFilled.keyText(pillar.title) ||
                isFilled.keyText(pillar.description) ? (
                  <li
                    key={index}
                    className="slice-card flex min-w-0 flex-col gap-1 rounded-lg border border-foundation-gold/40 bg-foundation-white p-4 shadow-sm md:rounded-xl md:p-5 xl:rounded-2xl xl:p-6"
                  >
                    {isFilled.keyText(pillar.title) && (
                      <h3 className="font-sans text-base font-bold text-foundation-ink">
                        {pillar.title}
                      </h3>
                    )}
                    {isFilled.keyText(pillar.description) && (
                      <p className="text-base leading-relaxed text-(--foundation-muted)">
                        {pillar.description}
                      </p>
                    )}
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </article>
      </div>
    </AnimatedSection>
  );
}
