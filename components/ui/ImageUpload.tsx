"use client";

import { useEffect, useRef, useState } from "react";
import { FiImage, FiUpload, FiX } from "react-icons/fi";
import { useUploadThing } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type ImageUploadProps<TEndpoint extends keyof OurFileRouter> = {
  endpoint: TEndpoint;
  initialUrl?: string;
  onUploadComplete: (url: string) => void;
  onError?: (message: string) => void;
};

export function ImageUpload<TEndpoint extends keyof OurFileRouter>({
  endpoint,
  initialUrl,
  onUploadComplete,
  onError,
}: ImageUploadProps<TEndpoint>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url;
      if (url) {
        setPreview(url);
        onUploadComplete(url);
      }
    },
    onUploadError: (e) => onError?.(e.message),
    onUploadProgress: (p) => setProgress(p),
  });

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(file);
    setPreview(objectUrlRef.current);
    setFileName(file.name);
    setProgress(0);
    await (startUpload as unknown as (files: File[]) => Promise<unknown>)([file]);
    e.target.value = "";
  }

  function clear() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = undefined;
    }
    if (inputRef.current) inputRef.current.value = "";
    setPreview(undefined);
    setFileName(undefined);
    setProgress(0);
    onUploadComplete("");
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <div className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected image"
            className="h-16 w-16 shrink-0 rounded-md border border-border/50 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {fileName ?? "Image ready"}
            </p>
            <p className="text-xs text-muted">Click Replace to pick a new image</p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <FiUpload className="size-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={clear}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-rose-500/40 hover:text-rose-500"
            >
              <FiX className="size-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-foreground/15 bg-foreground/[0.03] px-4 text-sm font-medium text-foreground/70 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          <FiImage className="size-4" />
          Choose an image
        </button>
      )}

      {isUploading && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted">{progress}%</span>
        </div>
      )}
    </div>
  );
}
