"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UploadContent from "@/components/app/upload-content";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AppPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (name: string) => {
    setIsProcessing(true);
    try {
      const response = await api.post("/api/ai/history", { fileName: name });
      if (response.data && response.data.success) {
        const newAnalysis = response.data.data;
        // Redirect to the new dynamic route, passing ?new=true to trigger processing view
        router.push(`/app/${newAnalysis.uuid}?new=true`);
      } else {
        toast.error("Failed to initialize analysis.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error connecting to server.");
      setIsProcessing(false);
    }
  };

  return <UploadContent onUpload={handleUpload} isProcessing={isProcessing} />;
}
