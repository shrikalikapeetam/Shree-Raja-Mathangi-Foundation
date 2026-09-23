import { asLinkAttrs, isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import { getLayout, linkResolver } from "@/prismicio";
import HeaderShell from "@/components/HeaderShell";
import HeaderNavigation, {
  type HeaderLink,
} from "@/components/HeaderNavigation";

function resolveLinks(
  fields: Content.LayoutDocument["data"]["cta"],
): HeaderLink[] {
  return fields.flatMap((field, index) => {
    if (!field.text?.trim()) return [];
    const { href, target, rel } = asLinkAttrs(field, { linkResolver });
    return [
      {
        key: field.key ?? String(index),
        text: field.text,
        href: href ?? null,
        target,
        rel,
        variant: field.variant,
      },
    ];
  });
}

export default async function Header() {
  const layout = await getLayout();
  if (!layout) return null;

  const { logo, trust_name, trust_name2, link, cta } = layout.data;
  const brandName = [trust_name, trust_name2].filter(Boolean).join(" ");

  return (
    <>
      <HeaderShell>
        <div className="container flex items-center justify-between lg:gap-9 md:gap-8 sm:gap-7 gap-6 xl:gap-10">
          <Link
            href="/"
            aria-label={brandName ? undefined : "Home"}
            className="flex min-w-0 items-center gap-2 md:gap-3 rounded-md text-foundation-ink hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foundation-accent xl:gap-4"
          >
            {isFilled.image(logo) && (
              <PrismicNextImage
                field={logo}
                alt=""
                width={72}
                height={72}
                sizes="(min-width: 640px) 72px, 56px"
                className="size-14 shrink-0 object-contain md:size-16 xl:size-20"
              />
            )}
            {(trust_name || trust_name2) && (
              <span className="flex flex-col gap-1 font-heading">
                {trust_name && (
                  <span className="text-xs md:text-sm xl:text-md font-bold leading-snug wrap-anywhere">
                    {trust_name}
                  </span>
                )}
                {trust_name2 && (
                  <span className="text-xs font-semibold leading-snug tracking-[0.12em] text-foundation-accent uppercase wrap-anywhere md:text-base xl:text-sm">
                    {trust_name2}
                  </span>
                )}
              </span>
            )}
          </Link>
          <HeaderNavigation
            links={resolveLinks(link).filter((item) => item.href)}
            actions={resolveLinks(cta)}
          />
        </div>
      </HeaderShell>
    </>
  );
}
