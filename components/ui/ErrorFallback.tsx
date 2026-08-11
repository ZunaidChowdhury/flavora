"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export function ErrorFallback({
  title = "Something went wrong",
  description = "Please try again.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div
        className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-lg text-primary"
        aria-hidden
      >
        !
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted">{description}</p>
      <Button variant="primary" onPress={() => router.refresh()}>
        Try again
      </Button>
    </div>
  );
}
