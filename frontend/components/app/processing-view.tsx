"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { processingSteps } from "@/lib/data";

interface ProcessingViewProps {
  fileName: string;
  isUploadComplete: boolean;
  onComplete: () => void;
}

export default function ProcessingView({
  fileName,
  isUploadComplete,
  onComplete,
}: ProcessingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isUploadComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isUploadComplete, onComplete]);

  const rawProgress = Math.round(
    ((currentStepIndex + 1) / processingSteps.length) * 100,
  );
  const progress = isUploadComplete ? 100 : Math.min(99, rawProgress);

  return (
    <div className="relative flex min-h-[calc(100svh-2rem)] flex-1 items-center justify-center overflow-hidden bg-[#F4F9F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(26,46,38,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-10 size-72 rounded-full bg-[#00B074]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-6rem] size-[30rem] rounded-full bg-[#1A2E26]/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Page header */}
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B074]/20 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#007A51] shadow-sm backdrop-blur">
            <ShieldCheck className="size-3.5" />
            AI processing
          </div>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#1A2E26] sm:text-5xl">
            {isUploadComplete ? "Analysis complete" : "Thinking through the data"}
          </h2>
          <p className="mt-4 text-base font-medium leading-8 text-[#1A2E26]/62">
            {fileName} • Sigap.ai is reading the file, normalizing text, and
            preparing the sentiment output.
          </p>
        </div>

        {/* Single unified card */}
        <div className="rounded-[2rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-2xl shadow-[#00B074]/10 backdrop-blur sm:p-6 lg:p-8">
          {/* Header row */}
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#1A2E26]/8 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                Thinking process
              </p>
              <h3 className="mt-2 text-xl font-black tracking-tight text-[#1A2E26]">
                Scroll through the AI steps
              </h3>
            </div>
            <div className="rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
              Live
            </div>
          </div>

          {/* Progress bar — directly below heading */}
          <div className="mb-5 rounded-2xl bg-[#F4F9F6] p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-[#007A51]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E8FFF4]">
              <div
                className="h-full rounded-full bg-[#00B074] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step list */}
          <div className="max-h-[15rem] space-y-3 overflow-y-auto pr-2">
            {processingSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              const isVisible = index <= currentStepIndex;

              if (!isVisible) return null;

              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 rounded-2xl border p-4 transition-all duration-500 ${
                    isActive
                      ? "border-[#00B074]/25 bg-[#E8FFF4]"
                      : isPast
                        ? "border-transparent bg-white opacity-65"
                        : "border-[#1A2E26]/8 bg-[#F4F9F6]"
                  }`}
                >
                  <div className="mt-0.5">
                    {isPast ? (
                      <CheckCircle2 className="size-5 text-[#00B074]" />
                    ) : isActive ? (
                      <Loader2 className="size-5 animate-spin text-[#00B074]" />
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
      </div>
    </div>
  );
}
