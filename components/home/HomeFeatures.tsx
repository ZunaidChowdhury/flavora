import { FiCompass, FiHeart, FiUploadCloud } from "react-icons/fi";

const FEATURES = [
  {
    icon: FiCompass,
    title: "Discover new flavors",
    description:
      "Browse a growing collection of recipes shared by home cooks and chefs, searchable by keyword and category.",
  },
  {
    icon: FiUploadCloud,
    title: "Share your cooking",
    description:
      "Publish your own recipes in minutes — add photos, ingredients, and step-by-step instructions for everyone to try.",
  },
  {
    icon: FiHeart,
    title: "Review & save favorites",
    description:
      "Rate the recipes you cook, leave helpful reviews for the community, and keep your favorites in one place.",
  },
];

export function HomeFeatures() {
  return (
    <section id="about" className="mx-auto w-full max-w-7xl">
      <div className="mb-10 text-center">
        <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Features
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Why Flavora?
        </h2>
        <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted leading-relaxed">
          Everything you need to cook, share, and fall in love with food again.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group relative rounded-3xl border border-border/70 bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Glow backing */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
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
    </section>
  );
}
