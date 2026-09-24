"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Server-rendered children stay visible; motion is a progressive enhancement. */
export default function AnimatedSection({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const seen = useRef(new WeakSet<Element>());

  useEffect(() => {
    const section = ref.current;
    if (!section || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<Element, Animation>();
    const targets = new Map<HTMLElement, { mode: string; delay: number }>();
    section.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      targets.set(element, { mode: element.dataset.reveal || "up", delay: 0 });
    });
    section.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((element, index) => {
        if (element instanceof HTMLElement) {
          targets.set(element, { mode: element.dataset.reveal || "up", delay: (index % 3) * 45 });
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        if (seen.current.has(element) || preference.matches || element.contains(document.activeElement)) continue;
        seen.current.add(element);
        const { mode, delay } = targets.get(element)!;
        const transform = {
          up: "translateY(14px)",
          left: "translateX(-14px)",
          right: "translateX(14px)",
          image: "translateY(10px) scale(0.99)",
          line: "scaleX(0.2)",
          settle: "translateY(8px)",
          fade: "none",
        }[mode] || "translateY(14px)";
        const animation = element.animate(
          [
            { opacity: mode === "settle" ? 1 : 0, transform },
            { opacity: 1, transform: "none" },
          ],
          { duration: mode === "line" ? 720 : mode === "image" ? 680 : 560, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
        );
        animations.set(element, animation);
        animation.onfinish = () => animations.delete(element);
      }
    }, { threshold: 0.01, rootMargin: "0px 0px 40px 0px" });

    const start = () => {
      for (const [element, { mode }] of targets) {
        if (seen.current.has(element)) continue;
        const rect = element.getBoundingClientRect();
        // Never hide content already visible at hydration, especially the LCP heading.
        if (rect.top < window.innerHeight && rect.bottom > 0 && mode !== "line" && mode !== "settle") {
          seen.current.add(element);
        } else {
          observer.observe(element);
        }
      }
    };
    const cancel = () => {
      for (const animation of animations.values()) animation.cancel();
      animations.clear();
    };
    const handlePreference = () => {
      if (preference.matches) {
        observer.disconnect();
        cancel();
      } else start();
    };
    // Keyboard navigation must not land in a moving or transparent control.
    const handleFocus = (event: FocusEvent) => {
      for (const [element, animation] of animations) {
        if (event.target instanceof Node && element.contains(event.target)) {
          animation.cancel();
          animations.delete(element);
        }
      }
    };
    if (!preference.matches) start();
    preference.addEventListener("change", handlePreference);
    section.addEventListener("focusin", handleFocus);
    return () => {
      observer.disconnect();
      cancel();
      preference.removeEventListener("change", handlePreference);
      section.removeEventListener("focusin", handleFocus);
    };
  }, [children]);

  return <section ref={ref} className={cn("animated-section", className)} {...props}>{children}</section>;
}
