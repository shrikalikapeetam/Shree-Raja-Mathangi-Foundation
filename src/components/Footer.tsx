import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { Button } from "@/components/ui/button";
import { getLayout } from "@/prismicio";
import Link from "next/link";

export default async function Footer() {
  const layout = await getLayout();
  if (!layout) return null;

  return (
    <footer>
      <section
        id="get-involved"
        aria-label={layout.data.involve_title ?? undefined}
        className="relative isolate overflow-hidden bg-legacy-surface"
      >
        {isFilled.image(layout.data.featured_image) && (
          <PrismicNextImage
            field={layout.data.featured_image}
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none -z-10 object-cover object-center"
          />
        )}
        <div className="container section-py flex flex-col items-center gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10">
          {(layout.data.involve_title || layout.data.description) && (
            <div className="flex max-w-4xl flex-col items-center gap-5 text-center md:gap-6">
              {layout.data.involve_title && (
                <span className="bg-foundation-gold text-base font-semibold text-foundation-ink rounded-4xl px-4 py-1">
                  {layout.data.involve_title}
                </span>
              )}
              {layout.data.description && (
                <h2 className="text-foundation-ink max-w-lg">
                  {layout.data.description}
                </h2>
              )}
            </div>
          )}

          {layout.data.involve_cta.length > 0 && (
            <ul className="m-0 w-full grid list-none gap-4 md:gap-5 p-0 sm:grid-cols-2 md:grid-cols-3 xl:gap-6">
              {layout.data.involve_cta.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="flex gap-4 flex-col items-start rounded-lg md:rounded-xl xl:rounded-2xl border border-orange-300 bg-white p-4 sm:p-5 md:p-6 shadow-sm lg:p-7 xl:p-8"
                  >
                    {item.cta.text && (
                      <h3 className="text-foundation-ink uppercase wrap-anywhere">
                        {item.cta.text}
                      </h3>
                    )}
                    {item.text && (
                      <p className="leading-relaxed text-foundation-body wrap-anywhere">
                        {item.text}
                      </p>
                    )}
                    {item.cta.text && (
                      <Button variant="accent">{item.cta.text}</Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <div className="border-t border-foundation-border/60 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 py-4 text-center md:flex-row md:gap-5 xl:gap-6 md:text-left">
          {(isFilled.image(layout.data.logo) || layout.data.brandName) && (
            <Link
              href="/"
              aria-label={
                layout.data.brandName
                  ? `${layout.data.brandName} — Home`
                  : "Home"
              }
              className="flex min-w-0 items-center gap-2 md:gap-3 rounded-md text-foundation-ink hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foundation-accent xl:gap-4"
            >
              {isFilled.image(layout.data.logo) && (
                <PrismicNextImage
                  field={layout.data.logo}
                  alt=""
                  width={64}
                  height={64}
                  sizes="64px"
                  className="size-14 md:size-16 xl:size-20 shrink-0 object-contain"
                />
              )}
              {layout.data.trust_name && layout.data.trust_name2 && (
                <span className="flex min-w-0 flex-col gap-1 font-heading">
                  {layout.data.trust_name && (
                    <span className="text-xs md:text-sm xl:text-md font-bold leading-snug wrap-anywhere">
                      {layout.data.trust_name}
                    </span>
                  )}
                  {layout.data.trust_name2 && (
                    <span className="text-xs md:text-base xl:text-sm font-semibold tracking-[0.12em] text-foundation-accent uppercase wrap-anywhere">
                      {layout.data.trust_name2}
                    </span>
                  )}
                </span>
              )}
            </Link>
          )}
          {layout.data.copyright_text && (
            <p className="leading-relaxed text-foundation-body wrap-anywhere md:text-right">
              {layout.data.copyright_text}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
