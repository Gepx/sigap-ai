"use client"

import React from "react"
import { RefreshCw, Target, Lightbulb, TrendingUp } from "lucide-react"

interface RecommendationItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  impact: string;
}

interface RecommendationsViewProps {
  recommendationData: RecommendationItem[];
  resetFlow: () => void;
}

export function RecommendationsView({ recommendationData, resetFlow }: RecommendationsViewProps) {
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-12 gap-4 animate-fade-up">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#00B074]/10 px-4 py-2 rounded-full mb-4">
            <Lightbulb className="w-4 h-4 text-[#00B074]" />
            <span className="text-sm font-bold text-[#00B074]">AI-Generated Insights</span>
          </div>
          <h1 className="text-4xl font-black text-[#1A2E26] mb-3 tracking-tight">AI Action Recommendations</h1>
          <p className="text-[#1A2E26]/50 text-lg font-medium max-w-lg">Strategic initiatives prioritized by sentiment analysis impact potential.</p>
        </div>
        <button 
          onClick={resetFlow}
          className="group text-[#00B074] bg-white hover:bg-[#F4F9F6] border border-border/30 px-5 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md shrink-0"
        >
          <RefreshCw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
          New Analysis
        </button>
      </div>

      <div className="space-y-6 stagger-children">
        {recommendationData.map((rec, idx) => {
          const priorityConfig: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
            High: { 
              bg: "bg-rose-50", 
              text: "text-rose-600", 
              border: "border-rose-100",
              icon: <Target className="w-6 h-6 text-rose-500" />
            },
            Medium: { 
              bg: "bg-amber-50", 
              text: "text-amber-600", 
              border: "border-amber-100",
              icon: <Lightbulb className="w-6 h-6 text-amber-500" />
            },
            Low: { 
              bg: "bg-emerald-50", 
              text: "text-emerald-600", 
              border: "border-emerald-100",
              icon: <TrendingUp className="w-6 h-6 text-emerald-500" />
            }
          }
          
          const config = priorityConfig[rec.priority] || priorityConfig.Medium

          return (
            <div key={rec.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_16px_50px_rgb(0,0,0,0.05)] hover:-translate-y-1 border border-border/20 group">
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}>
                      {config.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-[#1A2E26] tracking-tight leading-tight">{rec.title}</h2>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.1em] whitespace-nowrap w-fit ${config.bg} ${config.text} border ${config.border}`}>
                    {rec.priority} Priority
                  </div>
                </div>
                
                <p className="text-slate-500 leading-relaxed text-base font-medium ml-16">
                  {rec.description}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#F4F9F6] to-[#F4F9F6]/60 border-t border-border/20 p-6 md:px-10 flex items-center gap-4 group-hover:from-[#00B074]/5 group-hover:to-[#F4F9F6]/60 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-[#00B074]/10 flex items-center justify-center shrink-0">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <span className="font-black text-[#1A2E26]">Expected Impact: </span>
                  <span className="text-[#1A2E26]/70 font-medium">{rec.impact}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
