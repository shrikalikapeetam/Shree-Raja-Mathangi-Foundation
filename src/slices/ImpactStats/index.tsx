import { isFilled, type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

export type ImpactStatsProps = SliceComponentProps<Content.ImpactStatsSlice>;

export default function ImpactStats({ slice }: ImpactStatsProps) {
  if (!isFilled.group(slice.primary.stats)) return null;

  return (
    <section className="py-15 px-6 [background:var(--foundation-surface-light)]  max-[600.01px]:py-10 max-[600.01px]:px-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation} aria-label="Our impact">
      <dl className="my-0 mx-auto grid grid-cols-4 gap-9.5 max-w-410 max-[1100.01px]:grid-cols-2 max-[1100.01px]:gap-6 max-[600.01px]:grid-cols-1 max-[600.01px]:gap-5">
        {slice.primary.stats.map((stat, index) => (
          <div className="pt-6.5 pr-6 pb-8 pl-6 min-h-50 [border:1px_solid_var(--foundation-gold)] rounded-[26px] [background:var(--foundation-white)] shadow-[var(--shadow-values)] text-center max-[600.01px]:min-h-45" key={index}>
            <dt className="text-[color:var(--foundation-accent)]  text-[length:clamp(var(--text-6xl),_4vw,_var(--text-10xl))] font-bold leading-[1.2]">
              {stat.title?.endsWith("+") ? <>{stat.title.slice(0, -1)}<span className="text-[length:0.65em]">+</span></> : stat.title}
            </dt>
            <dd className="mt-2 mr-0 mb-0 ml-0 text-[color:var(--foundation-ink)] text-[length:var(--text-md)] font-bold leading-[1.4] text-balance">{stat.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

