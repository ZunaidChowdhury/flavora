"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Link as HeroLink } from "@heroui/react";
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { logoutUser } from "@/lib/actions/auth.actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/authSlice";
import { toggleTheme } from "@/store/slices/themeSlice";

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const mode = useAppSelector((s) => s.theme.mode);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutUser();
    dispatch(clearCredentials());
    router.push("/");
  }

  const links = (
    <>
      <HeroLink href="/recipes">All Recipes</HeroLink>
      {isAuthenticated ? (
        <>
          <HeroLink href="/dashboard">Dashboard</HeroLink>
          {user?.role === "ADMIN" && <HeroLink href="/admin">Admin</HeroLink>}
          <Button variant="ghost" size="sm" onPress={handleLogout}>
            <FiLogOut className="size-4" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <HeroLink href="/login">Login</HeroLink>
          <HeroLink href="/register">Register</HeroLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          Flavora
        </Link>

        <div className="hidden items-center gap-6 md:flex">{links}</div>

        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onPress={() => dispatch(toggleTheme())}
          >
            {mode === "dark" ? (
              <FiSun className="size-4" />
            ) : (
              <FiMoon className="size-4" />
            )}
          </Button>
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
            <div className="flex flex-col gap-4 px-4 py-4">{links}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
