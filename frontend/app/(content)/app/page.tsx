"use client";

import React, { useState } from "react";
import UploadContent from "@/components/upload-content";
import ProcessingView from "@/components/processing-view";
import DashboardView from "@/components/dashboard-view";

type ViewState = "upload" | "processing" | "dashboard";

export default function AppPage() {
  const [view, setView] = useState<ViewState>("upload");
  const [fileName, setFileName] = useState("");

  const handleUpload = (name: string) => {
    setFileName(name);
    setView("processing");
  };

  const handleComplete = () => {
    setView("dashboard");
  };

  if (view === "processing") {
    return <ProcessingView fileName={fileName} onComplete={handleComplete} />;
  }

  if (view === "dashboard") {
    return <DashboardView fileName={fileName} />;
  }

  return <UploadContent onUpload={handleUpload} />;
}
