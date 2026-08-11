"use client";

import { useAppSelector } from "@/store/hooks";
import {
  FiCalendar,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";

function getInitials(name?: string | null) {
  const parts = (name ?? "U").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
}

function RoleBadge({ role }: { role?: string }) {
  const isAdmin = role === "ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isAdmin
          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          : "bg-primary/10 text-primary"
      }`}
    >
      <FiShield className="size-3" />
      {isAdmin ? "Admin" : "Member"}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface-secondary/50 px-4 py-3.5 transition-colors hover:border-border">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

export function ProfileCard() {
  const { user } = useAppSelector((s) => s.auth);

  const joinedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="w-full max-w-xl">
      {/* Hero banner – no overflow-hidden so avatar is never clipped */}
      <div className="relative rounded-t-2xl">
        {/* Gradient banner */}
        <div className="h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary via-accent to-amber-400">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 left-12 size-24 rounded-full bg-white/10 blur-xl" />
        </div>

        {/* Avatar – sits outside overflow-hidden, overlaps boundary via absolute */}
        <div className="absolute -bottom-10 left-6 z-20">
          <div className="relative">
            <span className="flex size-20 overflow-hidden rounded-2xl border-4 border-surface shadow-xl">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user?.name ?? "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              )}
            </span>
            {/* Online indicator */}
            <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border-2 border-surface bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="rounded-b-2xl border border-t-0 border-border/70 bg-surface pt-14 shadow-sm">
        {/* Name & role header */}
        <div className="flex items-start justify-between px-6 pb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {user?.name ?? "—"}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{user?.email ?? "—"}</p>
          </div>
          <RoleBadge role={user?.role} />
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60" />

        {/* Info rows */}
        <div className="flex flex-col gap-3 p-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted">
            Account Details
          </p>
          <InfoRow icon={FiUser} label="Full Name" value={user?.name} />
          <InfoRow icon={FiMail} label="Email Address" value={user?.email} />
          <InfoRow
            icon={FiShield}
            label="Account Role"
            value={user?.role === "ADMIN" ? "Administrator" : "Member"}
          />
          <InfoRow icon={FiCalendar} label="Member Since" value={joinedDate} />
        </div>

        {/* Footer hint */}
        <div className="rounded-b-2xl border-t border-border/50 bg-surface-secondary/40 px-6 py-3.5">
          <p className="text-xs text-muted">
            Your profile information is synced from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
