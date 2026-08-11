import { FiBookOpen, FiEdit3, FiUsers } from "react-icons/fi";

const STEPS = [
  {
    icon: FiUsers,
    number: "01",
    title: "Create your account",
    description:
      "Sign up for free in seconds and become part of the Flavora community.",
  },
  {
    icon: FiEdit3,
    number: "02",
    title: "Share your recipes",
    description:
      "Add your favorite dishes with photos, ingredients, and step-by-step instructions.",
  },
  {
    icon: FiBookOpen,
    number: "03",
    title: "Cook, review & save",
    description:
      "Try what others share, rate your results, and build a favorites list for later.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-10 text-center">
        <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Process
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted leading-relaxed">
          From your first recipe to your favorites list — in three simple steps.
        </p>
      </div>

      <div className="relative">
        {/* Horizontal connector line for large screens */}
        <div className="absolute top-[42px] left-[15%] right-[15%] hidden h-0.5 border-t border-dashed border-border/70 md:block" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, number, title, description }) => (
            <div key={number} className="relative group flex flex-col rounded-3xl border border-border/70 bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between">
                {/* Icon wrapper */}
                <div className="z-10 flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-surface text-primary shadow-xs transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
                  <Icon className="size-5" />
                </div>
                <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-4xl font-black tracking-tight text-transparent">
                  {number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
