import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, type SliceComponentProps } from "@prismicio/react";
import { ArrowDown, Eye, Target } from "lucide-react";

export default function VisionMission({ slice }: SliceComponentProps<Content.VisionMissionSlice>) {
  const p = slice.primary;
  return <section className="py-22 px-10 [background:var(--foundation-surface-light)]  max-[600.01px]:py-10 max-[600.01px]:px-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
    <div className="my-auto mx-auto max-w-400 grid grid-cols-[0.7fr_1fr] gap-10 [&_h2]:my-7.5 [&_h2]:mx-0  [&_h2]:leading-[1.1] [&_h2]:font-bold [&_h2]:[font-variant-caps:small-caps] [&_footer]:mt-auto [&_footer]:pt-7.5 [&_footer]:flex [&_footer]:justify-between [&_footer]:items-center [&_footer]:gap-5 [&_footer]:text-[length:var(--text-sm)] [&_footer]:leading-[1.5] max-[1100.01px]:grid-cols-1 max-[1100.01px]:max-w-200 max-[600.01px]:gap-6 max-[600.01px]:[&_footer]:flex-wrap">
      <article className="py-12.5 px-12.5 min-w-0 [border:1px_solid_var(--foundation-gold)] rounded-[30px] flex flex-col [background:var(--banner-background)] shadow-[var(--shadow-action)] text-[color:var(--foundation-cream)] [&_[class~='group/vision-mission-badge']]:[background:transparent] [&_[class~='group/vision-mission-badge']]:text-[color:var(--foundation-gold)] [&_[class~='group/vision-mission-badge']]:[border:1px_solid_var(--foundation-gold)] [&_[class~='group/vision-mission-badge']_svg]:text-[color:var(--foundation-accent)] [&_blockquote]:mt-2 [&_blockquote]:mr-0 [&_blockquote]:mb-12 [&_blockquote]:ml-0 [&_blockquote]:[border-left:3px_solid_var(--foundation-accent)] [&_blockquote]:pl-5.5 [&_blockquote]:text-[color:var(--profile-overlay-copy)] [&_blockquote]:leading-[1.65] [&_footer]:text-[color:var(--foundation-gold)] [&_footer]:[border-top:1px_solid_var(--profile-overlay-copy)] max-[600.01px]:py-7 max-[600.01px]:px-6 max-[600.01px]:rounded-[24px]">
        {p.vision_pretitle && <span className="group/vision-mission-badge py-2 px-4.5 inline-flex self-start items-center gap-3 rounded-full text-[length:var(--text-sm)] font-bold tracking-[.12em] uppercase [background:var(--foundation-badge)] text-[color:var(--foundation-accent)] [&_svg]:w-5.5 [&_svg]:h-5.5 [&_svg]:shrink-0 max-[600.01px]:py-[7px] max-[600.01px]:px-3 max-[600.01px]:tracking-[.07em]"><Eye aria-hidden="true" />{p.vision_pretitle}</span>}
        {p.vision_title && <h2>{p.vision_title}</h2>}
        {p.vision_quote && <blockquote>{p.vision_quote}</blockquote>}
        <footer><span>{p.vision_footer}</span><span className="text-[color:var(--foundation-accent)] text-[length:var(--text-3xl)]" aria-hidden="true">ॐ</span></footer>
      </article>
      <article className="py-12.5 px-12.5 min-w-0 [border:1px_solid_var(--foundation-gold)] rounded-[30px] flex flex-col [background:var(--foundation-surface)] text-[color:var(--foundation-ink)] shadow-[var(--shadow-values)] [&_footer]:[border-top:1px_solid_var(--foundation-gold)] max-[600.01px]:py-7 max-[600.01px]:px-6 max-[600.01px]:rounded-[24px]">
        {p.mission_pretitle && <span className="group/vision-mission-badge py-2 px-4.5 inline-flex self-start items-center gap-3 rounded-full text-[length:var(--text-sm)] font-bold tracking-[.12em] uppercase [background:var(--foundation-badge)] text-[color:var(--foundation-accent)] [&_svg]:w-5.5 [&_svg]:h-5.5 [&_svg]:shrink-0 max-[600.01px]:py-[7px] max-[600.01px]:px-3 max-[600.01px]:tracking-[.07em]"><Target aria-hidden="true" />{p.mission_pretitle}</span>}
        {p.mission_title && <h2>{p.mission_title}</h2>}
        {p.mission_description && <p className="mt-0 mr-0 mb-8 ml-0 text-[color:var(--foundation-copy)] leading-[1.6]">{p.mission_description}</p>}
        {isFilled.group(p.pillars) && <ul className="py-0 px-0 mt-0 mr-0 mb-5.5 ml-0 list-none grid grid-cols-2 gap-4 [&_li]:py-4.5 [&_li]:px-4.5 [&_li]:flex [&_li]:gap-4 [&_li]:items-center [&_li]:[border:1px_solid_var(--foundation-gold)] [&_li]:rounded-[16px] [&_li]:[background:var(--foundation-white)] [&_li]:shadow-[var(--shadow-values)] [&_li]:min-w-0 [&_h3]:my-0 [&_h3]:mx-0 [&_h3]:font-bold [&_h3]:leading-[1.4] [&_p]:mt-0.5 [&_p]:mr-0 [&_p]:mb-0 [&_p]:ml-0 [&_p]:text-[color:var(--foundation-muted)] [&_p]:leading-[1.5] max-[600.01px]:grid-cols-1">{p.pillars.map((pillar, index) => <li key={index}>
          {pillar.icon && <span className="grid place-items-center w-10.5 h-10.5 shrink-0 rounded-[12px] [background:var(--foundation-surface)] text-[length:var(--text-xl)]" aria-hidden="true">{pillar.icon}</span>}
          <div>{pillar.title && <h3>{pillar.title}</h3>}{pillar.description && <p>{pillar.description}</p>}</div>
        </li>)}</ul>}
        <footer><span className="font-bold tracking-[.06em] uppercase">{p.directives_label}</span>{p.directives_link.text && (isFilled.link(p.directives_link) ? <PrismicLink field={p.directives_link} className="inline-flex items-center gap-1 text-[color:var(--foundation-accent)] font-bold [&_svg]:w-4.5 [&_svg]:h-4.5 [&:is(a):hover]:underline">{p.directives_link.text}<ArrowDown aria-hidden="true" /></PrismicLink> : <span className="inline-flex items-center gap-1 text-[color:var(--foundation-accent)] font-bold [&_svg]:w-4.5 [&_svg]:h-4.5 [&:is(a):hover]:underline" aria-disabled="true">{p.directives_link.text}<ArrowDown aria-hidden="true" /></span>)}</footer>
      </article>
    </div>
  </section>;
}

