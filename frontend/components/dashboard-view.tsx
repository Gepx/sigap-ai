"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import RecommendationSection from "@/components/recommendation-section";
import type { SummaryJson } from "@/lib/types/summary";

const COLORS = {
  positive: "#00b074",
  neutral: "#f2c94c",
  negative: "#f25f5c",
};

export default function DashboardView({ sessionUuid }: { sessionUuid: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["session-dashboard", sessionUuid],
    queryFn: async () => {
      const res = await api.get(`/api/sessions/${sessionUuid}`);
      // API returns { history, chat_history, has_analysis }
      return res.data.data as { chat_history: SummaryJson; history: { title: string } };
    },
    enabled: !!sessionUuid,
  });

  const summaryJson = data?.chat_history;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100svh-2rem)] flex-1 items-center justify-center bg-[#F4F9F6]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-10 animate-spin text-[#00B074]" />
          <p className="text-lg font-bold text-[#1A2E26]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !summaryJson) {
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Failed to load dashboard data.";
    return (
      <div className="flex min-h-[calc(100svh-2rem)] flex-1 items-center justify-center bg-[#F4F9F6]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="size-10 text-red-400" />
          <p className="text-lg font-bold text-[#1A2E26]">{msg}</p>
        </div>
      </div>
    );
  }

  const { summary, aspect_breakdown, recommendation, early_warning, business_context } =
    summaryJson;
  const total = summary.total_reviews;
  const dist = summary.sentiment_distribution;

  const metrics = [
    {
      label: "Total feedback",
      value: total.toLocaleString(),
      detail: "Rows processed from the uploaded CSV",
    },
    {
      label: "Positif",
      value: total > 0 ? `${Math.round((dist.positive / total) * 100)}%` : "0%",
      detail: `${dist.positive.toLocaleString()} ulasan`,
    },
    {
      label: "Netral",
      value: total > 0 ? `${Math.round((dist.neutral / total) * 100)}%` : "0%",
      detail: `${dist.neutral.toLocaleString()} ulasan`,
    },
    {
      label: "Negatif",
      value: total > 0 ? `${Math.round((dist.negative / total) * 100)}%` : "0%",
      detail: `${dist.negative.toLocaleString()} ulasan`,
    },
  ];

  const pieData = [
    { name: "Positif", value: dist.positive },
    { name: "Netral", value: dist.neutral },
    { name: "Negatif", value: dist.negative },
  ];

  const aspectData = aspect_breakdown.map((a) => ({
    name: a.aspect,
    Positif: a.positive,
    Negatif: a.negative,
    Netral: a.neutral,
  }));

  return (
    <div className="relative flex min-h-[calc(100svh-2rem)] flex-1 overflow-hidden bg-[#F4F9F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(26,46,38,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-12 size-72 rounded-full bg-[#00B074]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-6rem] size-[30rem] rounded-full bg-[#1A2E26]/8 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1A2E26] sm:text-4xl">
              Sentiment Analysis
            </h1>
            <p className="mt-1 text-sm font-medium text-[#1A2E26]/55">
              {business_context}
            </p>
          </div>
          <Button
            variant="outline"
            className="h-11 rounded-full border-[#1A2E26]/10 bg-white text-[#1A2E26] hover:bg-[#E8FFF4] hover:text-[#007A51]"
          >
            <Download className="size-4" />
            Export report
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.5rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur"
            >
              <p className="text-sm font-bold text-[#1A2E26]/55">{metric.label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-[#1A2E26]">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#1A2E26]/55">{metric.detail}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT: Pie + Crisis card */}
          <div className="flex flex-col gap-6 h-full">
            {/* Sentiment Distribution Donut */}
            <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                    Distribusi sentimen
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                    Positif · Netral · Negatif
                  </h3>
                </div>
                <span className="rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
                  {summary.average_confidence
                    ? `Avg conf ${(summary.average_confidence * 100).toFixed(0)}%`
                    : "AI confidence"}
                </span>
              </div>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-pie-${index}`}
                          fill={
                            index === 0
                              ? COLORS.positive
                              : index === 1
                                ? COLORS.neutral
                                : COLORS.negative
                          }
                        />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(26,46,38,0.08)",
                        boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Crisis Stats Card */}
            <div className="flex flex-col justify-between rounded-[1.75rem] border border-red-100 bg-red-50/60 p-5 shadow-sm sm:p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                  Early Warning
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Ulasan krisis terdeteksi
                </h3>
                <p className="mt-3 text-6xl font-black text-red-500">
                  {summary.crisis_count}
                </p>
                <p className="mt-2 text-sm font-medium text-[#1A2E26]/60">
                  {summary.crisis_count === 0
                    ? "Tidak ada ulasan berbahaya. 🎉"
                    : "ulasan membutuhkan perhatian segera"}
                </p>
              </div>
              <p className="mt-6 text-xs text-[#1A2E26]/45">
                Konteks bisnis:{" "}
                <span className="font-bold">{business_context}</span>
              </p>
            </div>
          </div>

          {/* RIGHT: Aspect Breakdown Grouped Bar */}
          <div className="flex h-full min-h-[28rem] flex-col rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                  Aspek ulasan
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Sentimen per aspek
                </h3>
              </div>
              <span className="rounded-full bg-[#F4F9F6] px-3 py-1 text-xs font-bold text-[#1A2E26]/55">
                Rasa · Harga · Pelayanan
              </span>
            </div>
            <div className="min-h-0 flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={aspectData}
                  margin={{ top: 10, right: 10, bottom: 5, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e9f2ed"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#1a2e26" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64756f" }}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#f4f9f6" }}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(26,46,38,0.08)",
                      boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                  />
                  <Bar
                    dataKey="Positif"
                    fill={COLORS.positive}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="Netral"
                    fill={COLORS.neutral}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="Negatif"
                    fill={COLORS.negative}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Early Warning Cards */}
        {early_warning && early_warning.length > 0 && (
          <div className="rounded-[2rem] border border-red-100 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-red-100 pb-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                  Early Warning System
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-[#1A2E26]">
                  {early_warning.length} ulasan krisis terdeteksi
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              {early_warning.map((warn, idx) => (
                <div
                  key={warn.id || idx}
                  className={`rounded-[1.35rem] border p-4 ${
                    warn.severity === "High"
                      ? "border-red-200 bg-red-50"
                      : warn.severity === "Medium"
                        ? "border-amber-200 bg-amber-50"
                        : "border-orange-100 bg-orange-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex-1 text-sm font-medium text-[#1A2E26]">
                      &ldquo;{warn.text}&rdquo;
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        warn.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : warn.severity === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {warn.severity}
                    </span>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#1A2E26]/8 bg-white p-3">
                    <p className="mb-1 text-xs font-black uppercase tracking-wider text-[#007A51]">
                      Suggested reply
                    </p>
                    <p className="text-xs leading-5 text-[#1A2E26]/70">
                      {warn.suggested_reply}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Section */}
        <RecommendationSection recommendation={recommendation} />
      </div>
    </div>
  );
}
