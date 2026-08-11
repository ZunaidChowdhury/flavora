"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Modal,
  Pagination,
  Switch,
  Table,
} from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  deleteRecipe,
  updateRecipeAdminVisibility,
} from "@/lib/actions/recipe.actions";
import type { AdminRecipe } from "@/lib/api/recipe.api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function AdminRecipePublishToggle({ recipe }: { recipe: AdminRecipe }) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(!recipe.isUnpublishedByAdmin);
  const [pending, setPending] = useState(false);

  async function onToggle() {
    const next = !isPublished;
    setPending(true);
    setIsPublished(next);
    try {
      await updateRecipeAdminVisibility(recipe.id, !next);
      toast.success(
        next ? "Recipe is now published" : "Recipe is now unpublished"
      );
      router.refresh();
    } catch (err) {
      setIsPublished(!next);
      toast.error(
        err instanceof Error ? err.message : "Failed to update publish status"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        isSelected={isPublished}
        isDisabled={pending}
        onChange={onToggle}
        aria-label="Toggle publish status"
      />
      <Chip
        size="sm"
        variant="soft"
        color={isPublished ? "success" : "danger"}
      >
        {isPublished ? "Published" : "Unpublished"}
      </Chip>
    </div>
  );
}

function AdminRecipeDeleteButton({ recipe }: { recipe: AdminRecipe }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirm() {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
      toast.success("Recipe deleted");
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete recipe"
      );
      setIsDeleting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        isIconOnly
        size="sm"
        variant="danger-soft"
        onPress={() => setIsOpen(true)}
        aria-label={`Delete ${recipe.title}`}
      >
        <FiTrash2 className="size-4" />
      </Button>
      <Modal.Backdrop variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Delete this recipe?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">
                  {recipe.title}
                </span>{" "}
                will be soft-deleted and removed from all public listings. This
                action can&apos;t be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="outline">
                Cancel
              </Button>
              <Button
                variant="danger"
                isDisabled={isDeleting}
                onPress={confirm}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export function RecipesTable({
  recipes,
  total,
  page,
  limit,
}: {
  recipes: AdminRecipe[];
  total: number;
  page: number;
  limit: number;
}) {
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);

  function go(target: number) {
    if (target < 1 || target > totalPages || target === currentPage) return;
    const params = new URLSearchParams();
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    router.push(`/admin/recipes${qs ? `?${qs}` : ""}`);
  }

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

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="flex flex-col gap-4">
      <Table className="rounded-2xl border border-border/60 bg-surface">
        <Table.ScrollContainer>
          <Table.Content className="min-w-[760px]">
            <Table.Header>
              <Table.Column isRowHeader>Recipe</Table.Column>
              <Table.Column>Category</Table.Column>
              <Table.Column>Visibility</Table.Column>
              <Table.Column>Admin status</Table.Column>
              <Table.Column>Activity</Table.Column>
              <Table.Column>Created</Table.Column>
              <Table.Column className="text-end">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {recipes.map((recipe) => (
                <Table.Row key={recipe.id}>
                  <Table.Cell>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {recipe.title}
                      </p>
                      <p className="truncate text-sm text-muted">
                        by {recipe.author.name}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft">
                      {recipe.category.name}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={recipe.visibility === "PUBLIC" ? "success" : "default"}
                    >
                      {recipe.visibility}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <AdminRecipePublishToggle recipe={recipe} />
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-muted">
                      {recipe._count.reviews} reviews ·{" "}
                      {recipe._count.favoritedBy} favorites
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-muted">
                      {formatDate(recipe.createdAt)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-end">
                    <AdminRecipeDeleteButton recipe={recipe} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <Pagination className="w-full">
        <Pagination.Summary>
          Showing {startItem}-{endItem} of {total} results
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={currentPage === 1}
              onPress={() => go(currentPage - 1)}
            >
              <Pagination.PreviousIcon />
              <span>Previous</span>
            </Pagination.Previous>
          </Pagination.Item>
          {getPageNumbers().map((p, i) =>
            p === "ellipsis" ? (
              <Pagination.Item key={`ellipsis-${i}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === currentPage}
                  onPress={() => go(p)}
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
            >
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}
