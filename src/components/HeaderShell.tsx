"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function subscribe(onScroll: () => void) {
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

function getSnapshot() {
  return window.scrollY > 0;
}

function getServerSnapshot() {
  return false;
}

export default function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "foundation-header fixed inset-x-0 top-0 z-50 border-b py-4 transition-[background-color,box-shadow,border-color] duration-500 motion-reduce:transition-none",
        scrolled
          ? "bg-white shadow-sm border-foundation-border/50"
          : "bg-transparent shadow-none border-transparent",
      )}
    >
      {children}
    </header>
  );
}
