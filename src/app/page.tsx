import { ArrowUpRight, HeartHandshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f4ee] text-[#26352f]">
      <div className="absolute inset-x-0 top-0 h-2 bg-[#d96b45]" />
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase">
            <span className="grid size-9 place-items-center rounded-full bg-[#26352f] text-[#f7f4ee]">
              <HeartHandshake className="size-4" />
            </span>
            SRM Foundation
          </div>
          <span className="text-sm text-[#68746d]">Prismic + Next.js</span>
        </nav>

        <div className="grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-[#d96b45] uppercase">
              <Sparkles className="size-4" />
              A place for meaningful change
            </p>
            <h1 className="max-w-3xl text-5xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-7xl">
              Building brighter futures, together.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#68746d]">
              This is your foundation for stories, initiatives, and community impact. Content will flow from Prismic as your editorial team brings it to life.
            </p>
            <Button className="mt-9 h-12 rounded-full bg-[#26352f] px-6 text-base text-[#f7f4ee] hover:bg-[#3d5148]">
              Explore our work <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-[2rem] bg-[#e8d8bd] p-8 sm:p-10">
            <div className="absolute -right-14 -bottom-16 size-56 rounded-full border-28 border-[#d96b45]/70" />
            <div className="absolute top-10 right-12 size-20 rounded-full bg-[#a9c5a0]" />
            <div className="relative flex h-full min-h-52 flex-col justify-between">
              <span className="text-5xl leading-none text-[#d96b45]">&quot;</span>
              <p className="max-w-xs text-2xl leading-tight font-medium">
                Every act of care is a seed for tomorrow.
              </p>
              <span className="text-sm font-semibold tracking-[0.16em] text-[#68746d] uppercase">
                Our founding principle
              </span>
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-4 border-t border-[#26352f]/15 pt-6 text-sm text-[#68746d] sm:flex-row sm:items-center sm:justify-between">
          <span>Community-led. Future-focused.</span>
          <span>Content managed with Prismic</span>
        </footer>
      </section>
    </main>
  );
}
