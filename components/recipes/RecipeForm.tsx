"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { createRecipe, updateRecipe } from "@/lib/actions/recipe.actions";
import type { CategorySummary } from "@/lib/api/category.api";
import type { RecipeSummary } from "@/lib/api/recipe.api";
import { UploadButton } from "@/lib/uploadthing";

export function RecipeForm({
  categories,
  initial,
}: {
  categories: CategorySummary[];
  initial?: RecipeSummary;
}) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients ?? [""]
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    initial?.category.id
  );
  const [image, setImage] = useState<string | undefined>(
    initial?.image ?? undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setIngredient(i: number, value: string) {
    setIngredients((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }
  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    const body = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      ingredients: ingredients.filter(Boolean),
      instructions: String(form.get("instructions") ?? ""),
      categoryId,
      image: image ?? null,
    };
    if (body.ingredients.length === 0) {
      toast.error("Add at least one ingredient");
      return;
    }
    setIsSubmitting(true);
    try {
      if (initial) {
        await updateRecipe(initial.id, body);
        toast.success("Recipe updated");
        router.push("/dashboard/my-recipes");
      } else {
        await createRecipe(body);
        toast.success("Recipe created");
        router.push("/dashboard/my-recipes");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save recipe");
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <Card.Header>
        <Card.Title>{initial ? "Edit recipe" : "New recipe"}</Card.Title>
      </Card.Header>
      <Form onSubmit={onSubmit}>
        <Card.Content className="flex flex-col gap-4">
          <TextField isRequired name="title" defaultValue={initial?.title}>
            <Label>Title</Label>
            <Input variant="secondary" placeholder="e.g. Spicy Chicken Curry" />
          </TextField>

          <TextField
            isRequired
            name="description"
            defaultValue={initial?.description}
          >
            <Label>Description</Label>
            <Input variant="secondary" placeholder="Short summary" />
          </TextField>

          <Select
            aria-label="Category"
            placeholder="Select a category"
            selectedKey={categoryId}
            onSelectionChange={(key) =>
              setCategoryId(key != null ? String(key) : undefined)
            }
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

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">Ingredients</span>
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  variant="secondary"
                  value={ing}
                  onChange={(e) => setIngredient(i, e.target.value)}
                  placeholder="e.g. 2 cups of flour"
                />
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  onPress={() => removeIngredient(i)}
                  aria-label={`Remove ingredient ${i + 1}`}
                >
                  <FiTrash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onPress={() => setIngredients((p) => [...p, ""])}
            >
              <FiPlus className="size-4" />
              Add ingredient
            </Button>
          </div>

          <TextField
            isRequired
            name="instructions"
            defaultValue={initial?.instructions}
          >
            <Label>Instructions</Label>
            <Input variant="secondary" placeholder="Step-by-step instructions" />
          </TextField>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">Image (optional)</span>
            <UploadButton
              endpoint="recipeImageUploader"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                if (url) setImage(url);
              }}
              onUploadError={(e) => {
                toast.error(e.message);
              }}
            />
          </div>
        </Card.Content>
        <Card.Footer className="flex gap-2">
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            {initial ? "Save changes" : "Create recipe"}
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  );
}
