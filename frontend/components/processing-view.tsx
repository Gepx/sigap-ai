"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { processingSteps } from "@/lib/data";

interface ProcessingViewProps {
  fileName: string;
  onComplete: () => void;
}

export default function ProcessingView({ fileName, onComplete }: ProcessingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reveal a new step every 1.5 seconds
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    // After all steps are revealed, wait 1.5s then trigger complete
    const totalTime = processingSteps.length * 1500 + 1000;
    const timeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => onComplete(), 500);
    }, totalTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="relative flex flex-1 flex-col min-h-svh bg-white overflow-hidden items-center justify-center px-6">
      {/* Ambient glow effect (similar to upload view) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-green-300/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-6 shadow-sm shadow-emerald-200">
            {isComplete ? (
              <CheckCircle2 className="size-8" />
            ) : (
              <Sparkles className="size-8 animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {isComplete ? "Analysis Complete!" : "Analyzing Document"}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {fileName}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isPast = index < currentStepIndex;
            const isVisible = index <= currentStepIndex;

            if (!isVisible) return null;

            return (
              <div 
                key={index} 
                className={`
                  flex items-start gap-4 p-4 rounded-xl border transition-all duration-500
                  animate-in fade-in slide-in-from-bottom-4
                  ${isActive ? "bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-50" : ""}
                  ${isPast ? "bg-white/60 border-transparent opacity-60" : ""}
                `}
              >
                <div className="mt-1">
                  {isPast ? (
                    <CheckCircle2 className="size-5 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className="size-5 text-emerald-600 animate-spin" />
                  ) : null}
                </div>
                <div>
                  <p className={`font-medium ${isActive ? "text-emerald-800" : "text-gray-700"}`}>
                    {step.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
