"use client";

import React, { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Upload,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

interface UploadContentProps {
  onUpload: (fileName: string, sessionUuid: string) => void;
}

export default function UploadContent({ onUpload }: UploadContentProps) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading" | "analyzing">("idle");

  const userName = session?.user?.name ?? "User";

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      toast.error("Only CSV files are supported.");
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) setFile(selectedFile);
    },
    [],
  );

  const removeFile = () => setFile(null);

  const confirmUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setUploadStep("uploading");
    try {
      // Step 1: Upload CSV
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/sessions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend returns { data: { uuid, title, file_name } }
      const historyUuid: string = res.data.data.uuid;
      if (!historyUuid) {
        throw new Error("Server did not return a valid session ID.");
      }

      toast.success("File uploaded! Starting AI analysis...");
      setUploadStep("analyzing");

      // Step 2: Trigger analysis
      await api.post(`/api/sessions/${historyUuid}/analyze`, {});

      toast.success("Analysis complete! Loading dashboard...");
      onUpload(file.name, historyUuid);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Upload or analysis failed. Please check your file and try again.");
      setIsUploading(false);
      setUploadStep("idle");
    }
  };

  const fileLabel = file ? `${(file.size / 1024).toFixed(1)} KB` : "CSV only";

  return (
    <div className="relative flex min-h-[calc(100svh-2rem)] flex-1 items-center justify-center overflow-hidden bg-[#F4F9F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,176,116,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(26,46,38,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-10 size-72 rounded-full bg-[#00B074]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-6rem] size-[30rem] rounded-full bg-[#1A2E26]/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B074]/20 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#007A51] shadow-sm backdrop-blur">
            <Sparkles className="size-3.5" />
            Review intelligence upload
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-[#1A2E26] sm:text-5xl">
            Hello, {userName}.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#1A2E26]/62">
            Upload your CSV document, confirm it when you are sure, then let
            Sigap.ai process the sentiment and recommendation flow.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#1A2E26]/10 bg-white/90 p-4 shadow-2xl shadow-[#00B074]/10 backdrop-blur sm:p-6 lg:p-8">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group rounded-[1.75rem] border-2 border-dashed p-4 transition-all duration-300 sm:p-6 ${
                isDragOver
                  ? "border-[#00B074] bg-[#E8FFF4] shadow-lg shadow-[#00B074]/10"
                  : "border-[#1A2E26]/12 bg-[#F4F9F6] hover:border-[#00B074]/40 hover:bg-white"
              }`}
            >
              <label
                htmlFor="csv-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] px-5 py-10 text-center sm:px-8 sm:py-14"
              >
                <div
                  className={`mb-5 flex size-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                    isDragOver
                      ? "bg-[#00B074] text-white scale-105"
                      : "bg-[#00B074]/10 text-[#00B074] group-hover:bg-[#00B074] group-hover:text-white"
                  }`}
                >
                  <Upload className="size-6" />
                </div>
                <p className="text-lg font-bold text-[#1A2E26]">
                  {isDragOver ? "Drop your CSV here" : "Drag and drop your CSV"}
                </p>
                <p className="mt-2 text-sm font-medium text-[#1A2E26]/55">
                  or click to browse your files
                </p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1A2E26]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1A2E26]/55 shadow-sm">
                  <ShieldCheck className="size-3.5 text-[#00B074]" />
                  Supports CSV review exports
                </p>
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.75rem] border border-[#00B074]/15 bg-[#FBFFFC] shadow-sm">
              <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8FFF4] text-[#00B074] shadow-sm">
                    <FileText className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                      Selected file
                    </p>
                    <h2 className="mt-2 truncate text-2xl font-black tracking-tight text-[#1A2E26]">
                      {file.name}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-[#1A2E26]/55">
                      {fileLabel} • Ready to be confirmed for analysis
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={removeFile}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#1A2E26]/10 bg-white px-4 text-sm font-bold text-[#1A2E26] shadow-sm transition hover:border-[#B43331]/20 hover:bg-[#FFF4F4] hover:text-[#B43331]"
                  >
                    <X className="size-4" />
                    Remove file
                  </button>
                  <Button
                    type="button"
                    onClick={confirmUpload}
                    disabled={isUploading}
                    className="h-11 rounded-full bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 transition hover:-translate-y-0.5 hover:bg-[#079968] disabled:opacity-70"
                  >
                    {uploadStep === "uploading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Uploading...
                      </>
                    ) : uploadStep === "analyzing" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Analyzing reviews...
                      </>
                    ) : (
                      <>
                        <Upload className="size-4" />
                        Confirm upload
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
