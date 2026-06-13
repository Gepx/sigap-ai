"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DashboardView from "@/components/app/dashboard/dashboard-view";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [uuid, setUuid] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setUuid(p.id);
      api
        .get(`/api/ai/history/${p.id}`)
        .then((res) => {
          if (res.data && res.data.success) {
            const rawAnalysis = res.data.data;
            setAnalysis(rawAnalysis);
            if (rawAnalysis.detail) {
              try {
                // Try parsing the detail column. If it's old data like "Analysis created", this will throw.
                const parsed = JSON.parse(rawAnalysis.detail);
                if (parsed && typeof parsed === 'object') {
                  setDashboardData(parsed);
                }
              } catch (e) {
                // Silently ignore parse errors for old records to avoid Next.js error overlays.
                // For old records, dashboardData will remain null.
              }
            }
          }
        })
        .catch((err) =>
          console.error("Failed to fetch analysis metadata:", err),
        )
        .finally(() => setIsLoading(false));
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100svh-2rem)] flex-1 items-center justify-center bg-[#F4F9F6]">
        <div className="flex flex-col items-center gap-4 text-[#1A2E26]/55">
          <Loader2 className="size-8 animate-spin text-[#00B074]" />
          <p className="text-sm font-medium">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardView
      analysis={analysis}
      dashboardData={dashboardData}
      fileName={analysis?.file_name || "document"}
    />
  );
}
