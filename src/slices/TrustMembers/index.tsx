import AnimatedSection from "@/components/AnimatedSection";
import SectionOrnament from "@/components/SectionOrnament";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export default function TrustMembers({
  slice,
}: SliceComponentProps<Content.TrustMembersSlice>) {
  return (
    <AnimatedSection
      id={slice.primary.anchor_id || undefined}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="section-py overflow-hidden bg-legacy-surface text-foundation-ink"
    >
      <SectionOrnament kind="leaves" />
      <div className="container text-center items-center sm:items-start sm:text-left gap-6 flex flex-col lg:flex-row sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
        <header data-reveal="left" className="flex max-w-xs items-center sm:items-start  flex-col gap-4">
          {isFilled.keyText(slice.primary.pre_title) && (
            <span className="text-base w-fit font-semibold text-foundation-ink bg-yellow-100/60 shadow shadow-amber-50 border border-orange-200 rounded-4xl px-4 py-1">
              {slice.primary.pre_title}
            </span>
          )}
          {isFilled.richText(slice.primary.title) && (
            <PrismicRichText
              field={slice.primary.title}
              components={{
                heading2: ({ children }) => <h2>{children}</h2>,
              }}
            />
          )}
          {isFilled.richText(slice.primary.description) && (
            <div>
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
        </header>

        <ul data-stagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 m-0 p-0 gap-10">
          {slice.primary.members.map((member, index) => (
            <li key={index} className="slice-person flex items-center">
              <div className="flex items-center flex-col sm:flex-row gap-4 flex-1">
                {isFilled.image(member.profile_image) && (
                  <PrismicNextImage fallbackAlt=""
                    field={member.profile_image}
                    sizes="(min-width: 1280px) 150px, (min-width: 640px) 120px, 88px"
                    imgixParams={{ fit: "crop", ar: "1:1", q: 70 }}
                    className="slice-portrait max-w-32 sm:max-w-36 md:max-w-40 lg:max-w-44 xl:max-w-48 aspect-square w-full rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <div>
                    {isFilled.keyText(member.name) && (
                      <h3 className="text-balance header6 wrap-anywhere font-serif">
                        {member.name}
                      </h3>
                    )}
                    {isFilled.keyText(member.title) && (
                      <p className="font-semibold text-foundation-accent">
                        {member.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <div>
                      <PrismicRichText field={member.description} />
                    </div>
                    <p>{member.place}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
}
