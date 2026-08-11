"use client";

import { Card } from "@heroui/react";
import { useAppSelector } from "@/store/hooks";

export function ProfileCard() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <Card className="max-w-md">
      <Card.Header>
        <Card.Title>{user?.name}</Card.Title>
        <Card.Description>{user?.email}</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm text-muted">Role: {user?.role}</p>
      </Card.Content>
    </Card>
  );
}
