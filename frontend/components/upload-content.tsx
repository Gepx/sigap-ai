"use client";

import React, { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadContent() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    },
    [],
  );

  const removeFile = () => setFile(null);

  return (
    <div className="relative flex flex-1 flex-col min-h-svh bg-white overflow-hidden">
      {/* Green ambient glow / sparkle effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-green-300/8 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-300/8 blur-[100px]" />
        {/* Small sparkle dots */}
        <div className="absolute top-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-emerald-400/40 animate-pulse" />
        <div className="absolute top-[35%] right-[30%] w-1 h-1 rounded-full bg-green-400/50 animate-pulse [animation-delay:0.5s]" />
        <div className="absolute bottom-[40%] left-[40%] w-2 h-2 rounded-full bg-teal-400/30 animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[50%] right-[20%] w-1 h-1 rounded-full bg-emerald-500/40 animate-pulse [animation-delay:1.5s]" />
        <div className="absolute bottom-[25%] left-[60%] w-1.5 h-1.5 rounded-full bg-green-500/35 animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[15%] right-[45%] w-1 h-1 rounded-full bg-emerald-300/50 animate-pulse [animation-delay:0.8s]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24">
        {/* Greeting */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="size-6 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent pb-2 leading-tight">
            Hello, {userName}!
          </h1>
          <p className="mt-3 text-base text-emerald-700/60 max-w-md mx-auto">
            Upload your CSV document to get started with analysis
          </p>
        </div>

        {/* Upload area */}
        <div className="w-full max-w-xl">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative group cursor-pointer rounded-2xl border-2 border-dashed 
                transition-all duration-300 ease-out
                ${
                  isDragOver
                    ? "border-emerald-500 bg-emerald-50/80 scale-[1.02] shadow-lg shadow-emerald-100"
                    : "border-emerald-200 bg-white/60 backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-md hover:shadow-emerald-50"
                }
              `}
            >
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center px-8 py-14 cursor-pointer"
              >
                <div
                  className={`
                    flex items-center justify-center size-14 rounded-xl mb-5 transition-all duration-300
                    ${
                      isDragOver
                        ? "bg-emerald-500 text-white scale-110"
                        : "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-105"
                    }
                  `}
                >
                  <Upload className="size-6" />
                </div>
                <p className="text-base font-medium text-gray-700 mb-1">
                  {isDragOver
                    ? "Drop your file here"
                    : "Drag & drop your CSV file here"}
                </p>
                <p className="text-sm text-gray-400 mb-1">or</p>
                <span className="inline-flex h-9 items-center justify-center rounded-md border border-emerald-300 bg-transparent px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition-colors group-hover:bg-emerald-50 group-hover:border-emerald-400 group-hover:text-emerald-800 pointer-events-none">
                  Browse files
                </span>
                <p className="mt-4 text-xs text-gray-400">
                  Supports: .csv files
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
            <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm shadow-emerald-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-emerald-100 text-emerald-600">
                  <FileText className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Upload className="size-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
