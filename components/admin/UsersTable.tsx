"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Chip,
  ListBox,
  Modal,
  Pagination,
  Select,
  Table,
} from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { deleteUser, updateUserRole } from "@/lib/actions/user.actions";
import { useAppSelector } from "@/store/hooks";
import type { UserSummary } from "@/lib/api/user.api";

const ROLE_OPTIONS: { id: "USER" | "ADMIN"; label: string }[] = [
  { id: "USER", label: "USER" },
  { id: "ADMIN", label: "ADMIN" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function statusColor(status: UserSummary["status"]) {
  if (status === "ACTIVE") return "success";
  if (status === "INACTIVE") return "warning";
  return "danger";
}

function UserRoleEditor({
  user,
  isSelf,
}: {
  user: UserSummary;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSelectionChange(key: React.Key | null) {
    if (key == null) return;
    const next = String(key) as "USER" | "ADMIN";
    if (next === user.role) return;

    setIsUpdating(true);
    try {
      await updateUserRole(user.id, next);
      toast.success(`${user.name}'s role updated to ${next}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
      setIsUpdating(false);
    }
  }

  return (
    <Select
      aria-label="Role"
      selectedKey={user.role}
      isDisabled={isSelf || isUpdating}
      onSelectionChange={onSelectionChange}
      className="w-28"
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {ROLE_OPTIONS.map((option) => (
            <ListBox.Item key={option.id} id={option.id}>
              {option.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

function UserDeleteButton({
  user,
  isSelf,
}: {
  user: UserSummary;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirm() {
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success("User deleted");
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
      setIsDeleting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        isIconOnly
        size="sm"
        variant="danger-soft"
        isDisabled={isSelf}
        onPress={() => setIsOpen(true)}
        aria-label={`Delete ${user.name}`}
      >
        <FiTrash2 className="size-4" />
      </Button>
      <Modal.Backdrop variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Delete this user?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">{user.name}</span>{" "}
                will be soft-deleted and can no longer log in. This action
                can&apos;t be undone.
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

export function UsersTable({
  users,
  total,
  page,
  limit,
}: {
  users: UserSummary[];
  total: number;
  page: number;
  limit: number;
}) {
  const router = useRouter();
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);

  function go(target: number) {
    if (target < 1 || target > totalPages || target === currentPage) return;
    const params = new URLSearchParams();
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    router.push(`/admin/users${qs ? `?${qs}` : ""}`);
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
          <Table.Content className="min-w-[640px]">
            <Table.Header>
              <Table.Column isRowHeader>User</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Joined</Table.Column>
              <Table.Column className="text-end">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" className="size-9 rounded-xl">
                          {user.image ? (
                            <Avatar.Image src={user.image} alt={user.name} />
                          ) : null}
                          <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {user.name}
                            {isSelf && (
                              <span className="ml-1 text-sm font-normal text-muted">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="truncate text-sm text-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={statusColor(user.status)}>
                        {user.status}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <UserRoleEditor user={user} isSelf={isSelf} />
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-muted">
                        {formatDate(user.createdAt)}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <UserDeleteButton user={user} isSelf={isSelf} />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <Pagination className="w-full">
        <Pagination.Summary>
          Showing {startItem}-{endItem} of {total} results
        </Pagination.Summary>
        <Pagination.Content className="flex flex-wrap">
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
