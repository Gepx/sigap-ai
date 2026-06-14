"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UploadContent from "@/components/app/upload-content";
import ProcessingView from "@/components/app/processing-view";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export default function AppPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setUploadComplete(false);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/ai/analyze-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.status === "success") {
        setSessionId(response.data.session_id);
        setUploadComplete(true);
      } else {
        toast.error("Failed to initialize analysis.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Upload error:", error);

      let errorDescription = "Terjadi kesalahan yang tidak diketahui.";
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorDescription = error.response.data.message;
        } else if (error.message) {
          errorDescription = error.message;
        }
      } else if (error instanceof Error) {
        errorDescription = error.message;
      }

      toast.error("Gagal Mengupload Dokumen", {
        description: errorDescription,
      });
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <ProcessingView
        fileName={selectedFile?.name || "document"}
        isUploadComplete={uploadComplete}
        onComplete={() => {
          if (sessionId) {
            router.push(`/app/${sessionId}`);
          }
        }}
      />
    );
  }

  return <UploadContent onUpload={handleUpload} isProcessing={isProcessing} />;
}
