// apps/web/src/shared/components/FileUploader.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, File, Image, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface UploadedFile {
  key: string;
  url: string;
  contentType: string;
  name: string;
  size: number;
}

interface FileUploaderProps {
  folder?: "images" | "documents";
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onUpload?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function FileUploader({
  folder = "documents",
  accept,
  maxSizeMB = 25,
  multiple = false,
  onUpload,
  onError,
  className = "",
}: FileUploaderProps) {
  const [files, setFiles] = useState<
    Array<{ file: File; status: "pending" | "uploading" | "done" | "error"; result?: UploadedFile; error?: string }>
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/v1/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Upload failed");
      }

      const json = await res.json();
      return { ...json.data, name: file.name, size: file.size };
    },
    [folder]
  );

  const processFiles = useCallback(
    async (selected: File[]) => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      const newEntries = selected.map((file) => ({
        file,
        status: "pending" as const,
      }));

      setFiles((prev) => (multiple ? [...prev, ...newEntries] : newEntries));

      const results: UploadedFile[] = [];

      for (let i = 0; i < selected.length; i++) {
        const file = selected[i];

        if (file.size > maxBytes) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === file
                ? { ...f, status: "error", error: `File exceeds ${maxSizeMB}MB limit` }
                : f
            )
          );
          onError?.(`${file.name} exceeds ${maxSizeMB}MB`);
          continue;
        }

        setFiles((prev) =>
          prev.map((f) => (f.file === file ? { ...f, status: "uploading" } : f))
        );

        try {
          const result = await uploadFile(file);
          if (result) {
            setFiles((prev) =>
              prev.map((f) => (f.file === file ? { ...f, status: "done", result } : f))
            );
            results.push(result);
          }
        } catch (err: any) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, status: "error", error: err.message } : f
            )
          );
          onError?.(err.message);
        }
      }

      if (results.length > 0) onUpload?.(results);
    },
    [folder, maxSizeMB, multiple, uploadFile, onUpload, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) processFiles(droppedFiles);
    },
    [processFiles]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) processFiles(selected);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isImage = (contentType: string) => contentType.startsWith("image/");

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
        }`}
      >
        <div className={`rounded-full p-3 ${isDragging ? "bg-blue-100 dark:bg-blue-900/40" : "bg-slate-100 dark:bg-slate-800"}`}>
          <Upload className={`h-6 w-6 ${isDragging ? "text-blue-600" : "text-slate-400"}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {accept || "Images, PDFs, documents"} • Max {maxSizeMB}MB{multiple ? "" : " · Single file"}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          aria-label="File upload input"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              {/* Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                {f.result && isImage(f.result.contentType) ? (
                  <Image className="h-4 w-4 text-slate-400" />
                ) : (
                  <File className="h-4 w-4 text-slate-400" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {f.file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(f.file.size / 1024).toFixed(1)} KB
                  {f.error && (
                    <span className="ml-2 text-red-500">{f.error}</span>
                  )}
                </p>
              </div>

              {/* Status */}
              <div className="shrink-0">
                {f.status === "uploading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {f.status === "done" && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {f.status === "error" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                {f.status === "pending" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Remove done/error */}
              {(f.status === "done" || f.status === "error") && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600"
                  aria-label="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
