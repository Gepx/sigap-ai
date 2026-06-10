import React from "react";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { recommendationProcessingSteps } from "@/lib/data";

interface Props {
  currentStepIndex: number;
  warning?: any;
}

export default function RecommendationProcessing({ currentStepIndex, warning }: Props) {
  return (
    <div className="mt-6 rounded-[2rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-2xl shadow-[#00B074]/10 backdrop-blur sm:p-6">
      <div className="flex items-center gap-3 border-b border-[#1A2E26]/8 pb-4">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20 animate-pulse">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight text-[#1A2E26]">
            AI is analyzing {warning ? "the warning context" : "data"}...
          </h3>
          <p className="text-sm font-medium text-[#1A2E26]/55">
            Generating RAG response from Standard Operating Procedures
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
