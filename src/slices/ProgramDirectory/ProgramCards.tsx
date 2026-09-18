"use client";

import { useId, useState } from "react";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { BookOpen, ChevronRight, CircleCheck, FileText, GraduationCap, HandHeart, Heart, Landmark, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const icons = { book: BookOpen, graduation: GraduationCap, heart: Heart, temple: Landmark, research: FileText, sparkles: Sparkles, community: Users };
const categories = ["Education & Scholars", "Sanctuaries & Temples", "Youth & Community"] as const;
type Programs = Content.ProgramDirectorySlice["primary"]["programs"];

export default function ProgramCards({ programs }: { programs: Programs }) {
  const [category, setCategory] = useState<string>("all");
  const gridId = useId();
  const visible = programs.map((program, index) => ({ program, index })).filter(({ program }) => category === "all" || program.category === category);
  return <>
    <div className="mt-8 mr-auto mb-12 ml-auto flex flex-wrap justify-center gap-[9px] [&_[class~='group/program-directory-filter']]:py-2.5 [&_[class~='group/program-directory-filter']]:px-4 [&_[class~='group/program-directory-filter']]:min-h-9.5 [&_[class~='group/program-directory-filter']]:h-auto [&_[class~='group/program-directory-filter']]:rounded-[12px] [&_[class~='group/program-directory-filter']]:text-[length:var(--text-md)] [&_[class~='group/program-directory-filter']]:font-semibold [&_[class~='group/program-directory-filter']]:whitespace-normal [&_[class~='group/program-directory-filter'][aria-pressed=false]]:[background:var(--foundation-surface)] [&_[class~='group/program-directory-filter'][aria-pressed=false]]:text-[color:var(--foundation-copy)] [&_[class~='group/program-directory-filter'][aria-pressed=false]]:[border-color:var(--foundation-gold)] [&_[class~='group/program-directory-filter'][aria-pressed=false]]:shadow-none max-[650.01px]:mt-6.5 max-[650.01px]:mr-auto max-[650.01px]:mb-8 max-[650.01px]:ml-auto" role="group" aria-label="Filter programs">
      {["all", ...categories].map((value) => <Button key={value} variant={category === value ? "brand" : "neutral"} aria-pressed={category === value} aria-controls={gridId} className="group/program-directory-filter" onClick={() => setCategory(value)}>{value === "all" ? `All ${programs.length} Programs` : value}</Button>)}
    </div>
    <p className="sr-only" role="status">Showing {visible.length} {visible.length === 1 ? "program" : "programs"}</p>
    <ul className="py-0 px-0 my-0 mx-auto list-none grid grid-cols-3 gap-8 max-w-305 max-[1000.01px]:grid-cols-2 max-[1000.01px]:gap-6 max-[650.01px]:grid-cols-1" id={gridId}>
      {visible.map(({ program, index }) => {
        const Icon = icons[program.icon ?? "book"];
        const ActionIcon = program.icon === "book" ? BookOpen : ["research", "sparkles", "community"].includes(program.icon ?? "") ? Users : HandHeart;
        const actionContent = <><ActionIcon className="size-4" aria-hidden="true" /><span>{program.action.text}</span><ChevronRight className="size-4" aria-hidden="true" /></>;
        return <li key={index} className={`py-7 px-7 flex flex-col min-w-0 border border-solid rounded-[24px] [background:var(--foundation-white)] [&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-2.5 [&_h3]:ml-0  [&_h3]:[font-variant-caps:small-caps] [&_h3]:font-bold [&_h3]:leading-[1.2] [&:not([class~='group/program-directory-featured'])_[class~='group/program-directory-action']]:[border-color:var(--foundation-gold)] [&:not([class~='group/program-directory-featured'])_[class~='group/program-directory-action']]:text-[color:var(--foundation-ink)] [&:not([class~='group/program-directory-featured'])_[class~='group/program-directory-action']]:[background:var(--foundation-surface)] [&:not([class~='group/program-directory-featured'])_[class~='group/program-directory-action']_svg:first-child]:text-[color:var(--foundation-accent)] max-[650.01px]:py-6 max-[650.01px]:px-6 ${index === 0 ? "group/program-directory-featured border-foundation-accent shadow-[var(--shadow-action)] [&_h3]:text-[color:var(--foundation-accent)] [&_[class~='group/program-directory-action']_svg:first-child]:text-[color:var(--foundation-gold)]" : "border-[var(--foundation-gold)]"}`}>
          <div className="flex items-center justify-between gap-3.5 mb-4.5"><span className="flex w-12 h-12 items-center justify-center shrink-0 [border:1px_solid_var(--foundation-gold)] rounded-[15px] text-[color:var(--foundation-accent)] [background:var(--foundation-cream)]"><Icon size={22} aria-hidden="true" /></span>{program.badge && <span className="py-1 px-3 text-[length:var(--text-sm)] uppercase font-semibold tracking-[.07em] leading-[1.4] [border:1px_solid_var(--foundation-highlight-line)] rounded-full text-[color:var(--foundation-accent)] [background:var(--foundation-surface)] text-center">{program.badge}</span>}</div>
          {program.title && <h3>{program.title}</h3>}
          {program.description && <p className="mt-0 mr-0 mb-4.5 ml-0 text-[color:var(--foundation-body)] leading-[1.4]">{program.description}</p>}
          {isFilled.richText(program.focus_areas) && <div className="[border-top:1px_solid_var(--foundation-gold)] pt-2.5 mb-5.5 [&_h4]:mt-0 [&_h4]:mr-0 [&_h4]:mb-3 [&_h4]:ml-0 [&_h4]:uppercase [&_h4]:text-[color:var(--foundation-muted)] [&_h4]:tracking-[.18em] [&_h4]:font-medium [&_ul]:py-0 [&_ul]:px-0 [&_ul]:my-0 [&_ul]:mx-0 [&_ul]:list-none [&_ul]:grid [&_ul]:gap-[9px] [&_li]:flex [&_li]:items-start [&_li]:gap-[9px] [&_li]:leading-[1.4] [&_li]:text-[color:var(--foundation-muted)] [&_svg]:shrink-0 [&_svg]:text-[color:var(--foundation-success)] [&_svg]:mt-[1px] [&_strong]:font-bold [&_em]:italic"><h4>Key Focus Areas</h4><PrismicRichText field={program.focus_areas} components={{listItem: ({ children }) => <li><CircleCheck size={14} aria-hidden="true" /><span>{children}</span></li>}} /></div>}
          {program.action.text && <div className="mt-auto pt-4 [border-top:1px_solid_var(--foundation-divider)] [&_[class~='group/program-directory-action']]:py-2.5 [&_[class~='group/program-directory-action']]:px-3.5 [&_[class~='group/program-directory-action']]:w-full [&_[class~='group/program-directory-action']]:h-auto [&_[class~='group/program-directory-action']]:min-h-11 [&_[class~='group/program-directory-action']]:gap-[9px] [&_[class~='group/program-directory-action']]:whitespace-normal [&_[class~='group/program-directory-action']]:text-[length:var(--text-md)] [&_[class~='group/program-directory-action']]:font-semibold [&_[class~='group/program-directory-action']]:rounded-[12px] [&_[class~='group/program-directory-action']]:shadow-none">{isFilled.link(program.action) ? <Button nativeButton={false} role="link" variant={index === 0 ? "brand" : "neutral"} className="group/program-directory-action" render={<PrismicLink field={program.action}>{actionContent}</PrismicLink>}>{actionContent}</Button> : <Button disabled variant={index === 0 ? "brand" : "neutral"} className="group/program-directory-action">{actionContent}</Button>}</div>}
        </li>;
      })}
    </ul>
    {visible.length === 0 && <p className="text-center">No programs in this category yet.</p>}
  </>;
}
