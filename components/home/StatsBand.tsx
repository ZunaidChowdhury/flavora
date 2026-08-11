import { FiBookOpen, FiFolder, FiMessageSquare } from "react-icons/fi";

export function StatsBand({
  recipes,
  categories,
  reviews,
}: {
  recipes: number;
  categories: number;
  reviews: number;
}) {
  const stats = [
    { icon: FiBookOpen, label: "Recipes shared", value: recipes },
    { icon: FiFolder, label: "Categories to explore", value: categories },
    { icon: FiMessageSquare, label: "Reviews & ratings", value: reviews },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-surface via-surface-secondary/30 to-surface p-8 shadow-xs md:p-12">
        {/* Glow effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/8 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/8 blur-[100px]"
        />
        
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 divide-y divide-border/60 sm:divide-y-0 sm:divide-x">
          {stats.map(({ icon: Icon, label, value }, idx) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-3 text-center ${idx > 0 ? "pt-6 sm:pt-0 sm:pl-4" : ""}`}
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-4xl font-black tracking-tight text-foreground">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
