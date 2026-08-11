"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Label, TextField } from "@heroui/react";
import {
  FiCheck,
  FiCheckCircle,
  FiCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { registerUser } from "@/lib/actions/auth.actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { ImageUpload } from "@/components/ui/ImageUpload";

const inputClass =
  "w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] py-2.5 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200";
const passwordInputClass =
  "w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] py-2.5 pl-11 pr-12 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200";

function RuleRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {passed ? (
        <FiCheckCircle className="shrink-0 text-emerald-500" width={14} height={14} />
      ) : (
        <FiCircle className="shrink-0 text-foreground/40" width={14} height={14} />
      )}
      <span
        className={`text-xs font-medium ${
          passed ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/60"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((s) => s.theme.mode) === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    profileImage?: string;
    form?: string;
  }>({});

  const rules = {
    minLength: form.password.length >= 8,
    hasUppercase: /[A-Z]/.test(form.password),
    hasLowercase: /[a-z]/.test(form.password),
  };
  const allRulesPassed = Object.values(rules).every(Boolean);

  function handleChange(field: keyof RegisterForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name) next.name = "Full name is required";
    if (!form.email) next.email = "Email is required";
    else if (!form.email.includes("@")) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    else if (!allRulesPassed)
      next.password = "Password must meet all requirements";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        image: avatarUrl ?? undefined,
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Registration failed",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[380px] w-[380px] rounded-full bg-primary/10 blur-[90px]"
      />
      <div
        className={`w-full max-w-[780px] rounded-2xl border px-6 py-8 shadow-xl transition-all duration-300 tablet:px-8 ${
          isDark
            ? "border-white/5 bg-linear-to-b from-surface to-surface-secondary"
            : "border-border/60 bg-surface"
        }`}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-foreground/70">
            Join{" "}
            <span className="font-semibold text-primary">Flavora</span>
            {" "}— your cooking community
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {errors.form && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5">
              <span className="text-sm font-medium text-rose-400">
                {errors.form}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField isInvalid={!!errors.name} className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/90">
                Full Name
              </Label>
              <div className="relative flex items-center">
                <FiUser
                  className="absolute left-3.5 shrink-0 text-foreground/40"
                  width={16}
                  height={16}
                />
                <Input
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              {errors.name && (
                <span className="mt-0.5 text-xs font-medium text-rose-400">
                  {errors.name}
                </span>
              )}
            </TextField>

            <TextField isInvalid={!!errors.email} className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/90">
                Email Address
              </Label>
              <div className="relative flex items-center">
                <FiMail
                  className="absolute left-3.5 shrink-0 text-foreground/40"
                  width={16}
                  height={16}
                />
                <Input
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass}
                />
              </div>
              {errors.email && (
                <span className="mt-0.5 text-xs font-medium text-rose-400">
                  {errors.email}
                </span>
              )}
            </TextField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              isInvalid={!!errors.password}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium text-foreground/90">
                Password
              </Label>
              <div className="relative flex items-center">
                <FiLock
                  className="absolute left-3.5 shrink-0 text-foreground/40"
                  width={16}
                  height={16}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={passwordInputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 cursor-pointer text-foreground/40 transition-colors hover:text-foreground focus:outline-none focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {showPassword ? (
                    <FiEyeOff width={18} height={18} />
                  ) : (
                    <FiEye width={18} height={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="mt-0.5 text-xs font-medium text-rose-400">
                  {errors.password}
                </span>
              )}
            </TextField>

            <TextField
              isInvalid={!!errors.confirmPassword}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium text-foreground/90">
                Confirm Password
              </Label>
              <div className="relative flex items-center">
                <FiLock
                  className="absolute left-3.5 shrink-0 text-foreground/40"
                  width={16}
                  height={16}
                />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={passwordInputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                  }
                  className="absolute right-3 cursor-pointer text-foreground/40 transition-colors hover:text-foreground focus:outline-none focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff width={18} height={18} />
                  ) : (
                    <FiEye width={18} height={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="mt-0.5 text-xs font-medium text-rose-400">
                  {errors.confirmPassword}
                </span>
              )}
            </TextField>
          </div>

          {form.password.length > 0 && (
            <div
              className={`flex flex-col gap-1.5 rounded-md border px-4 py-3 transition-all duration-300 sm:flex-row sm:items-center sm:gap-6 ${
                allRulesPassed
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-foreground/10 bg-foreground/[0.03]"
              }`}
            >
              {allRulesPassed ? (
                <div className="flex items-center gap-2">
                  <FiCheckCircle
                    className="shrink-0 text-emerald-500"
                    width={16}
                    height={16}
                  />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Password looks great!
                  </span>
                </div>
              ) : (
                <>
                  <RuleRow label="At least 8 characters" passed={rules.minLength} />
                  <RuleRow label="One uppercase (A–Z)" passed={rules.hasUppercase} />
                  <RuleRow label="One lowercase (a–z)" passed={rules.hasLowercase} />
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/90">
              Avatar (optional)
            </span>
            <ImageUpload
              endpoint="avatarUploader"
              onUploadComplete={(url) => {
                setAvatarUrl(url || null);
                setErrors((prev) => ({ ...prev, profileImage: undefined }));
              }}
              onError={(message) =>
                setErrors((prev) => ({
                  ...prev,
                  profileImage: `Upload failed: ${message}`,
                }))
              }
            />
            {errors.profileImage && (
              <span className="mt-0.5 text-xs font-medium text-rose-400">
                {errors.profileImage}
              </span>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            isDisabled={isSubmitting}
            className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary-hover to-primary text-sm font-bold text-background shadow-lg shadow-primary/20 transition-all duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary"
          >
            {isSubmitting ? (
              "Creating account…"
            ) : (
              <>
                <FiCheck width={16} height={16} />
                Create Account
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/70">
          Have an account?{" "}
          <Link
            href="/login"
            className="ml-1 font-semibold text-primary transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
