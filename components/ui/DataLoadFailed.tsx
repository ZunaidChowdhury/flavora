import { EmptyState } from "@heroui/react";

export function DataLoadFailed({
  title = "No data found",
  description = "There's nothing here yet.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-surface py-16 text-center">
      <EmptyState className="flex flex-col items-center gap-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
      </EmptyState>
    </div>
  );
}
