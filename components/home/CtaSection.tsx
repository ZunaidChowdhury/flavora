import Link from "next/link";
import { FiArrowRight, FiPlay } from "react-icons/fi";

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-r from-primary-hover to-primary p-8 text-center shadow-lg shadow-primary/15 md:p-14">
        {/* Glow path shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-white/10 blur-[80px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-white/10 blur-[80px]"
        />

        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Join Us
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Start cooking with Flavora
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
            Join the community, share your favorite recipes, and discover new ones
            from cooks around the world.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition-all hover:bg-white/95 hover:shadow-lg hover:scale-102"
            >
              Create your account
              <FiArrowRight className="size-4" />
            </Link>
            <Link
              href="/recipes"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <FiPlay className="size-4 fill-current text-white" />
              Browse recipes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
