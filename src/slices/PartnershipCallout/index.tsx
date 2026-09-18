import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { ArrowRight, HandHeart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnershipCallout({ slice }: SliceComponentProps<Content.PartnershipCalloutSlice>) {
  return (
    <section className="pt-3 pr-10 pb-10 pl-10 [background:var(--foundation-surface-light)]  text-[color:var(--foundation-ink)] max-[650.01px]:pt-4 max-[650.01px]:pr-5 max-[650.01px]:pb-8 max-[650.01px]:pl-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="pt-11 pr-10 pb-10 pl-10 my-0 mx-auto max-w-305 [border:1px_solid_var(--foundation-gold)] rounded-[25px] [background:var(--foundation-surface)] shadow-[var(--shadow-values)] text-center [&_h2]:mt-0 [&_h2]:mr-auto [&_h2]:mb-4 [&_h2]:ml-auto [&_h2]:max-w-200  [&_h2]:[font-variant-caps:small-caps] [&_h2]:font-bold [&_h2]:leading-[1.2] [&_h2]:text-balance max-[650.01px]:py-7.5 max-[650.01px]:px-5.5">
        {slice.primary.pretitle && <p className="mt-0 mr-0 mb-1 ml-0 text-[color:var(--foundation-accent)] font-bold tracking-[.12em] uppercase">{slice.primary.pretitle}</p>}
        {slice.primary.title && <h2>{slice.primary.title}</h2>}
        <div className="my-0 mx-auto max-w-200 text-[color:var(--foundation-copy)] leading-[1.6] text-pretty [&_p]:my-0 [&_p]:mx-0 [&_p_+_p]:mt-3 [&_strong]:font-bold [&_em]:italic [&_a]:text-[color:var(--foundation-ink)] [&_a]:underline"><PrismicRichText field={slice.primary.content} /></div>
        {slice.primary.actions.length > 0 && <div className="flex flex-wrap justify-center gap-4 mt-6.5 [&_[class~='group/partnership-callout-action']]:py-3 [&_[class~='group/partnership-callout-action']]:px-6 [&_[class~='group/partnership-callout-action']]:min-h-11.5 [&_[class~='group/partnership-callout-action']]:h-auto [&_[class~='group/partnership-callout-action']]:max-w-full [&_[class~='group/partnership-callout-action']]:gap-2.5 [&_[class~='group/partnership-callout-action']]:rounded-[12px] [&_[class~='group/partnership-callout-action']]:whitespace-normal [&_[class~='group/partnership-callout-action']]:text-[length:var(--text-md)] [&_[class~='group/partnership-callout-action']]:font-bold [&_[class~='group/partnership-callout-action']]:leading-[1.4] [&_[class~='group/partnership-callout-donation']]:[background:var(--foundation-accent)] [&_[class~='group/partnership-callout-partnership']]:text-[color:var(--foundation-ink)] [&_[class~='group/partnership-callout-partnership']]:[background:var(--foundation-white)] [&_[class~='group/partnership-callout-partnership']]:[border-color:var(--foundation-gold)] [&_[class~='group/partnership-callout-partnership']]:shadow-none [&_[class~='group/partnership-callout-partnership']:hover]:[background:var(--foundation-cream-hover)] max-[650.01px]:gap-3 max-[650.01px]:[&_[class~='group/partnership-callout-action']]:w-full">
          {slice.primary.actions.map((action, index) => {
            if (!action.text) return null;
            const variant = action.variant ?? "donation";
            const buttonVariant = variant === "donation" ? "accent" : variant === "volunteer" ? "brand" : "neutral";
            const content = <>{variant === "donation" && <HandHeart className="size-4" aria-hidden="true" />}{variant === "volunteer" && <Users className="size-4" aria-hidden="true" />}<span>{action.text}</span>{variant === "partnership" && <ArrowRight className="size-4" aria-hidden="true" />}</>;
            return isFilled.link(action) ? <Button key={action.key ?? index} nativeButton={false} role="link" variant={buttonVariant} className={`group/partnership-callout-action ${(variant === "donation" ? "group/partnership-callout-donation" : variant === "partnership" ? "group/partnership-callout-partnership" : "")}`} render={<PrismicLink field={action}>{content}</PrismicLink>}>{content}</Button> : <Button key={action.key ?? index} variant={buttonVariant} className={`group/partnership-callout-action ${(variant === "donation" ? "group/partnership-callout-donation" : variant === "partnership" ? "group/partnership-callout-partnership" : "")}`} disabled>{content}</Button>;
          })}
        </div>}
      </div>
    </section>
  );
}

