import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { Building2, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FoundationOverview({ slice }: SliceComponentProps<Content.FoundationOverviewSlice>) {
  const p = slice.primary;
  return <section className="py-27.5 px-10 [border-top:1px_solid_var(--foundation-gold)] [border-bottom:3px_solid_var(--foundation-accent)] [background:var(--foundation-surface)] text-[color:var(--foundation-ink)]  max-[1000.01px]:py-16 max-[1000.01px]:px-7.5 max-[600.01px]:py-12 max-[600.01px]:px-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
    <div className="my-auto mx-auto max-w-305 grid grid-cols-[1fr_1fr] items-center gap-14 max-[1000.01px]:grid-cols-1 max-[1000.01px]:gap-10 max-[1000.01px]:max-w-190">
      <div className="min-w-0 [&_h2]:mt-5.5 [&_h2]:mr-0 [&_h2]:mb-6.5 [&_h2]:ml-0  [&_h2]:[font-variant-caps:small-caps] [&_h2]:font-bold [&_h2]:leading-[1]">
        {p.pretitle && <span className="py-[5px] px-3.5 inline-flex gap-2 items-center rounded-full [background:var(--foundation-badge)] text-[length:var(--text-sm)] font-bold tracking-[.1em] uppercase [&_svg]:text-[color:var(--foundation-accent)]"><Sparkles size={14} aria-hidden="true" />{p.pretitle}</span>}
        {p.title && <h2>{p.title}</h2>}
        <div className="text-[color:var(--foundation-copy)] leading-[1.65] [&_p]:my-0 [&_p]:mx-0 [&_p_+_p]:mt-6 [&_p:first-child_strong]:text-[color:var(--foundation-ink)] [&_strong]:font-bold [&_em]:italic [&_a]:underline [&_a]:text-[color:var(--foundation-ink)]"><PrismicRichText field={p.content} /></div>
        {(p.highlights_title || isFilled.richText(p.highlights)) && <aside className="[&_strong]:font-bold [&_em]:italic [&_a]:underline [&_a]:text-[color:var(--foundation-ink)] py-5.5 px-5.5 mt-6.5 [background:var(--foundation-white)] [border:1px_solid_var(--foundation-gold)] rounded-[16px] shadow-[var(--shadow-values)] [&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-4 [&_h3]:ml-0 [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-[.08em] [&_ul]:py-0 [&_ul]:px-0 [&_ul]:my-0 [&_ul]:mx-0 [&_ul]:list-none [&_ul]:grid [&_ul]:gap-3 [&_li]:flex [&_li]:items-start [&_li]:gap-2.5 [&_li]:leading-[1.4] [&_li]:text-[color:var(--foundation-copy)] [&_svg]:text-[color:var(--foundation-success)] [&_svg]:shrink-0 [&_svg]:mt-[1px]">
          {p.highlights_title && <h3>{p.highlights_title}</h3>}
          <PrismicRichText field={p.highlights} components={{listItem: ({ children }) => <li><ShieldCheck size={16} aria-hidden="true" /><span>{children}</span></li>}} />
        </aside>}
        {p.actions.length > 0 && <div className="flex flex-wrap gap-3 mt-8 [&_[class~='group/foundation-overview-action']]:py-3 [&_[class~='group/foundation-overview-action']]:px-5.5 [&_[class~='group/foundation-overview-action']]:min-h-11 [&_[class~='group/foundation-overview-action']]:h-auto [&_[class~='group/foundation-overview-action']]:gap-[9px] [&_[class~='group/foundation-overview-action']]:text-[length:var(--text-md)] [&_[class~='group/foundation-overview-action']]:leading-[1.4] [&_[class~='group/foundation-overview-action']]:font-bold [&_[class~='group/foundation-overview-action']]:rounded-[12px] [&_[class~='group/foundation-overview-action']]:whitespace-normal [&_[class~='group/foundation-overview-support']]:[background:var(--foundation-accent)] [&_[class~='group/foundation-overview-vision']]:[background:var(--foundation-badge)] [&_[class~='group/foundation-overview-vision']]:text-[color:var(--foundation-ink)] [&_[class~='group/foundation-overview-vision']]:[border-color:var(--foundation-gold)] [&_[class~='group/foundation-overview-vision']]:shadow-none [&_[class~='group/foundation-overview-vision']_svg]:text-[color:var(--foundation-accent)] [&_[class~='group/foundation-overview-csr']]:text-[color:var(--foundation-ink)] [&_[class~='group/foundation-overview-csr']]:shadow-none max-[600.01px]:[&_[class~='group/foundation-overview-action']]:w-full">{p.actions.map((action, index) => {
          if (!action.text) return null;
          const variant = action.variant ?? "support";
          const Icon = variant === "support" ? Heart : variant === "vision" ? Sparkles : Building2;
          const content = <><Icon className="size-4" fill={variant === "support" ? "currentColor" : "none"} aria-hidden="true" /><span>{action.text}</span></>;
          return isFilled.link(action) ? <Button key={action.key ?? index} nativeButton={false} role="link" variant={variant === "support" ? "accent" : "neutral"} className={`group/foundation-overview-action ${(variant === "support" ? "group/foundation-overview-support" : variant === "vision" ? "group/foundation-overview-vision" : variant === "csr" ? "group/foundation-overview-csr" : "")}`} render={<PrismicLink field={action}>{content}</PrismicLink>}>{content}</Button> : <Button key={action.key ?? index} variant={variant === "support" ? "accent" : "neutral"} className={`group/foundation-overview-action ${(variant === "support" ? "group/foundation-overview-support" : variant === "vision" ? "group/foundation-overview-vision" : variant === "csr" ? "group/foundation-overview-csr" : "")}`} disabled>{content}</Button>;
        })}</div>}
      </div>
      <div className="py-8 px-8 min-w-0 [border:1px_solid_var(--foundation-gold)] rounded-[24px] [background:var(--foundation-white)] shadow-[var(--shadow-action)] [&_>_h3]:mt-0.5 [&_>_h3]:mr-0 [&_>_h3]:mb-2.5 [&_>_h3]:ml-0  [&_>_h3]:font-bold [&_>_h3]:[font-variant-caps:small-caps] [&_>_h3]:leading-[1.2] max-[600.01px]:py-6 max-[600.01px]:px-5">
        {p.trust_pretitle && <p className="my-0 mx-0 text-[color:var(--foundation-accent)] font-semibold uppercase tracking-[.1em]">{p.trust_pretitle}</p>}
        {p.trust_title && <h3>{p.trust_title}</h3>}
        {p.trust_description && <p className="mt-0 mr-0 mb-4.5 ml-0 pb-3.5 [border-bottom:1px_solid_var(--foundation-gold)] leading-[1.5] text-[color:var(--foundation-muted)]">{p.trust_description}</p>}
        {isFilled.group(p.trustees) && <ol className="py-0 px-0 my-0 mx-0 list-none grid grid-cols-2 gap-3.5 [&_li]:py-[15px] [&_li]:px-[15px] [&_li]:flex [&_li]:items-start [&_li]:gap-[9px] [&_li]:[background:var(--foundation-surface)] [&_li]:[border:1px_solid_var(--foundation-gold)] [&_li]:rounded-[13px] [&_li]:min-w-0 [&_h4]:mt-0.5 [&_h4]:mr-0 [&_h4]:mb-2 [&_h4]:ml-0 [&_h4]:font-bold [&_h4]:leading-[1.4] max-[600.01px]:grid-cols-1">
          {p.trustees.map((trustee, index) => <li key={index}>
            <span className="flex items-center justify-center w-6 h-6 rounded-[50%] [background:var(--foundation-gold)] shrink-0  text-[length:var(--text-md)]" aria-hidden="true">{["i", "ii", "iii", "iv"][index] ?? index + 1}</span>
            <div>{trustee.name && <h4>{trustee.name}</h4>}{trustee.role && <p className="mt-0 mr-0 mb-[7px] ml-0 text-[color:var(--foundation-accent-deep)] font-semibold leading-[1.5]">{trustee.role}</p>}{trustee.responsibility && <p className="my-0 mx-0 text-[color:var(--foundation-muted)] leading-[1.5]">{trustee.responsibility}</p>}</div>
          </li>)}
        </ol>}
        {(p.banner_text || p.volunteer.text) && <div className="py-4.5 px-4.5 mt-4.5 rounded-[16px] [background:var(--foundation-ink)] text-center [&_p]:mt-0 [&_p]:mr-0 [&_p]:mb-3 [&_p]:ml-0 [&_p]:text-[color:var(--foundation-cream)] [&_p]:leading-[1.5] [&_p]:font-bold [&_[class~='group/foundation-overview-volunteer']]:py-[7px] [&_[class~='group/foundation-overview-volunteer']]:px-4 [&_[class~='group/foundation-overview-volunteer']]:[background:var(--foundation-accent)] [&_[class~='group/foundation-overview-volunteer']]:text-[length:var(--text-sm)] [&_[class~='group/foundation-overview-volunteer']]:h-auto [&_[class~='group/foundation-overview-volunteer']]:min-h-8 [&_[class~='group/foundation-overview-volunteer']]:whitespace-normal">
          {p.banner_text && <p>{p.banner_text}</p>}
          {p.volunteer.text && (isFilled.link(p.volunteer) ? <Button nativeButton={false} role="link" variant="accent" className="group/foundation-overview-volunteer" render={<PrismicLink field={p.volunteer}>{p.volunteer.text}</PrismicLink>}>{p.volunteer.text}</Button> : <Button variant="accent" className="group/foundation-overview-volunteer" disabled>{p.volunteer.text}</Button>)}
        </div>}
      </div>
    </div>
  </section>;
}

