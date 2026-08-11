"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input, Label, ListBox, Select, TextField } from "@heroui/react";
import type { CategorySummary } from "@/lib/api/category.api";

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <TextField
        name="search"
        value={search}
        onChange={onSearchChange}
        className="sm:max-w-xs"
      >
        <Label>Search</Label>
        <Input variant="secondary" placeholder="Search recipes..." />
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
        className="sm:w-52"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {categories.map((c) => (
              <ListBox.Item key={c.id} id={c.id}>
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
          updateParams({ sort: key != null ? String(key) : undefined, page: undefined })
        }
        className="sm:w-40"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="newest">Newest</ListBox.Item>
            <ListBox.Item id="oldest">Oldest</ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
