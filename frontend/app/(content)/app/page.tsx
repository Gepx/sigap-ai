"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UploadContent from "@/components/app/upload-content";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export default function AppPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/ai/analyze-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.status === "success") {
        const session_id = response.data.session_id;
        router.push(`/app/${session_id}?new=true`);
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

  return <UploadContent onUpload={handleUpload} isProcessing={isProcessing} />;
}
