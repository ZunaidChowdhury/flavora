"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiHeart, FiUser, FiList } from "react-icons/fi";

const tabs = [
  { href: "/dashboard", label: "Overview", icon: FiGrid },
  { href: "/dashboard/my-recipes", label: "My Recipes", icon: FiList },
  { href: "/dashboard/favorites", label: "Favorites", icon: FiHeart },
  { href: "/dashboard/profile", label: "Profile", icon: FiUser },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/15 text-primary"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
