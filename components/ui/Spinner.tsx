import { Spinner as HeroSpinner } from "@heroui/react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      role="status"
    >
      <HeroSpinner
        color="current"
        size="lg"
        aria-label={label}
        className="text-primary"
      />
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
