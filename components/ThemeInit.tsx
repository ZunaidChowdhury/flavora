"use client";

import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

export function ThemeInit() {
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return null;
}
