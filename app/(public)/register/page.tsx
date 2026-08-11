"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import { registerUser } from "@/lib/actions/auth.actions";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { UploadButton } from "@/lib/uploadthing";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      const data = await registerUser({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        image,
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Create your account</Card.Title>
          <Card.Description>Join Flavora and start sharing recipes.</Card.Description>
        </Card.Header>
        <Form onSubmit={onSubmit}>
          <Card.Content className="flex flex-col gap-4">
            <TextField isRequired name="name">
              <Label>Name</Label>
              <Input variant="secondary" placeholder="Your name" />
            </TextField>
            <TextField
              isRequired
              name="email"
              type="email"
              validate={(v) => (v.includes("@") ? null : "Enter a valid email")}
            >
              <Label>Email</Label>
              <Input variant="secondary" placeholder="you@example.com" />
            </TextField>
            <TextField isRequired name="password" type="password" minLength={8}>
              <Label>Password</Label>
              <Input variant="secondary" placeholder="Min. 8 characters" />
            </TextField>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted">Avatar (optional)</span>
              <UploadButton
                endpoint="avatarUploader"
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
          <Card.Footer className="flex flex-col gap-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={isSubmitting}
            >
              Create account
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
