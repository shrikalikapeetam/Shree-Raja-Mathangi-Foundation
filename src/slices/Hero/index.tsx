import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { asLink, isFilled, type Content } from "@prismicio/client";
import {
  PrismicLink,
  PrismicRichText,
  type SliceComponentProps,
} from "@prismicio/react";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

export default function Hero({ slice }: HeroProps) {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        slice.primary.background_color === "Light" &&
          "bg-foundation-white section-my pt-16",
        slice.primary.background_color === "Dark" &&
          "bg-legacy-surface section-py border-y border-orange-100",
      )}
      id={slice.primary.anchor_id || ""}
    >
      <div
        className={cn(
          "container",
          slice.primary.background_color === "Dark" && "pt-16",
        )}
      >
        <div
          className={cn(
            " flex flex-col items-center text-center gap-5",
            !slice.primary.background_type
              ? "bg-legacy-surface p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20 shadow shadow-amber-50 border border-legacy-sand rounded-2xl"
              : "bg-transparent",
          )}
        >
          {isFilled.keyText(slice.primary.pre_title) && (
            <span
              className={cn(
                "text-base font-semibold text-foundation-ink",
                slice.primary.pre_title_background_color === "Light" &&
                  "bg-yellow-100/60 shadow shadow-amber-50 border border-orange-200 rounded-4xl px-4 py-1",
                slice.primary.pre_title_background_color === "Dark" &&
                  "bg-foundation-gold",
              )}
            >
              {slice.primary.pre_title}
            </span>
          )}

          <PrismicRichText
            field={slice.primary.content}
            components={{
              heading1: ({ children }) => (
                <h1 className={"text-foundation-ink font-bold"}>{children}</h1>
              ),
              heading2: ({ children }) => (
                <h2 className={"text-foundation-ink font-bold"}>{children}</h2>
              ),
              heading3: ({ children }) => (
                <h3 className={"text-foundation-ink font-bold"}>{children}</h3>
              ),
              heading4: ({ children }) => (
                <h4 className={"text-foundation-ink font-bold"}>{children}</h4>
              ),
              heading5: ({ children }) => (
                <h5 className={"text-foundation-ink font-bold"}>{children}</h5>
              ),
              heading6: ({ children }) => (
                <h6 className={"text-foundation-ink font-bold"}>{children}</h6>
              ),
              paragraph: ({ children }) => (
                <>
                  <p className={"text-foundation-body"}>{children}</p>
                </>
              ),
              strong: ({ children }) => (
                <strong className={"text-legacy-accent"}>{children}</strong>
              ),
              label: ({ node, children }) => (
                <span
                  className={
                    node.data.label === "highlight orange"
                      ? "text-foundation-accent"
                      : undefined
                  }
                >
                  {children}
                </span>
              ),
            }}
          />
          {slice.primary.cta.length > 0 && (
            <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
              {slice.primary.cta.map((cta, index) => {
                const hasLink = Boolean(asLink(cta));
                const className = cn(
                  buttonVariants({
                    variant:
                      cta.variant === "Solid Orange"
                        ? "accent"
                        : cta.variant === "Solid Blue"
                          ? "brand"
                          : cta.variant === "Solid White"
                            ? "neutral"
                            : cta.variant === "Solid Cream"
                              ? "cream"
                              : "brand",
                    size: slice.primary.cta_size ? "default" : "sm",
                  }),
                  hasLink ? "cursor-pointer" : "cursor-default",
                );

                return hasLink ? (
                  <PrismicLink
                    key={cta.key ?? index}
                    field={cta}
                    className={className}
                  >
                    {cta.text}
                  </PrismicLink>
                ) : (
                  <span key={cta.key ?? index} className={className}>
                    {cta.text}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
