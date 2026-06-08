"use client"

import React from "react"
import { Activity, CheckCircle2, Loader2 } from "lucide-react"

interface ProcessingStep {
  message: string;
  detail: string;
}

interface ProcessingStateProps {
  steps: ProcessingStep[];
  loadingStep: number;
}

export function ProcessingState({ steps, loadingStep }: ProcessingStateProps) {
  const progress = steps.length > 0 ? (loadingStep / steps.length) * 100 : 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgb(0,0,0,0.04)] w-full border border-border/30 animate-scale-in">
        
        {/* Animated Wireframe Skeleton */}
        <div className="w-full h-52 bg-gradient-to-br from-[#F4F9F6] to-[#F4F9F6]/60 rounded-[2rem] p-8 flex flex-col justify-between mb-8 overflow-hidden relative border border-[#00B074]/10">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-3">
              <div className="w-40 h-7 bg-[#00B074]/10 rounded-full animate-pulse"></div>
              <div className="w-24 h-4 bg-black/[0.03] rounded-full animate-pulse delay-100"></div>
            </div>
            <div className="w-16 h-16 bg-[#00B074]/10 rounded-[1.2rem] animate-pulse flex items-center justify-center">
               <Activity className="text-[#00B074] w-8 h-8" />
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-black/[0.03] rounded-2xl animate-pulse"></div>
              <div className="flex-1 h-10 bg-black/[0.03] rounded-2xl animate-pulse delay-150"></div>
              <div className="flex-1 h-10 bg-black/[0.03] rounded-2xl animate-pulse delay-300"></div>
            </div>
            <div className="w-full h-4 bg-black/[0.03] rounded-full animate-pulse delay-100"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 px-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[#1A2E26]/40 uppercase tracking-[0.15em]">Processing</span>
            <span className="text-xs font-bold text-[#00B074]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-[#F4F9F6] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00B074] to-[#00d48d] rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Steps Loader */}
        <div className="space-y-5 px-2">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 transition-all duration-700 ease-out ${
                idx < loadingStep ? "opacity-100" : 
                idx === loadingStep ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
              }`}
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <div className="mt-0.5 shrink-0">
                {idx < loadingStep ? (
                  <div className="w-7 h-7 rounded-full bg-[#00B074]/10 flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="w-5 h-5 text-[#00B074]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#00B074]/10 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-[#00B074] animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-base tracking-tight transition-colors duration-300 ${idx === loadingStep ? "text-[#1A2E26]" : "text-[#1A2E26]/50"}`}>
                  {step.message}
                </p>
                <p className="text-[#1A2E26]/40 mt-0.5 font-medium text-sm">{step.detail}</p>
              </div>
              {idx < loadingStep && (
                <span className="text-xs font-bold text-[#00B074] bg-[#00B074]/10 px-2.5 py-1 rounded-full shrink-0 animate-scale-in">Done</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
