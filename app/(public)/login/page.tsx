"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import { loginUser } from "@/lib/actions/auth.actions";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      const data = await loginUser({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Welcome back");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Welcome back</Card.Title>
          <Card.Description>Log in to your Flavora account.</Card.Description>
        </Card.Header>
        <Form onSubmit={onSubmit}>
          <Card.Content className="flex flex-col gap-4">
            <TextField
              isRequired
              name="email"
              type="email"
              validate={(v) => (v.includes("@") ? null : "Enter a valid email")}
            >
              <Label>Email</Label>
              <Input variant="secondary" placeholder="you@example.com" />
            </TextField>
            <TextField isRequired name="password" type="password">
              <Label>Password</Label>
              <Input variant="secondary" placeholder="Your password" />
            </TextField>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={isSubmitting}
            >
              Log in
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
