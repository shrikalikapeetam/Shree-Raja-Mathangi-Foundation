import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { Layers } from "lucide-react";
import ProgramCards from "./ProgramCards";

export default function ProgramDirectory({ slice }: SliceComponentProps<Content.ProgramDirectorySlice>) {
  return (
    <section className="pt-10 pr-6 pb-16 pl-6 [background:var(--foundation-surface-light)]  text-[color:var(--foundation-ink)] max-[650.01px]:pt-8 max-[650.01px]:pr-5 max-[650.01px]:pb-12 max-[650.01px]:pl-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <header className="my-0 mx-auto max-w-195 text-center [&_h2]:mt-2.5 [&_h2]:mr-0 [&_h2]:mb-5 [&_h2]:ml-0  [&_h2]:font-bold [&_h2]:uppercase [&_h2]:leading-[1.2] [&_>_p]:my-0 [&_>_p]:mx-0 [&_>_p]:text-[color:var(--foundation-copy)] [&_>_p]:leading-[1.6]">
        {slice.primary.pretitle && <span className="py-[7px] px-4.5 inline-flex items-center gap-2 [background:var(--foundation-badge)] [border:1px_solid_var(--foundation-gold)] rounded-full text-[length:var(--text-sm)] font-bold tracking-[.12em] uppercase [&_svg]:text-[color:var(--foundation-accent)]"><Layers size={14} aria-hidden="true" />{slice.primary.pretitle}</span>}
        {slice.primary.title && <h2>{slice.primary.title}</h2>}
        {slice.primary.description && <p>{slice.primary.description}</p>}
      </header>
      <ProgramCards programs={slice.primary.programs} />
    </section>
  );
}

