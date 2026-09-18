import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToActionBanner({ slice }: SliceComponentProps<Content.CtaBannerSlice>) {
  return (
    <section className="pt-6.5 pr-10 pb-14 pl-10 [background:var(--foundation-surface-light)]  max-[600.01px]:pt-6 max-[600.01px]:pr-5 max-[600.01px]:pb-10 max-[600.01px]:pl-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="py-8.5 px-8 my-auto mx-auto max-w-305 flex items-center justify-between gap-10 [border:1px_solid_var(--foundation-border)] rounded-[17px] [background:var(--banner-background)] text-[color:var(--foundation-white)] shadow-[var(--shadow-action)] max-[1000.01px]:flex-col max-[1000.01px]:items-start max-[1000.01px]:gap-6 max-[600.01px]:py-6.5 max-[600.01px]:px-5.5">
        <div className="[flex:1] min-w-0">
          {slice.primary.pretitle && <p className="mt-0 mr-0 mb-2 ml-0 flex items-center gap-1.5 text-[color:var(--foundation-gold)] font-bold uppercase tracking-[.12em] [&_svg]:shrink-0"><Sparkles size={14} aria-hidden="true" />{slice.primary.pretitle}</p>}
          <div className="leading-[1.6] [&_p]:my-0 [&_p]:mx-0 [&_p_+_p]:mt-2.5 [&_strong]:font-bold [&_em]:italic [&_a]:text-[color:var(--foundation-gold)] [&_a]:underline"><PrismicRichText field={slice.primary.content} /></div>
        </div>
        {slice.primary.actions.length > 0 && <div className="flex flex-wrap items-center gap-3 shrink-0 [&_[class~='group/call-to-action-banner-action']]:py-2.5 [&_[class~='group/call-to-action-banner-action']]:px-5 [&_[class~='group/call-to-action-banner-action']]:h-auto [&_[class~='group/call-to-action-banner-action']]:min-h-10 [&_[class~='group/call-to-action-banner-action']]:gap-[9px] [&_[class~='group/call-to-action-banner-action']]:rounded-[12px] [&_[class~='group/call-to-action-banner-action']]:text-[length:var(--text-md)] [&_[class~='group/call-to-action-banner-action']]:font-bold [&_[class~='group/call-to-action-banner-action']]:leading-[1.4] [&_[class~='group/call-to-action-banner-action']]:whitespace-normal [&_[class~='group/call-to-action-banner-action']]:shadow-none [&_[class~='group/call-to-action-banner-explore']]:[background:var(--foundation-badge)] [&_[class~='group/call-to-action-banner-explore']]:text-[color:var(--foundation-ink)] [&_[class~='group/call-to-action-banner-explore']]:[border-color:var(--foundation-badge)] [&_[class~='group/call-to-action-banner-support']]:[background:var(--foundation-accent)] [&_[class~='group/call-to-action-banner-support']]:text-[color:var(--foundation-white)] [&_[class~='group/call-to-action-banner-explore']:hover]:[background:var(--foundation-cream-hover)] max-[1000.01px]:shrink max-[600.01px]:w-full max-[600.01px]:[&_[class~='group/call-to-action-banner-action']]:w-full">
          {slice.primary.actions.map((action, index) => {
            if (!action.text) return null;
            const variant = action.variant ?? "explore";
            const content = <>{variant === "support" && <Heart className="size-4" fill="currentColor" aria-hidden="true" />}<span>{action.text}</span>{variant === "explore" && <ArrowRight className="size-4" aria-hidden="true" />}</>;
            return isFilled.link(action) ? <Button key={action.key ?? index} nativeButton={false} role="link" variant={variant === "support" ? "accent" : "neutral"} className={`group/call-to-action-banner-action ${(variant === "explore" ? "group/call-to-action-banner-explore" : variant === "support" ? "group/call-to-action-banner-support" : "")}`} render={<PrismicLink field={action}>{content}</PrismicLink>}>{content}</Button> : <Button key={action.key ?? index} variant={variant === "support" ? "accent" : "neutral"} className={`group/call-to-action-banner-action ${(variant === "explore" ? "group/call-to-action-banner-explore" : variant === "support" ? "group/call-to-action-banner-support" : "")}`} disabled>{content}</Button>;
          })}
        </div>}
      </div>
    </section>
  );
}

