"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Loader2, Lightbulb, AlertTriangle, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recommendationProcessingSteps, recommendationData } from "@/lib/data";

type RecommendationState = "idle" | "processing" | "completed";

export default function RecommendationSection() {
  const [state, setState] = useState<RecommendationState>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (state === "processing") {
      setCurrentStepIndex(0);
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
    setState("processing");
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <AlertTriangle className="size-4 text-rose-500" />;
      case "Medium": return <Zap className="size-4 text-amber-500" />;
      case "Low": return <Info className="size-4 text-emerald-500" />;
      default: return null;
    }
  };

  if (state === "idle") {
    return (
      <div className="mt-8 flex justify-center pb-8">
        <Button 
          onClick={handleStart}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/50 transition-all hover:-translate-y-0.5 px-8"
        >
          <Sparkles className="size-4 mr-2" />
          Get Action Recommendation
        </Button>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="mt-8 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm max-w-3xl mx-auto w-full mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-emerald-50 pb-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-100 text-emerald-600 animate-pulse">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI is analyzing your data...</h3>
            <p className="text-sm text-gray-500">Generating actionable insights</p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendationProcessingSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isPast = index < currentStepIndex;
            const isVisible = index <= currentStepIndex;

            if (!isVisible) return null;

            return (
              <div 
                key={index} 
                className={`
                  flex items-start gap-3 p-3 rounded-lg border transition-all duration-500
                  animate-in fade-in slide-in-from-bottom-2
                  ${isActive ? "bg-emerald-50 border-emerald-200" : ""}
                  ${isPast ? "bg-gray-50 border-transparent opacity-60" : ""}
                `}
              >
                <div className="mt-0.5">
                  {isPast ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className="size-4 text-emerald-600 animate-spin" />
                  ) : null}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isActive ? "text-emerald-800" : "text-gray-700"}`}>
                    {step.message}
                  </p>
                  {isActive && (
                    <p className="text-xs text-gray-500 mt-1">
                      {step.detail}
                    </p>
                  )}
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
    <div className="mt-8 bg-white rounded-2xl border border-emerald-200 shadow-lg shadow-emerald-100/50 overflow-hidden relative mb-8">
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600">
            <Lightbulb className="size-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">AI Action Recommendations</h2>
            <p className="text-sm text-gray-500 mt-1">Based on the latest sentiment analysis report</p>
          </div>
        </div>

        <div className="grid gap-6">
          {recommendationData.map((rec) => (
            <div key={rec.id} className="group relative p-5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">{rec.title}</h3>
                    <span className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                      ${rec.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : 
                        rec.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : 
                        "bg-emerald-50 text-emerald-700 border-emerald-200"}
                    `}>
                      {getPriorityIcon(rec.priority)}
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {rec.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100/50">
                    <Sparkles className="size-4" />
                    <span className="text-emerald-800">Expected Impact:</span>
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
