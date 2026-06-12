"use client";

import React, { useState } from "react";
import UploadContent from "@/components/upload-content";
import ProcessingView from "@/components/processing-view";
import DashboardView from "@/components/dashboard-view";

type ViewState = "upload" | "processing" | "dashboard";

export default function AppPage() {
  const [view, setView] = useState<ViewState>("upload");
  const [fileName, setFileName] = useState("");
  const [sessionUuid, setSessionUuid] = useState("");

  const handleUpload = (name: string, uuid: string) => {
    setFileName(name);
    setSessionUuid(uuid);
    setView("processing");
  };

  const handleComplete = (uuid: string) => {
    setSessionUuid(uuid);
    setView("dashboard");
  };

  if (view === "processing") {
    return (
      <ProcessingView
        fileName={fileName}
        sessionUuid={sessionUuid}
        onComplete={handleComplete}
      />
    );
  }

  if (view === "dashboard") {
    return <DashboardView sessionUuid={sessionUuid} />;
  }

  return <UploadContent onUpload={handleUpload} />;
}
