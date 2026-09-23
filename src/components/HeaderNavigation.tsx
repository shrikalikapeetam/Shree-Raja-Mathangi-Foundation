"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type HeaderLink = {
  key: string;
  text: string;
  href: string | null;
  target?: string;
  rel?: string;
  variant?: "Primary" | "Secondary" | "Tertiary";
};

const actionVariants = {
  Primary: "accent",
  Secondary: "brand",
  Tertiary: "cream",
} as const;

export default function HeaderNavigation({
  links,
  actions,
}: {
  links: HeaderLink[];
  actions: HeaderLink[];
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setOpenPath(null);
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  if (links.length === 0 && actions.length === 0) return null;

  function renderNavigation(mobile = false) {
    return (
      <nav
        aria-label={mobile ? "Mobile navigation" : "Main navigation"}
        className={cn(
          mobile
            ? "flex flex-1 flex-col gap-8 overflow-y-auto p-6"
            : "hidden lg:flex items-center gap-9 xl:gap-10",
        )}
      >
        {links.length > 0 && (
          <ul
            className={cn(
              "m-0 flex list-none p-0 gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10",
              mobile ? "flex-col" : "flex-row",
            )}
          >
            {links.map((link) => {
              const active = link.href === pathname;
              return (
                <li key={link.key} className="text-base">
                  <Link
                    href={link.href!}
                    target={link.target}
                    rel={link.rel}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenPath(null)}
                    className={cn(
                      "block text-md md:text-lg xl:text-xl font-medium text-foundation-ink transition-colors hover:text-foundation-accent hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foundation-accent",
                      active && "text-foundation-accent",
                    )}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {actions.length > 0 && (
          <div
            className={cn(
              "flex",
              mobile
                ? "mt-auto flex-col gap-3 border-t border-foundation-border pt-6"
                : "flex-wrap gap-9 xl:gap-10",
            )}
          >
            {actions.map((action) => (
              <Button
                key={action.key}
                type="button"
                variant={actionVariants[action.variant ?? "Primary"]}
                disabled
                className={cn("cursor-not-allowed opacity-50")}
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}
      </nav>
    );
  }

  return (
    <>
      {renderNavigation()}
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => setOpenPath(nextOpen ? pathname : null)}
      >
        <SheetTrigger
          aria-label="Open navigation menu"
          render={
            <Button
              variant="outline"
              size="icon"
              className="size-11 shrink-0 text-foundation-ink lg:hidden"
            />
          }
        >
          <Menu aria-hidden="true" className="size-6" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="gap-0 bg-white text-foundation-ink motion-reduce:transition-none"
        >
          <SheetHeader className="border-b border-foundation-border p-6 pr-12">
            <SheetTitle className="text-xl text-foundation-ink">
              Menu
            </SheetTitle>
            <SheetDescription className="sr-only">
              Explore the foundation’s pages and ways to get involved.
            </SheetDescription>
          </SheetHeader>
          {renderNavigation(true)}
        </SheetContent>
      </Sheet>
    </>
  );
}
