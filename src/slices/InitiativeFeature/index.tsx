import { isFilled, type Content } from "@prismicio/client";
import { PrismicImage, PrismicLink, PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { ArrowRight, CircleCheck, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InitiativeFeature({ slice }: SliceComponentProps<Content.InitiativeFeatureSlice>) {
  const p = slice.primary;
  return (
    <section id={p.anchor_id || undefined} className="py-5 px-5 [background:var(--foundation-surface-light)]  scroll-mt-6 max-[600.01px]:py-4 max-[600.01px]:px-4" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="p-[clamp(28px,4vw,80px)] my-auto mx-auto max-w-500 grid grid-cols-[1fr_1fr] items-center gap-[clamp(32px,_4vw,_80px)] [border:1px_solid_var(--foundation-gold)] rounded-[40px] [background:linear-gradient(135deg,_var(--foundation-surface),_var(--foundation-surface-light))] shadow-[var(--shadow-action)] max-[900.01px]:grid-cols-1 max-[600.01px]:py-5 max-[600.01px]:px-5 max-[600.01px]:rounded-[28px] max-[600.01px]:gap-8">
        <figure className="my-0 mx-0 relative min-w-0 [aspect-ratio:4_/_3] overflow-hidden rounded-[26px] [border:2px_solid_var(--foundation-gold)] [background:var(--foundation-ink)] shadow-[var(--shadow-action)] [&::after]:content-[''] [&::after]:absolute [&::after]:inset-0 [&::after]:[background:var(--initiative-image-overlay)] max-[900.01px]:max-h-160 max-[600.01px]:[aspect-ratio:1]">
          {isFilled.image(p.image) && <PrismicImage field={p.image} className="w-full h-full object-cover" loading="lazy" />}
          <figcaption className="py-7 px-7 absolute z-1 bottom-0 left-0 right-0 text-[color:var(--foundation-cream)] [&_span]:py-[7px] [&_span]:px-5 [&_span]:inline-block [&_span]:[background:var(--foundation-accent)] [&_span]:text-[color:var(--foundation-white)] [&_span]:rounded-full [&_span]:text-[length:var(--text-sm)] [&_span]:font-bold [&_span]:tracking-[.06em] [&_span]:uppercase [&_p]:mt-3 [&_p]:mr-0 [&_p]:mb-0 [&_p]:ml-0  [&_p]:font-bold [&_p]:[font-variant-caps:small-caps] [&_p]:leading-[1.2] max-[600.01px]:py-4.5 max-[600.01px]:px-4.5 max-[600.01px]:[&_span]:py-[7px] max-[600.01px]:[&_span]:px-3">
            {p.image_badge && <span>{p.image_badge}</span>}
            {p.image_title && <p>{p.image_title}</p>}
          </figcaption>
        </figure>
        <div className="min-w-0 text-[color:var(--foundation-copy)] [&_h2]:mt-0 [&_h2]:mr-0 [&_h2]:mb-6 [&_h2]:ml-0  [&_h2]:[font-variant-caps:small-caps] [&_h2]:text-[color:var(--foundation-ink)] [&_h2]:font-bold [&_h2]:leading-[1.2]">
          {p.pretitle && <p className="mt-0 mr-0 mb-3 ml-0 text-[color:var(--foundation-accent)] font-bold tracking-[.06em] uppercase">{p.pretitle}</p>}
          {p.title && <h2>{p.title}</h2>}
          <div className="leading-[1.6] [&_p]:my-0 [&_p]:mx-0 [&_p_+_p]:mt-4 [&_strong]:font-bold [&_em]:italic [&_a]:text-[color:var(--foundation-accent)] [&_a]:underline"><PrismicRichText field={p.description} /></div>
          {isFilled.group(p.initiatives) && <div className="mt-12 [&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-5 [&_h3]:ml-0 [&_h3]:text-[color:var(--foundation-ink)] [&_h3]:uppercase [&_h3]:tracking-[.05em] [&_h3]:font-bold [&_ul]:py-0 [&_ul]:px-0 [&_ul]:my-0 [&_ul]:mx-0 [&_ul]:list-none [&_ul]:grid [&_ul]:gap-4.5 [&_li]:flex [&_li]:items-start [&_li]:gap-4.5 [&_li]:leading-[1.45] [&_svg]:shrink-0 [&_svg]:text-[color:var(--foundation-accent)] [&_svg]:mt-[3px] max-[600.01px]:mt-8">
            {p.initiatives_heading && <h3>{p.initiatives_heading}</h3>}
            <ul>{p.initiatives.map((item, index) => <li key={index}><CircleCheck size={24} aria-hidden="true" /><span>{item.description}</span></li>)}</ul>
          </div>}
          {p.actions.length > 0 && <div className="[border-top:1px_solid_var(--foundation-gold)] mt-9.5 pt-6.5 flex flex-wrap gap-4.5 [&_[class~='group/initiative-feature-action']]:py-4.5 [&_[class~='group/initiative-feature-action']]:px-7.5 [&_[class~='group/initiative-feature-action']]:max-w-full [&_[class~='group/initiative-feature-action']]:whitespace-normal [&_[class~='group/initiative-feature-action']]:gap-3.5 [&_[class~='group/initiative-feature-action']]:h-auto [&_[class~='group/initiative-feature-action']]:min-h-18 [&_[class~='group/initiative-feature-action']]:rounded-[20px] [&_[class~='group/initiative-feature-action']]:text-[length:var(--text-md)] [&_[class~='group/initiative-feature-action']]:font-bold [&_[class~='group/initiative-feature-action']]:leading-[1.3] [&_[class~='group/initiative-feature-explore']]:[background:var(--foundation-badge)] [&_[class~='group/initiative-feature-explore']]:text-[color:var(--foundation-ink)] [&_[class~='group/initiative-feature-explore']]:[border-color:var(--foundation-gold)] [&_[class~='group/initiative-feature-explore']]:shadow-none [&_[class~='group/initiative-feature-explore']_svg]:text-[color:var(--foundation-accent)] [&_[class~='group/initiative-feature-volunteer']]:[background:var(--foundation-white)] [&_[class~='group/initiative-feature-volunteer']]:text-[color:var(--foundation-ink)] [&_[class~='group/initiative-feature-volunteer']]:[border-color:var(--foundation-gold)] [&_[class~='group/initiative-feature-volunteer']]:shadow-none [&_[class~='group/initiative-feature-explore']:hover]:[background:var(--foundation-cream-hover)] [&_[class~='group/initiative-feature-volunteer']:hover]:[background:var(--foundation-cream-hover)] max-[600.01px]:[&_[class~='group/initiative-feature-action']]:py-4 max-[600.01px]:[&_[class~='group/initiative-feature-action']]:px-4 max-[600.01px]:[&_[class~='group/initiative-feature-action']]:w-full">
            {p.actions.map((action, index) => {
              if (!action.text) return null;
              const variant = action.variant ?? "sponsor";
              const content = <>{variant === "sponsor" && <Heart className="size-6" fill="currentColor" aria-hidden="true" />}{variant === "explore" && <Sparkles className="size-6" aria-hidden="true" />}<span>{action.text}</span>{variant === "volunteer" && <ArrowRight className="size-6" aria-hidden="true" />}</>;
              return isFilled.link(action) ? <Button key={action.key ?? index} nativeButton={false} role="link" variant={variant === "sponsor" ? "accent" : "neutral"} className={`group/initiative-feature-action ${(variant === "explore" ? "group/initiative-feature-explore" : variant === "volunteer" ? "group/initiative-feature-volunteer" : "")}`} render={<PrismicLink field={action}>{content}</PrismicLink>}>{content}</Button> : <Button key={action.key ?? index} variant={variant === "sponsor" ? "accent" : "neutral"} className={`group/initiative-feature-action ${(variant === "explore" ? "group/initiative-feature-explore" : variant === "volunteer" ? "group/initiative-feature-volunteer" : "")}`} disabled>{content}</Button>;
            })}
          </div>}
        </div>
      </div>
    </section>
  );
}

