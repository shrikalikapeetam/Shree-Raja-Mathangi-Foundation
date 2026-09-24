import AnimatedSection from "@/components/AnimatedSection";
import SectionOrnament from "@/components/SectionOrnament";
import { asLinkAttrs, isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { linkResolver } from "@/prismicio";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function PillarFeature({
  slice,
}: SliceComponentProps<Content.PillarFeatureSlice>) {
  const primary = slice.primary;
  const images = [primary.featured_image, primary.additional_image].filter(
    isFilled.image,
  );
  const statistics = primary.statistics.filter(
    (item) => item.value || item.label,
  );
  const donations = primary.donations.filter(
    (item) => item.label && item.amount !== null,
  );
  const hasDetails =
    isFilled.richText(primary.project_title) ||
    isFilled.richText(primary.project_content) ||
    statistics.length > 0;
  const { href, target, rel } = asLinkAttrs(primary.cta, { linkResolver });
  const action = primary.cta.text && (
    <Link
      href={href || "/contact"}
      target={target}
      rel={rel}
      className={cn("slice-action", buttonVariants({ variant: "accent" }))}
    >
      {primary.cta.text}
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  );

  return (
    <AnimatedSection
      id={slice.primary.anchor_id || ""}
      className="container section-my"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <SectionOrnament kind="arches" />
      <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
        <header data-reveal="up" className="flex flex-col gap-4">
          {primary.pillar_name && (
            <p className="flex items-center gap-4 text-base font-semibold text-foundation-accent uppercase">
              {primary.pillar_name}
              <span
                aria-hidden="true"
                data-reveal="line"
                className="h-px w-12 shrink-0 bg-foundation-accent"
              />
            </p>
          )}
          {isFilled.richText(primary.title) && (
            <div className="text-foundation-ink wrap-anywhere">
              <PrismicRichText field={primary.title} />
            </div>
          )}
        </header>

        <div
          className={cn(
            "grid items-start gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10",
            images.length > 0 && "md:grid-cols-2",
          )}
        >
          {images.length > 0 && (
            <figure data-reveal={primary.image_on_right ? "right" : "left"} className={cn(primary.image_on_right && "md:order-2")}>
              {images.map((field, index) => (
                <div
                  key={index}
                  className="slice-image relative aspect-[3/2] overflow-hidden rounded-xl bg-legacy-surface md:rounded-2xl"
                >
                  <PrismicNextImage
                    field={{
                      ...field,
                      alt: field.alt || primary.pillar_name || "",
                    }}
                    fallbackAlt=""
                    imgixParams={{ q: 40 }}
                    fill
                    sizes="(min-width: 1280px) 588px, (min-width: 768px) calc((100vw - 80px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                    className="object-cover"
                  />
                </div>
              ))}
            </figure>
          )}
          <div data-reveal={primary.image_on_right ? "left" : "right"} className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            {isFilled.richText(primary.introduction) && (
              <div className="text-foundation-body wrap-anywhere [&_p]:leading-relaxed [&_a]:text-foundation-accent [&_a]:underline">
                <PrismicRichText field={primary.introduction} />
              </div>
            )}
            {isFilled.richText(primary.initiatives) && (
              <div className="flex flex-col gap-4">
                {primary.initiatives_title && (
                  <h3 className="text-foundation-ink">
                    {primary.initiatives_title}
                  </h3>
                )}
                <PrismicRichText
                  field={primary.initiatives}
                  components={{
                    list: ({ children }) => (
                      <ul data-stagger className="m-0 grid list-none gap-x-4 gap-y-4 p-0 sm:grid-cols-2">
                        {children}
                      </ul>
                    ),
                    listItem: ({ children }) => (
                      <li className="flex items-start gap-2 leading-relaxed text-foundation-body">
                        <Check
                          aria-hidden="true"
                          className="mt-2 size-4 shrink-0 rounded-full bg-foundation-accent p-0.5 text-white"
                        />
                        <span className="min-w-0 wrap-anywhere">
                          {children}
                        </span>
                      </li>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {(hasDetails || donations.length > 0 || action) && (
          <div
            data-reveal="up"
            className={cn(
              "slice-panel-detail grid gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 rounded-xl border border-foundation-gold/70 bg-legacy-surface p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8  md:rounded-2xl",
              hasDetails && donations.length > 0 && "lg:grid-cols-[1.1fr_1fr]",
            )}
          >
            {(hasDetails || donations.length === 0) && (
              <div className="flex min-w-0 flex-col gap-4">
                {isFilled.richText(primary.project_title) && (
                  <div className="text-foundation-ink wrap-anywhere">
                    <PrismicRichText field={primary.project_title} />
                  </div>
                )}
                {isFilled.richText(primary.project_content) && (
                  <div className="text-foundation-body wrap-anywhere [&_p]:leading-relaxed [&_a]:text-foundation-accent [&_a]:underline">
                    <PrismicRichText field={primary.project_content} />
                  </div>
                )}
                {statistics.length > 0 && (
                  <dl className="flex flex-wrap gap-4 border-y border-foundation-gold/50 py-4">
                    {statistics.map((item, index) => (
                      <div
                        key={index}
                        className="flex min-w-0 flex-1 flex-col gap-1 text-center"
                      >
                        <dt className="order-2 text-base leading-relaxed text-foundation-body wrap-anywhere">
                          {item.label}
                        </dt>
                        <dd className="font-heading font-bold text-foundation-ink wrap-anywhere header4">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                {donations.length === 0 && action}
              </div>
            )}
            {donations.length > 0 && (
              <div
                className={cn(
                  "flex flex-col gap-4",
                  hasDetails &&
                    "border-t border-foundation-gold/70 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8",
                )}
              >
                {primary.donations_title && (
                  <h3 className="text-foundation-ink">
                    {primary.donations_title}
                  </h3>
                )}
                <dl className="overflow-hidden rounded-lg border border-foundation-gold/70">
                  {donations.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_auto] border-b border-foundation-gold/50 last:border-b-0"
                    >
                      <dt className="p-4 text-base text-foundation-body wrap-anywhere">
                        {item.label}
                      </dt>
                      <dd className="border-l border-foundation-gold/50 p-4 text-base font-semibold text-foundation-ink tabular-nums">
                        {currency.format(item.amount!)}
                      </dd>
                    </div>
                  ))}
                </dl>
                {action}
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
