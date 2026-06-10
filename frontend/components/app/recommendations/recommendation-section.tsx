"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Sparkles, Lightbulb, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { recommendationProcessingSteps } from "@/lib/data";

import RecommendationProcessing from "@/components/app/recommendations/recommendation-processing";
import RecommendationCard from "@/components/app/recommendations/recommendation-card";

type RecommendationState = "idle" | "processing" | "completed" | "error";

export default function RecommendationSection({ warning, analysis }: { warning?: any, analysis?: any }) {
  const [state, setState] = useState<RecommendationState>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [draftingIds, setDraftingIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (analysis?.recommendation && state === "idle") {
      try {
        let cleanJson = analysis.recommendation.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        setRecommendations(Array.isArray(parsed) ? parsed : [parsed]);
        setState("completed");
      } catch (e) {
        console.error("Failed to parse stored recommendation:", e);
      }
    }
  }, [analysis?.recommendation]);

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

      return () => clearInterval(interval);
    }
  }, [state]);

  const handleStart = async () => {
    setCurrentStepIndex(0);
    setState("processing");

    if (warning) {
      try {
        const response = await api.post(`/api/ai/recommendation`, { 
          warning,
          analysisId: analysis?.uuid
        });
        
        const result = response.data;
        
        if (result.success && result.data) {
          try {
            // Gemini might return stringified JSON with markdown blocks, let's clean it up
            let cleanJson = result.data.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            setRecommendations(Array.isArray(parsed) ? parsed : [parsed]);
          } catch (e) {
            console.error("Failed to parse RAG JSON:", e, result.data);
            setRecommendations([{
              id: "fallback-1",
              title: "AI Response Error",
              priority: "Medium",
              description: result.data,
              impact: "Raw AI output provided due to formatting error."
            }]);
          }
        }
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    }

    setTimeout(() => {
      setState("completed");
    }, recommendationProcessingSteps.length * 1500 + 1000);
  };

  const handleGenerateDraft = async (rec: any) => {
    const recId = rec.id || rec.title;
    setDraftingIds((prev) => ({ ...prev, [recId]: true }));
    try {
      const response = await api.post("/api/ai/draft", {
        recommendation: { id: rec.id, title: rec.title, description: rec.description },
        warningContext: warning,
        analysisId: analysis?.uuid,
      });
      if (response.data?.success) {
        setRecommendations((prev) => prev.map(r => 
          (r.id === rec.id || r.title === rec.title) ? { ...r, draft: response.data.data } : r
        ));
      }
    } catch (e) {
      toast.error("Failed to generate draft.");
    } finally {
      setDraftingIds((prev) => ({ ...prev, [recId]: false }));
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
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
          Get AI recommendation {warning && "(Based on Warning)"}
        </Button>
      </div>
    );
  }

  if (state === "processing") {
    return <RecommendationProcessing currentStepIndex={currentStepIndex} warning={warning} />;
  }

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
                Based on the latest {warning ? "Early Warning trigger" : "sentiment analysis"}
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
            <ShieldCheck className="size-3.5" />
            Ready for action
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id || Math.random().toString()}
              rec={rec}
              isDrafting={!!draftingIds[rec.id || rec.title]}
              copiedId={copiedId}
              onGenerateDraft={handleGenerateDraft}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
