import React from "react";
import { summaryData } from "@/lib/data";

export default function DashboardMetrics() {
  const metrics = [
    {
      label: "Total feedback",
      value: summaryData.totalFeedback.toLocaleString(),
      detail: "Rows processed from the uploaded CSV",
    },
    {
      label: "Positive",
      value: `${summaryData.positive.percentage}%`,
      detail: `${summaryData.positive.count.toLocaleString()} reviews`,
    },
    {
      label: "Neutral",
      value: `${summaryData.neutral.percentage}%`,
      detail: `${summaryData.neutral.count.toLocaleString()} reviews`,
    },
    {
      label: "Negative",
      value: `${summaryData.negative.percentage}%`,
      detail: `${summaryData.negative.count.toLocaleString()} reviews`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[1.5rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur"
        >
          <p className="text-sm font-bold text-[#1A2E26]/55">
            {metric.label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[#1A2E26]">
            {metric.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#1A2E26]/55">
            {metric.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
