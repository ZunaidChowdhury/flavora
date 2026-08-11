"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { Input, ListBox, Select, TextField } from "@heroui/react";
import type { CategorySummary } from "@/lib/api/category.api";

const inputClass =
  "w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 shadow-sm outline-none transition-all duration-200 hover:border-primary/40 hover:bg-foreground/5 focus:border-primary focus:ring-1 focus:ring-primary/30";

const triggerClass =
  "inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-primary/40 hover:bg-foreground/5 focus:border-primary focus:ring-1 focus:ring-primary/30";

const itemClass =
  "flex min-h-9 w-full cursor-pointer items-center rounded-lg px-3 py-1.5 text-sm text-foreground outline-none transition-colors hover:bg-primary/10 data-[selected=true]:bg-primary/10 data-[selected=true]:font-medium data-[selected=true]:text-primary";

export function RecipeFilters({ categories }: { categories: CategorySummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  function onSearchChange(value: string) {
    setSearch(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => updateParams({ search: value || undefined, page: undefined }),
      300
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-surface p-4 shadow-sm sm:flex-row sm:items-center">
      <TextField
        name="search"
        value={search}
        onChange={onSearchChange}
        aria-label="Search recipes"
        className="w-full sm:max-w-xs"
      >
        <div className="relative flex items-center">
          <FiSearch
            className="absolute left-3.5 shrink-0 text-muted"
            width={16}
            height={16}
          />
          <Input
            variant="secondary"
            placeholder="Search recipes..."
            className={inputClass}
          />
        </div>
      </TextField>

      <Select
        aria-label="Category"
        placeholder="All categories"
        selectedKey={searchParams.get("categoryId") ?? undefined}
        onSelectionChange={(key) =>
          updateParams({
            categoryId: key != null ? String(key) : undefined,
            page: undefined,
          })
        }
        className="w-full sm:w-52"
      >
        <Select.Trigger className={triggerClass}>
          <Select.Value className="flex-1 truncate text-start text-sm text-foreground data-[placeholder=true]:text-foreground/40" />
          <Select.Indicator className="size-4 shrink-0 text-muted transition-transform duration-200 data-[open=true]:rotate-180" />
        </Select.Trigger>
        <Select.Popover className="min-w-52 rounded-xl border border-border/50 bg-surface p-1.5 shadow-xl">
          <ListBox className="outline-none">
            {categories.map((c) => (
              <ListBox.Item
                key={c.id}
                id={c.id}
                textValue={c.name}
                className={itemClass}
              >
                {c.name}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        aria-label="Sort"
        selectedKey={searchParams.get("sort") ?? "newest"}
        onSelectionChange={(key) =>
          updateParams({
            sort: key != null ? String(key) : undefined,
            page: undefined,
          })
        }
        className="w-full sm:w-40"
      >
        <Select.Trigger className={triggerClass}>
          <Select.Value className="flex-1 truncate text-start text-sm text-foreground data-[placeholder=true]:text-foreground/40" />
          <Select.Indicator className="size-4 shrink-0 text-muted transition-transform duration-200 data-[open=true]:rotate-180" />
        </Select.Trigger>
        <Select.Popover className="min-w-40 rounded-xl border border-border/50 bg-surface p-1.5 shadow-xl">
          <ListBox className="outline-none">
            <ListBox.Item id="newest" textValue="Newest" className={itemClass}>
              Newest
            </ListBox.Item>
            <ListBox.Item id="oldest" textValue="Oldest" className={itemClass}>
              Oldest
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
