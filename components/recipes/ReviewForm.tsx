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
import { toast } from "react-toastify";
import { createReview } from "@/lib/actions/review.actions";
import { useAppSelector } from "@/store/hooks";

export function ReviewForm({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      await createReview({
        recipeId,
        rating,
        comment: String(form.get("comment") ?? ""),
      });
      toast.success("Review submitted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mt-6">
      <Card.Header>
        <Card.Title>Leave a review</Card.Title>
      </Card.Header>
      <Form onSubmit={onSubmit}>
        <Card.Content className="flex flex-col gap-4">
          <Select
            aria-label="Rating"
            placeholder="Rating"
            selectedKey={String(rating)}
            onSelectionChange={(key) => setRating(Number(key))}
            className="w-32"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {[1, 2, 3, 4, 5].map((r) => (
                  <ListBox.Item key={r} id={String(r)}>
                    {r} star{r > 1 ? "s" : ""}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <TextField isRequired name="comment">
            <Label>Comment</Label>
            <Input variant="secondary" placeholder="Share your thoughts..." />
          </TextField>
        </Card.Content>
        <Card.Footer>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            Submit review
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  );
}
