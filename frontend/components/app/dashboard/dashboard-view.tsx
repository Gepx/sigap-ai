"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import DashboardMetrics from "@/components/app/dashboard/dashboard-metrics";
import DashboardWarnings from "@/components/app/dashboard/dashboard-warnings";
import DashboardCharts from "@/components/app/dashboard/dashboard-charts";
import RecommendationSection from "@/components/app/recommendations/recommendation-section";
import ChatWidget from "@/components/app/chat-widget";

export default function DashboardView({ fileName, analysis }: { fileName: string, analysis?: any }) {
  const [warnings, setWarnings] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/api/ai/warnings`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setWarnings(res.data.data);
        }
      })
      .catch(err => console.error("Failed to fetch warnings", err));
  }, []);

  return (
    <div className="relative flex min-h-[calc(100svh-2rem)] flex-1 overflow-hidden bg-[#F4F9F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(26,46,38,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-12 size-72 rounded-full bg-[#00B074]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-6rem] size-[30rem] rounded-full bg-[#1A2E26]/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight text-[#1A2E26] sm:text-4xl">
            Sentiment Analysis
          </h1>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="h-11 rounded-full border-[#1A2E26]/10 bg-white text-[#1A2E26] hover:bg-[#E8FFF4] hover:text-[#007A51] print:hidden"
          >
            <Download className="size-4" />
            Export report
          </Button>
        </div>

        <DashboardWarnings warnings={warnings} />
        <DashboardMetrics />
        <DashboardCharts />
        <RecommendationSection warning={warnings.length > 0 ? warnings[0] : null} analysis={analysis} />
      </div>
      <ChatWidget warningContext={warnings.length > 0 ? warnings[0] : null} analysis={analysis} />
    </div>
  );
}
