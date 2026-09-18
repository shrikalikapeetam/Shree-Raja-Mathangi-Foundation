import { isFilled, type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { Compass, GraduationCap, Heart, Landmark, ShieldCheck, Sprout, Users } from "lucide-react";

const icons = { heart: Heart, graduation: GraduationCap, sprout: Sprout, temple: Landmark, community: Users, shield: ShieldCheck };

export default function FeatureGrid({ slice }: SliceComponentProps<Content.FeatureGridSlice>) {
  const p = slice.primary;
  return (
    <section className="pt-9.5 pr-6 pb-12 pl-6 [background:linear-gradient(180deg,_var(--foundation-surface-light),_var(--foundation-surface))]  text-[color:var(--foundation-ink)] max-[600.01px]:py-9 max-[600.01px]:px-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <header className="mt-0 mr-auto mb-12 ml-auto text-center max-w-205 [&_h2]:mt-2.5 [&_h2]:mr-0 [&_h2]:mb-4 [&_h2]:ml-0  [&_h2]:font-bold [&_h2]:leading-[1.2] [&_h2]:uppercase [&_h2]:text-balance max-[600.01px]:mb-8">
        {p.pretitle && <span className="py-[7px] px-3.5 inline-flex items-center gap-2 [border:1px_solid_var(--foundation-gold)] rounded-full [background:var(--foundation-badge)] text-[color:var(--foundation-accent)] text-[length:var(--text-sm)] font-semibold uppercase tracking-[.1em]"><Compass size={14} aria-hidden="true" />{p.pretitle}</span>}
        {p.title && <h2>{p.title}</h2>}
        <div className="text-[color:var(--foundation-copy)] leading-[1.6] [&_p]:my-0 [&_p]:mx-0 [&_p_+_p]:mt-3 [&_strong]:text-[color:var(--foundation-ink)] [&_strong]:font-bold [&_em]:italic [&_a]:text-[color:var(--foundation-ink)] [&_a]:underline"><PrismicRichText field={p.introduction} /></div>
        {p.callout && <p className="py-[13px] px-6 mt-4.5 mr-auto mb-0 ml-auto max-w-168 [border:1px_solid_var(--foundation-gold)] rounded-[13px] [background:var(--foundation-badge)] leading-[1.5] max-[600.01px]:py-3.5 max-[600.01px]:px-4.5">{p.callout}</p>}
      </header>
      {isFilled.group(p.cards) && <ul className="py-0 px-0 my-0 mx-auto max-w-305 list-none grid grid-cols-3 gap-6 max-[900.01px]:grid-cols-2 max-[600.01px]:grid-cols-1 max-[600.01px]:gap-5">
        {p.cards.map((card, index) => {
          const Icon = icons[card.icon ?? "heart"];
          return <li key={index} className="py-6 px-6 flex flex-col min-w-0 min-h-70 [background:var(--foundation-white)] [border:1px_solid_var(--foundation-gold)] rounded-[17px] shadow-[var(--shadow-pill)] [&_h3]:mt-3 [&_h3]:mr-0 [&_h3]:mb-3.5 [&_h3]:ml-0  [&_h3]:font-bold [&_h3]:[font-variant-caps:small-caps] [&_h3]:leading-[1.25]">
            <span className="inline-flex w-12 h-12 items-center justify-center [border:1px_solid_var(--foundation-gold)] rounded-[13px] [background:var(--foundation-surface)] text-[color:var(--foundation-accent)]"><Icon size={20} aria-hidden="true" /></span>
            {card.title && <h3>{card.title}</h3>}
            {card.description && <p className="mt-0 mr-0 mb-2.5 ml-0 leading-[1.65] text-[color:var(--foundation-muted)]">{card.description}</p>}
            {card.footer && <p className="mt-auto mr-0 mb-0 ml-0 pt-4 [border-top:1px_solid_var(--foundation-divider)] text-[color:var(--foundation-accent)] leading-[1.5] font-medium">{card.footer}</p>}
          </li>;
        })}
      </ul>}
    </section>
  );
}

