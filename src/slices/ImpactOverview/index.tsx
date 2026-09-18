import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, type SliceComponentProps } from "@prismicio/react";
import { ArrowRight, BookOpen, CircleCheck, FileText, GraduationCap, Heart, Landmark, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const icons = { graduation: GraduationCap, heart: Heart, temple: Landmark, book: BookOpen, research: FileText, community: Users };

export default function ImpactOverview({ slice }: SliceComponentProps<Content.ImpactOverviewSlice>) {
  const p = slice.primary;
  return (
    <section className="py-22.5 px-10 [background:var(--foundation-surface)] [border-block:1px_solid_var(--foundation-gold)] text-[color:var(--foundation-ink)]  max-[600.01px]:py-12 max-[600.01px]:px-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="my-0 mx-auto max-w-305">
        <header className="text-center mb-12 [&_h2]:mt-3 [&_h2]:mr-0 [&_h2]:mb-4.5 [&_h2]:ml-0  [&_h2]:font-bold [&_h2]:uppercase [&_h2]:leading-[1.2] [&_>_p]:my-0 [&_>_p]:mx-0 [&_>_p]:leading-[1.5] [&_>_p]:text-[color:var(--foundation-copy)] max-[600.01px]:mb-8">
          {p.pretitle && <span className="py-[7px] px-4 inline-flex items-center gap-2 [border:1px_solid_var(--foundation-success)] rounded-full [background:var(--foundation-success-surface)] text-[color:var(--foundation-success-ink)] text-[length:var(--text-sm)] font-bold tracking-[.12em] uppercase"><TrendingUp size={14} aria-hidden="true" />{p.pretitle}</span>}
          {p.title && <h2>{p.title}</h2>}
          {p.description && <p>{p.description}</p>}
        </header>
        {isFilled.group(p.outcomes) && <ol className="py-0 px-0 my-0 mx-0 list-none grid grid-cols-3 gap-6 max-[1000.01px]:grid-cols-2 max-[600.01px]:grid-cols-1 max-[600.01px]:gap-5">
          {p.outcomes.map((outcome, index) => {
            const Icon = icons[outcome.icon ?? "graduation"];
            return <li key={index} className="py-6 px-6 min-w-0 flex flex-col min-h-70 [border:1px_solid_var(--foundation-gold)] rounded-[17px] [background:var(--foundation-white)] shadow-[var(--shadow-pill)] [&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-3 [&_h3]:ml-0  [&_h3]:font-bold [&_h3]:[font-variant-caps:small-caps] [&_h3]:leading-[1.3]">
              <div className="flex justify-between items-center mb-3.5"><span className="flex items-center justify-center w-10.5 h-10.5 text-[color:var(--foundation-accent)] [border:1px_solid_var(--foundation-gold)] rounded-[12px] [background:var(--foundation-cream)]"><Icon size={20} aria-hidden="true" /></span><span className="text-[length:var(--text-md)] text-[color:var(--foundation-border)]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
              {outcome.title && <h3>{outcome.title}</h3>}
              {outcome.description && <p className="mt-0 mr-0 mb-4 ml-0 text-[color:var(--foundation-muted)] leading-[1.65]">{outcome.description}</p>}
              {p.commitment_label && <p className="mt-auto mr-0 mb-0 ml-0 flex items-center gap-2 pt-[13px] [border-top:1px_solid_var(--foundation-divider)] text-[color:var(--foundation-success-ink)] font-semibold leading-[1.5] [&_svg]:text-[color:var(--foundation-success)] [&_svg]:shrink-0"><CircleCheck size={15} aria-hidden="true" />{p.commitment_label}</p>}
            </li>;
          })}
        </ol>}
        {(p.banner_pretitle || p.banner_title || p.banner_description || p.actions.length > 0) && <div className="py-8 px-8 flex items-center justify-between gap-8 mt-12 [background:var(--banner-background)] [border:1px_solid_var(--foundation-border)] rounded-[16px] shadow-[var(--shadow-action)] text-[color:var(--foundation-white)] [&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-3 [&_h3]:ml-0  [&_h3]:[font-variant-caps:small-caps] [&_h3]:font-bold [&_h3]:leading-[1.35] max-[1000.01px]:flex-col max-[1000.01px]:items-start max-[600.01px]:py-6.5 max-[600.01px]:px-5.5 max-[600.01px]:mt-8">
          <div className="[flex:1] min-w-0">
            {p.banner_pretitle && <p className="mt-0 mr-0 mb-2.5 ml-0 flex items-center gap-1.5 font-bold tracking-[.1em] uppercase text-[color:var(--foundation-gold)]"><Sparkles size={14} aria-hidden="true" />{p.banner_pretitle}</p>}
            {p.banner_title && <h3>{p.banner_title}</h3>}
            {p.banner_description && <p className="my-0 mx-0 text-[color:var(--profile-overlay-copy)] leading-[1.5]">{p.banner_description}</p>}
          </div>
          {p.actions.length > 0 && <div className="flex flex-wrap gap-3 shrink-0 [&_[class~='group/impact-overview-action']]:py-3 [&_[class~='group/impact-overview-action']]:px-5 [&_[class~='group/impact-overview-action']]:min-h-11 [&_[class~='group/impact-overview-action']]:h-auto [&_[class~='group/impact-overview-action']]:gap-2 [&_[class~='group/impact-overview-action']]:rounded-[12px] [&_[class~='group/impact-overview-action']]:text-[length:var(--text-md)] [&_[class~='group/impact-overview-action']]:font-bold [&_[class~='group/impact-overview-action']]:whitespace-normal [&_[class~='group/impact-overview-action']]:leading-[1.4] [&_[class~='group/impact-overview-action']]:shadow-none [&_[class~='group/impact-overview-support']]:[background:var(--foundation-accent)] [&_[class~='group/impact-overview-volunteer']]:[background:var(--foundation-badge)] [&_[class~='group/impact-overview-volunteer']]:text-[color:var(--foundation-ink)] [&_[class~='group/impact-overview-volunteer']]:[border-color:var(--foundation-badge)] [&_[class~='group/impact-overview-volunteer']:hover]:[background:var(--foundation-cream-hover)] max-[1000.01px]:shrink max-[600.01px]:w-full max-[600.01px]:[&_[class~='group/impact-overview-action']]:w-full">{p.actions.map((action, index) => {
            if (!action.text) return null;
            const support = action.variant === "support";
            const content = <>{support && <Heart className="size-4" fill="currentColor" aria-hidden="true" />}<span>{action.text}</span>{!support && <ArrowRight className="size-4" aria-hidden="true" />}</>;
            return isFilled.link(action) ? <Button key={action.key ?? index} nativeButton={false} role="link" variant={support ? "accent" : "neutral"} className={`group/impact-overview-action ${support ? "group/impact-overview-support" : "group/impact-overview-volunteer"}`} render={<PrismicLink field={action}>{content}</PrismicLink>}>{content}</Button> : <Button key={action.key ?? index} variant={support ? "accent" : "neutral"} className={`group/impact-overview-action ${support ? "group/impact-overview-support" : "group/impact-overview-volunteer"}`} disabled>{content}</Button>;
          })}</div>}
        </div>}
      </div>
    </section>
  );
}

