"use client";

import React from "react";
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface Recommendation {
  summary: string;
  action_items: string[];
}

interface RecommendationSectionProps {
  recommendation: Recommendation;
}

const getPriorityByIndex = (
  index: number,
): { label: string; icon: React.ReactNode; className: string } => {
  if (index === 0)
    return {
      label: "High priority",
      icon: <AlertTriangle className="size-4 text-rose-500" />,
      className: "border-[#F25F5C]/20 bg-[#FFF1F1] text-[#B43331]",
    };
  if (index === 1)
    return {
      label: "Medium priority",
      icon: <Zap className="size-4 text-amber-500" />,
      className: "border-[#F2C94C]/30 bg-[#FFF8E1] text-[#9A7200]",
    };
  return {
    label: "Low priority",
    icon: <Info className="size-4 text-emerald-500" />,
    className: "border-[#00B074]/20 bg-[#E8FFF4] text-[#007A51]",
  };
};

export default function RecommendationSection({
  recommendation,
}: RecommendationSectionProps) {
  if (!recommendation?.action_items?.length) return null;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#1A2E26]/10 bg-white/90 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00B074] via-[#77E1B4] to-[#1A2E26]" />

      <div className="p-5 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#1A2E26]/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E8FFF4] text-[#00B074]">
              <Lightbulb className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#1A2E26]">
                AI Recommendation
              </h2>
              <p className="mt-1 text-sm font-medium text-[#1A2E26]/55">
                Berdasarkan hasil analisis sentimen terbaru
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
            <ShieldCheck className="size-3.5" />
            Ready for action
          </div>
        </div>

        {/* Summary paragraph from RAG */}
        <div className="mt-5 rounded-[1.35rem] border border-[#00B074]/15 bg-[#F4FFF9] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="size-4 text-[#00B074]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#007A51]">
              Ringkasan analisis
            </span>
          </div>
          <p className="text-sm leading-7 text-[#1A2E26]/75">
            {recommendation.summary}
          </p>
        </div>

        {/* Action Items */}
        <div className="mt-5 grid gap-3">
          {recommendation.action_items.map((item, index) => {
            const priority = getPriorityByIndex(index);
            return (
              <div
                key={index}
                className="group rounded-[1.35rem] border border-[#1A2E26]/8 bg-[#FBFFFC] p-5 transition-colors hover:border-[#00B074]/20 hover:bg-[#E8FFF4]/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 items-start gap-3">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E8FFF4]">
                      <CheckCircle2 className="size-4 text-[#00B074]" />
                    </div>
                    <p className="text-sm leading-7 text-[#1A2E26]/80">{item}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shrink-0 ${priority.className}`}
                  >
                    {priority.icon}
                    {priority.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
