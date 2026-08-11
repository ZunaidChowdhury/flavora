"use client";

import { ErrorFallback } from "../../../components/ui/ErrorFallback";

export default function Error(_props: { error: Error; reset: () => void }) {
  return <ErrorFallback />;
}