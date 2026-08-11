import { Link } from "@heroui/react";

export function NotFound({
  title = "Not found",
  description = "The page or resource you're looking for doesn't exist.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted">{description}</p>
      <Link href="/">Back to home</Link>
    </div>
  );
}
