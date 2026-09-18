import { isFilled, type Content } from "@prismicio/client";
import { PrismicImage, PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { Heart, Mountain, Quote, Sparkles } from "lucide-react";

export default function FeaturedProfile({ slice }: SliceComponentProps<Content.FeaturedProfileSlice>) {
  const p = slice.primary;
  return (
    <section className="pt-8 pr-7.5 pb-16 pl-7.5 [background:var(--foundation-surface)] text-[color:var(--foundation-ink)]  max-[800.01px]:pt-8 max-[800.01px]:pr-5 max-[800.01px]:pb-12 max-[800.01px]:pl-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <header className="text-center mb-20 [&_h2]:mt-2.5 [&_h2]:mr-0 [&_h2]:mb-0 [&_h2]:ml-0  [&_h2]:[font-variant-caps:small-caps] [&_h2]:font-bold [&_h2]:leading-[1.2] [&::after]:mt-5 [&::after]:mr-auto [&::after]:mb-0 [&::after]:ml-auto [&::after]:content-[''] [&::after]:block [&::after]:w-32 [&::after]:h-1.5 [&::after]:rounded-full [&::after]:[background:linear-gradient(90deg,_var(--foundation-accent),_var(--foundation-gold))] max-[800.01px]:mb-10">
        {p.pretitle && <span className="py-1.5 px-5 inline-flex items-center gap-3 rounded-full [background:var(--foundation-badge)] text-[color:var(--foundation-accent)] text-[length:var(--text-sm)] font-bold tracking-[.12em] uppercase"><Sparkles size={18} aria-hidden="true" />{p.pretitle}</span>}
        {p.title && <h2>{p.title}</h2>}
      </header>
      <div className="my-auto mx-auto grid grid-cols-[5fr_7fr] max-w-405 [border:1px_solid_var(--foundation-gold)] rounded-[32px] overflow-hidden [background:var(--foundation-white)] shadow-[var(--shadow-action)] max-[800.01px]:grid-cols-1">
        <div className="relative flex items-end min-w-0 min-h-162.5 [background:var(--foundation-ink)] [&::after]:content-[''] [&::after]:absolute [&::after]:inset-0 [&::after]:[background:var(--profile-image-overlay)] max-[800.01px]:min-h-140">
          {isFilled.image(p.featured_image) && <PrismicImage field={p.featured_image} className="absolute inset-0 w-full h-full object-cover" />}
          <div className="py-11 px-11 relative z-1 text-[color:var(--foundation-cream)] w-full [&_h3]:mt-3.5 [&_h3]:mr-0 [&_h3]:mb-5 [&_h3]:ml-0  [&_h3]:[font-variant-caps:small-caps] [&_h3]:leading-[1.2] [&_h3]:font-bold [&_>_p]:mt-0 [&_>_p]:mr-0 [&_>_p]:mb-4 [&_>_p]:ml-0 [&_>_p]:text-[color:var(--foundation-gold)] max-[1100.01px]:py-7 max-[1100.01px]:px-7 max-[800.01px]:py-7 max-[800.01px]:px-6">
            {p.overlay_pretitle && <span className="py-[5px] px-4 inline-flex items-center gap-2.5 [border:1px_solid_var(--foundation-gold)] rounded-full text-[color:var(--foundation-gold)] [background:var(--profile-location-background)] text-[length:var(--text-sm)]"><Mountain size={18} aria-hidden="true" />{p.overlay_pretitle}</span>}
            {p.overlay_title && <h3>{p.overlay_title}</h3>}
            {p.overlay_description && <p>{p.overlay_description}</p>}
            {isFilled.richText(p.overlay_details) && <div className="[border-top:1px_solid_var(--profile-overlay-border)] pt-3.5 text-[color:var(--profile-overlay-copy)] [&_ul]:my-0 [&_ul]:mx-0 [&_ul]:list-disc [&_ul]:pl-4.5 [&_li::marker]:text-[color:var(--foundation-accent)] [&_strong]:font-bold"><PrismicRichText field={p.overlay_details} /></div>}
          </div>
        </div>
        <div className="py-15 px-16 min-w-0 [&_strong]:font-bold [&_em]:italic [&_a]:underline [&_a]:text-[color:var(--foundation-accent)] max-[1100.01px]:py-9 max-[1100.01px]:px-9 max-[800.01px]:py-7 max-[800.01px]:px-6">
          <div className="[&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-7.5 [&_h3]:ml-0  [&_h3]:[font-variant-caps:small-caps] [&_h3]:leading-[1.2] [&_h3]:font-bold [&_h3]:text-[color:var(--foundation-ink)] text-[color:var(--foundation-copy)] leading-[1.65] [&_h4]:mt-0 [&_h4]:mr-0 [&_h4]:mb-1 [&_h4]:ml-0 [&_h4]:text-[color:var(--foundation-accent)]  [&_h4]:uppercase [&_h4]:tracking-[.06em] [&_h4]:font-bold [&_p]:mt-0 [&_p]:mr-0 [&_p]:mb-6 [&_p]:ml-0 [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal"><PrismicRichText field={p.content} /></div>
          {(p.callout_title || isFilled.richText(p.callout_content)) && <aside className="py-6 px-7 [border:1px_solid_var(--foundation-gold)] rounded-[22px] [background:var(--foundation-cream)] text-[color:var(--foundation-copy)] leading-[1.6] [&_h4]:mt-0 [&_h4]:mr-0 [&_h4]:mb-3.5 [&_h4]:ml-0 [&_h4]:flex [&_h4]:items-center [&_h4]:gap-3 [&_h4]:text-[color:var(--foundation-ink)]  [&_h4]:[font-variant-caps:small-caps] [&_h4]:font-bold [&_svg]:shrink-0 [&_svg]:text-[color:var(--foundation-accent)] [&_p]:my-0 [&_p]:mx-0 max-[800.01px]:py-5 max-[800.01px]:px-5">
            {p.callout_title && <h4><Heart size={20} fill="currentColor" aria-hidden="true" />{p.callout_title}</h4>}
            <PrismicRichText field={p.callout_content} />
          </aside>}
          {isFilled.richText(p.quote) && <blockquote className="[&_p]:my-0 [&_p]:mx-0 mt-8 mr-0 mb-0 ml-0 flex gap-4.5 [border-top:1px_solid_var(--foundation-gold)] pt-6  italic leading-[1.5] [&_>_svg]:shrink-0 [&_>_svg]:text-[color:var(--foundation-accent)]"><Quote size={38} aria-hidden="true" /><div><PrismicRichText field={p.quote} /></div></blockquote>}
        </div>
      </div>
    </section>
  );
}

