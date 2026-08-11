import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import type { CategorySummary } from "@/lib/api/category.api";

export function Footer({ categories }: { categories: CategorySummary[] }) {
  return (
    <footer className="mt-16 border-t border-border/60 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-primary">
              Flavora
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              A community cookbook — share recipes, discover new flavors, and
              fall in love with cooking again.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="transition-colors hover:text-primary"
                >
                  All Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/#categories"
                  className="transition-colors hover:text-primary"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Top Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/recipes?categoryId=${category.id}`}
                    className="transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Get Started
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-primary"
                >
                  Create an account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-primary"
                >
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Flavora. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <FiHeart className="text-primary" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
