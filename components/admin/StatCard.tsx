import type { IconType } from "react-icons";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: IconType;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface p-5">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      </div>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="size-5" />
      </span>
    </div>
  );
}