"use client";

import { ToastContainer } from "react-toastify";
import { useAppSelector } from "@/store/hooks";

export function ToastProvider() {
  const mode = useAppSelector((s) => s.theme.mode);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      theme={mode === "dark" ? "dark" : "light"}
    />
  );
}
