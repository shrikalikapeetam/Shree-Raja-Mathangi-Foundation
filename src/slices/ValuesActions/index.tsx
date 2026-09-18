import { isFilled, type Content } from "@prismicio/client";
import { PrismicLink, PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { Handshake, Heart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ValuesActionsProps = SliceComponentProps<Content.ValuesActionsSlice>;

const actionIcons = { accent: Heart, brand: UserPlus, neutral: Handshake };

function resolveActionVariant(value: string | null | undefined): keyof typeof actionIcons {
  switch (value) {
    case "Solid Orange":
    case "accent":
      return "accent";
    case "Solid White":
    case "neutral":
      return "neutral";
    case "Solid Blue":
    case "brand":
    default:
      return "brand";
  }
}

export default function ValuesActions({ slice }: ValuesActionsProps) {
  return (
    <section className="pt-8.5 pr-6 pb-16 pl-6 [background:var(--foundation-surface)] text-[color:var(--foundation-ink)]  text-center max-[760.01px]:pt-6 max-[760.01px]:pr-5 max-[760.01px]:pb-12 max-[760.01px]:pl-5" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      {(isFilled.keyText(slice.primary.heading) || isFilled.group(slice.primary.values)) && (
        <div className="py-6.5 px-8 max-w-269 mx-auto [border:1px_solid_var(--foundation-gold)] rounded-[26px] [background:var(--foundation-cream)] shadow-[var(--shadow-values)] max-[760.01px]:py-6 max-[760.01px]:px-6">
          {isFilled.keyText(slice.primary.heading) && <h2 className="mt-0 mr-0 mb-3 ml-0 text-[color:var(--foundation-accent)] font-bold tracking-[.12em] leading-[1.5] uppercase text-balance">{slice.primary.heading}</h2>}
          {isFilled.group(slice.primary.values) && (
            <ul className="py-0 px-0 my-0 mx-0 flex flex-wrap justify-center list-none max-[760.01px]:flex-col">
              {slice.primary.values.map((value, index) => (
                <li key={index} className="group/values-actions-value py-0 px-6 [flex:1_1_220px] [&_+_[class~='group/values-actions-value']]:[border-left:1px_solid_var(--foundation-gold)] [&_h3]:mt-0 [&_h3]:mr-0 [&_h3]:mb-2 [&_h3]:ml-0  [&_h3]:[font-variant-caps:small-caps] [&_h3]:font-bold [&_h3]:leading-[1.2] [&_p]:my-0 [&_p]:mx-0 [&_p]:text-[color:var(--foundation-accent)] [&_p]:font-semibold [&_p]:leading-[1.6] max-[760.01px]:py-5 max-[760.01px]:px-0 max-[760.01px]:[flex-basis:auto] max-[760.01px]:[&_+_[class~='group/values-actions-value']]:[border-left:0] max-[760.01px]:[&_+_[class~='group/values-actions-value']]:[border-top:1px_solid_var(--foundation-gold)]">
                  {isFilled.keyText(value.title) && <h3>{value.title}</h3>}
                  {isFilled.keyText(value.description) && <p>{value.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="mt-11.5 mr-auto mb-0 ml-auto max-w-345 [&_p]:my-0 [&_p]:mx-0 [&_p]:text-[color:var(--foundation-muted)]  [&_p]:leading-[1.4] [&_p]:text-pretty [&_p_+_p]:mt-16.5 [&_em]:italic [&_strong]:font-bold  [&_p:has(>_strong:only-child)]:text-[color:var(--foundation-ink)] [&_p:has(>_strong:only-child)]:uppercase [&_p:has(>_strong:only-child)]:tracking-[.09em] [&_p:has(>_strong:only-child)]:leading-[1.5] [&_a]:text-[color:var(--foundation-ink)] [&_a]:underline [&_a]:[text-underline-offset:.15em] max-[760.01px]:mt-8 max-[760.01px]:[&_p_+_p]:mt-9">
        <PrismicRichText field={slice.primary.content} />
      </div>
      {slice.primary.actions.length > 0 && (
        <div className="mt-6.5 mr-auto mb-0 ml-auto flex flex-wrap justify-center gap-6.5 max-w-250 [&_a]:[flex:1_1_240px] [&_button]:[flex:1_1_240px] [&_span]:max-w-37.5 [&_span]:text-balance max-[760.01px]:gap-4">
          {slice.primary.actions.map((action, index) => {
            if (!action.text) return null;
            const variant = resolveActionVariant(action.variant);
            const Icon = actionIcons[variant];
            const content = <><Icon aria-hidden="true" className="size-5" fill={variant === "accent" ? "currentColor" : "none"} /><span>{action.text}</span></>;
            return isFilled.link(action) ? (
              <Button key={action.key ?? index} variant={variant} size="action" nativeButton={false} role="link" render={<PrismicLink field={action}>{content}</PrismicLink>}>
                {content}
              </Button>
            ) : (
              <Button key={action.key ?? index} variant={variant} size="action" disabled>{content}</Button>
            );
          })}
        </div>
      )}
    </section>
  );
}

