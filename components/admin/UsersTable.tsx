"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
  FiShield,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { deleteUser, updateUserRole } from "@/lib/actions/user.actions";
import { useAppSelector } from "@/store/hooks";
import type { UserSummary } from "@/lib/api/user.api";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: UserSummary["status"] }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    INACTIVE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    ARCHIVED: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? map.ARCHIVED}`}>
      {status}
    </span>
  );
}

function RoleSelect({ user, isSelf }: { user: UserSummary; isSelf: boolean }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as "USER" | "ADMIN";
    if (next === user.role) return;
    setIsUpdating(true);
    try {
      await updateUserRole(user.id, next);
      toast.success(`${user.name}'s role updated to ${next}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
      setIsUpdating(false);
    }
  }

  return (
    <div className="relative inline-block">
      <select
        value={user.role}
        disabled={isSelf || isUpdating}
        onChange={onChange}
        className="cursor-pointer appearance-none rounded-lg border border-border/60 bg-field py-1.5 pl-3 pr-7 text-xs font-medium text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <FiShield className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted" />
    </div>
  );
}

function DeleteUserButton({ user, isSelf }: { user: UserSummary; isSelf: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirm() {
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success("User deleted");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isSelf}
        onClick={() => setOpen(true)}
        aria-label={`Delete ${user.name}`}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/8 text-red-500 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiTrash2 className="size-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => !isDeleting && setOpen(false)}
          />
          {/* Dialog */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/50 bg-surface-secondary/60 px-5 py-4">
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-500/10">
                <FiTrash2 className="size-4 text-red-500" />
              </span>
              <h3 className="text-base font-semibold text-foreground">Delete User</h3>
            </div>
            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">{user.name}</span> will
                be soft-deleted and can no longer log in. This action can&apos;t be undone.
              </p>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-border/50 bg-surface-secondary/40 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer rounded-xl border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={isDeleting}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting && (
                  <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Pagination({
  currentPage,
  totalPages,
  total,
  startItem,
  endItem,
  go,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  startItem: number;
  endItem: number;
  go: (p: number) => void;
}) {
  function pages(): (number | "…")[] {
    const out: (number | "…")[] = [1];
    if (currentPage > 3) out.push("…");
    const s = Math.max(2, currentPage - 1);
    const e = Math.min(totalPages - 1, currentPage + 1);
    for (let i = s; i <= e; i++) out.push(i);
    if (currentPage < totalPages - 2) out.push("…");
    if (totalPages > 1) out.push(totalPages);
    return out;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface px-5 py-3">
      <span className="text-sm text-muted">
        Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft className="size-4" />
        </button>
        {pages().map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="flex size-8 items-center justify-center text-muted">
              <FiMoreHorizontal className="size-4" />
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(Number(p))}
              className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "border border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function UsersTable({
  users,
  total,
  page,
  limit,
}: {
  users: UserSummary[];
  total: number;
  page: number;
  limit: number;
}) {
  const router = useRouter();
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  function go(target: number) {
    if (target < 1 || target > totalPages || target === currentPage) return;
    const params = new URLSearchParams();
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    router.push(`/admin/users${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        {/* Table header */}
        <div className="grid min-w-[640px] grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-border/50 bg-surface-secondary/60 px-5 py-3">
          {["User", "Status", "Role", "Joined", "Actions"].map((h, i) => (
            <span
              key={h}
              className={`text-xs font-semibold uppercase tracking-wider text-muted ${i === 4 ? "text-right" : ""}`}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="min-w-[640px] divide-y divide-border/40">
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-secondary/30"
              >
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-9 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary to-accent">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                        {initials(user.name)}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                      {isSelf && (
                        <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          you
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                </div>

                {/* Status */}
                <div><StatusBadge status={user.status} /></div>

                {/* Role */}
                <div><RoleSelect user={user} isSelf={isSelf} /></div>

                {/* Joined */}
                <span className="text-sm text-muted">{formatDate(user.createdAt)}</span>

                {/* Actions */}
                <div className="flex justify-end">
                  <DeleteUserButton user={user} isSelf={isSelf} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        startItem={startItem}
        endItem={endItem}
        go={go}
      />
    </div>
  );
}
