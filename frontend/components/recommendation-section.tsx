"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  Lightbulb,
  AlertTriangle,
  Info,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { recommendationProcessingSteps, recommendationData } from "@/lib/data";

type RecommendationState = "idle" | "processing" | "completed";

export default function RecommendationSection() {
  const [state, setState] = useState<RecommendationState>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (state === "processing") {
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < recommendationProcessingSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1500);

      const totalTime = recommendationProcessingSteps.length * 1500 + 1000;
      const timeout = setTimeout(() => {
        setState("completed");
      }, totalTime);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [state]);

  const handleStart = () => {
    setCurrentStepIndex(0);
    setState("processing");
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertTriangle className="size-4 text-rose-500" />;
      case "Medium":
        return <Zap className="size-4 text-amber-500" />;
      case "Low":
        return <Info className="size-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  if (state === "idle") {
    return (
      <div className="mt-2 flex justify-center pb-2">
        <Button
          onClick={handleStart}
          size="lg"
          className="h-12 rounded-full bg-[#00B074] px-8 text-white shadow-lg shadow-[#00B074]/20 transition hover:-translate-y-0.5 hover:bg-[#079968]"
        >
          <Sparkles className="mr-2 size-4" />
          Get AI recommendation
        </Button>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="mt-6 rounded-[2rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-2xl shadow-[#00B074]/10 backdrop-blur sm:p-6">
        <div className="flex items-center gap-3 border-b border-[#1A2E26]/8 pb-4">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 animate-pulse">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-[#1A2E26]">
              AI is thinking again
            </h3>
            <p className="text-sm font-medium text-[#1A2E26]/55">
              Generating recommendation steps inside a scrollable card
            </p>
          </div>
        </div>

        <div className="mt-5 max-h-[20rem] space-y-3 overflow-y-auto pr-1">
          {recommendationProcessingSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isPast = index < currentStepIndex;
            const isVisible = index <= currentStepIndex;

            if (!isVisible) return null;

            return (
              <div
                key={index}
                className={`
                  flex items-start gap-3 rounded-2xl border p-4 transition-all duration-500
                  ${isActive ? "border-[#00B074]/25 bg-[#E8FFF4]" : ""}
                  ${isPast ? "border-transparent bg-[#F4F9F6] opacity-65" : ""}
                `}
              >
                <div className="mt-0.5">
                  {isPast ? (
                    <CheckCircle2 className="size-4 text-[#00B074]" />
                  ) : isActive ? (
                    <Loader2 className="size-4 animate-spin text-[#00B074]" />
                  ) : null}
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${isActive ? "text-[#007A51]" : "text-[#1A2E26]"}`}
                  >
                    {step.message}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#1A2E26]/55">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // state === "completed"
  return (
    <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#1A2E26]/10 bg-white/90 shadow-2xl shadow-[#00B074]/10 backdrop-blur">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00B074] via-[#77E1B4] to-[#1A2E26]" />

      <div className="p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 border-b border-[#1A2E26]/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E8FFF4] text-[#00B074]">
              <Lightbulb className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#1A2E26]">
                AI recommendation output
              </h2>
              <p className="mt-1 text-sm font-medium text-[#1A2E26]/55">
                Based on the latest sentiment analysis report
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
            <ShieldCheck className="size-3.5" />
            Ready for action
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {recommendationData.map((rec) => (
            <div
              key={rec.id}
              className="group rounded-[1.35rem] border border-[#1A2E26]/8 bg-[#FBFFFC] p-5 transition-colors hover:border-[#00B074]/20 hover:bg-[#E8FFF4]/40"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-black text-[#1A2E26]">
                      {rec.title}
                    </h3>
                    <span
                      className={`
                      inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold
                      ${
                        rec.priority === "High"
                          ? "border-[#F25F5C]/20 bg-[#FFF1F1] text-[#B43331]"
                          : rec.priority === "Medium"
                            ? "border-[#F2C94C]/30 bg-[#FFF8E1] text-[#9A7200]"
                            : "border-[#00B074]/20 bg-[#E8FFF4] text-[#007A51]"
                      }
                    `}
                    >
                      {getPriorityIcon(rec.priority)}
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="mb-4 text-sm leading-7 text-[#1A2E26]/62">
                    {rec.description}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#00B074]/15 bg-white px-4 py-2 text-sm font-semibold text-[#007A51] shadow-sm">
                    <Sparkles className="size-4" />
                    <span className="text-[#1A2E26]">Expected impact:</span>
                    {rec.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
