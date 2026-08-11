"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Link as HeroLink } from "@heroui/react";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiShield,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import { logoutUser } from "@/lib/actions/auth.actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/authSlice";
import { toggleTheme } from "@/store/slices/themeSlice";

const BASE_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Recipes", href: "/recipes" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/#about" },
];

function getFirstName(name?: string | null) {
  return (name ?? "User").trim().split(/\s+/)[0] || "User";
}

function getInitials(name?: string | null) {
  const parts = (name ?? "U").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
}

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const mode = useAppSelector((s) => s.theme.mode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logoutUser();
    dispatch(clearCredentials());
    router.push("/");
  }

  const navLinks = isAuthenticated
    ? [...BASE_LINKS, { label: "Dashboard", href: "/dashboard" }]
    : BASE_LINKS;

  const centerLinks = (
    <div className="hidden items-center gap-6 md:flex">
      {navLinks.map((link) => (
        <HeroLink
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
        >
          {link.label}
        </HeroLink>
      ))}
    </div>
  );

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: FiGrid, href: "/dashboard" },
    { key: "add-recipe", label: "Add Recipe", icon: FiPlus, href: "/dashboard/my-recipes/new" },
    { key: "profile", label: "My Profile", icon: FiUser, href: "/dashboard/profile" },
    ...(user?.role === "ADMIN"
      ? [{ key: "admin", label: "Admin Panel", icon: FiShield, href: "/admin" }]
      : []),
  ];

  const profileMenu = (
    <div ref={profileRef} className="relative">
      {/* Trigger button */}
      <button
        aria-label="Open account menu"
        aria-expanded={profileOpen}
        onClick={() => setProfileOpen((v) => !v)}
        className="group flex cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-surface py-1 pl-1 pr-2.5 shadow-sm transition-all duration-200 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10 focus:outline-none"
      >
        {/* Avatar ring */}
        <span className="relative flex size-8 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-60" />
          <span className="relative flex size-8 overflow-hidden rounded-full border-2 border-border/50 transition-colors group-hover:border-primary/70">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                {getInitials(user?.name)}
              </span>
            )}
          </span>
        </span>
        {/* Chevron */}
        <FiChevronDown
          className={`size-3.5 text-muted transition-transform duration-200 ${
            profileOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 origin-top-right overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-xl shadow-foreground/10"
          >
            {/* Header card */}
            <div className="relative overflow-hidden px-4 py-3.5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
              <div className="relative flex items-center gap-3">
                <span className="flex size-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/40">
                  {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name ?? "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name ?? "User"}
                  </p>
                  <p className="truncate text-xs text-muted">{user?.email ?? ""}</p>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-border/60" />

            {/* Menu items */}
            <div className="p-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setProfileOpen(false);
                    router.push(item.href);
                  }}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground/80 transition-all duration-150 hover:bg-primary/8 hover:text-primary focus:outline-none"
                >
                  <span className="flex size-7 items-center justify-center rounded-lg bg-surface-secondary transition-colors group-hover:bg-primary/15">
                    <item.icon className="size-3.5 text-muted transition-colors group-hover:text-primary" />
                  </span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="h-px bg-border/60" />

            {/* Logout */}
            <div className="p-1.5">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  void handleLogout();
                }}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-all duration-150 hover:bg-red-500/8 focus:outline-none"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-red-500/10 transition-colors group-hover:bg-red-500/20">
                  <FiLogOut className="size-3.5 text-red-500" />
                </span>
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          Flavora
        </Link>

        {centerLinks}

        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            className="cursor-pointer"
            onPress={() => dispatch(toggleTheme())}
          >
            {mode === "dark" ? (
              <FiSun className="size-4" />
            ) : (
              <FiMoon className="size-4" />
            )}
          </Button>

          {isAuthenticated && (
            <>
              <span className="hidden text-sm font-medium text-foreground/80 sm:inline">
                Hi, {getFirstName(user?.name)}
              </span>
              {profileMenu}
            </>
          )}

          {!isAuthenticated && (
            <HeroLink
              href="/login"
              className="hidden items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-hover md:inline-flex"
            >
              Login
            </HeroLink>
          )}

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-label="Toggle menu"
            onPress={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX className="size-4" /> : <FiMenu className="size-4" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              {navLinks.map((link) => (
                <HeroLink
                  key={link.href}
                  href={link.href}
                  onPress={() => setMenuOpen(false)}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </HeroLink>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
                  <HeroLink
                    href="/login"
                    onPress={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
                  >
                    Login
                  </HeroLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
