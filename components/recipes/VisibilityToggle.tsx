"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chip, Switch, Tooltip } from "@heroui/react";
import { toast } from "react-toastify";
import { updateRecipeVisibility } from "@/lib/actions/recipe.actions";

export function VisibilityToggle({
  recipeId,
  visibility,
  isUnpublishedByAdmin,
}: {
  recipeId: string;
  visibility: "PUBLIC" | "PRIVATE";
  isUnpublishedByAdmin: boolean;
}) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(visibility === "PUBLIC");
  const [pending, setPending] = useState(false);

  if (isUnpublishedByAdmin) {
    return (
      <div className="flex items-center gap-2">
        <Switch
          isDisabled
          isSelected={false}
          aria-label="Visibility disabled"
        />
        <Tooltip>
          <Tooltip.Trigger>
            <Chip color="danger" size="sm">
              Unpublished by admin
            </Chip>
          </Tooltip.Trigger>
          <Tooltip.Content showArrow>
            You can&apos;t change visibility until an admin re-publishes it.
          </Tooltip.Content>
        </Tooltip>
      </div>
    );
  }

  async function onToggle() {
    const next = !isPublic;
    setPending(true);
    setIsPublic(next);
    try {
      const nextVisibility = next ? "PUBLIC" : "PRIVATE";
      await updateRecipeVisibility(recipeId, nextVisibility);
      toast.success(
        next ? "Recipe is now public" : "Recipe is now private"
      );
      router.refresh();
    } catch (err) {
      setIsPublic(!next);
      toast.error(
        err instanceof Error ? err.message : "Failed to update visibility"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        isSelected={isPublic}
        isDisabled={pending}
        onChange={onToggle}
        aria-label="Toggle recipe visibility"
      />
      <span
        className={`text-sm ${isPublic ? "text-primary" : "text-muted"}`}
      >
        {isPublic ? "Public" : "Private"}
      </span>
    </div>
  );
}
