"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@heroui/react";

const navButtonClass =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40";

const pageLinkClass =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary data-[active=true]:font-semibold data-[active=true]:text-background focus-visible:outline-2 focus-visible:outline-primary";

export function RecipePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  search,
  categoryId,
  sort,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  search?: string;
  categoryId?: string;
  sort?: string;
}) {
  const router = useRouter();

  function getPageNumbers(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  }

  function go(target: number) {
    if (target < 1 || target > totalPages || target === currentPage) return;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (sort) params.set("sort", sort);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    router.push(`/recipes${qs ? `?${qs}` : ""}`);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Pagination className="mt-10 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <Pagination.Summary className="text-sm text-muted">
        Showing {startItem}-{endItem} of {totalItems} results
      </Pagination.Summary>
      <Pagination.Content className="flex flex-wrap items-center justify-center gap-1.5">
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={currentPage === 1}
            onPress={() => go(currentPage - 1)}
            className={navButtonClass}
          >
            <Pagination.PreviousIcon className="size-4" />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${i}`}>
              <Pagination.Ellipsis className="flex size-9 items-center justify-center text-sm text-muted" />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link
                isActive={p === currentPage}
                onPress={() => go(p)}
                className={pageLinkClass}
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={currentPage === totalPages}
            onPress={() => go(currentPage + 1)}
            className={navButtonClass}
          >
            <span>Next</span>
            <Pagination.NextIcon className="size-4" />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
