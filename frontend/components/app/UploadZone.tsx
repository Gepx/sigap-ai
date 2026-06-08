"use client"

import React, { useState } from "react"
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"

interface UploadZoneProps {
  currentState: number;
  handleFileUpload: (e: React.DragEvent | React.ChangeEvent) => void;
  startAnalysis: () => void;
}

export function UploadZone({ currentState, handleFileUpload, startAnalysis }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
      {/* Greeting */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-[#00B074]/10 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#00B074]" />
          <span className="text-sm font-semibold text-[#00B074]">AI-Powered Analysis</span>
        </div>
        <h1 className="text-5xl font-black text-[#1A2E26] mb-4 tracking-tight leading-tight">
          Hello, Testing User!
        </h1>
        <p className="text-[#1A2E26]/50 text-lg font-medium max-w-md mx-auto leading-relaxed">
          Upload your customer feedback data to get started with sentiment analysis.
        </p>
      </div>

      {/* Upload Card */}
      <div 
        className={`w-full bg-white rounded-[2rem] p-14 flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden animate-scale-in ${
          currentState === 2 
            ? "border-2 border-[#00B074] shadow-[0_20px_60px_rgba(0,176,116,0.12)]" 
            : isDragging
              ? "border-2 border-[#00B074]/60 shadow-[0_20px_60px_rgba(0,176,116,0.15)] scale-[1.01]"
              : "border-2 border-dashed border-[#00B074]/20 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-[#00B074]/40 hover:shadow-[0_16px_40px_rgb(0,0,0,0.04)]"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { setIsDragging(false); handleFileUpload(e) }}
      >
        {/* Subtle background gradient */}
        {currentState === 2 && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#00B074]/5 via-transparent to-[#00B074]/3 pointer-events-none" />
        )}

        {currentState === 1 ? (
          <div className="flex flex-col items-center relative z-10">
            <div className={`h-24 w-24 bg-gradient-to-br from-[#00B074]/15 to-[#00B074]/5 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 ${isDragging ? 'animate-pulse-glow scale-110' : 'animate-float'}`}>
              <UploadCloud className="w-11 h-11 text-[#00B074]" />
            </div>
            <p className="text-[#1A2E26] font-bold text-2xl mb-2 tracking-tight">Drag & drop your CSV file here</p>
            <p className="text-[#1A2E26]/40 font-medium text-base mb-10">or click to browse files</p>
            <div className="bg-[#F4F9F6] border border-[#00B074]/10 px-5 py-2.5 rounded-full">
              <p className="text-xs font-bold text-[#1A2E26]/40 uppercase tracking-[0.15em]">Supports: .csv files up to 50MB</p>
            </div>
            <input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} accept=".csv" />
            <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer z-20"></label>
          </div>
        ) : (
          <div className="flex flex-col items-center relative z-10 animate-scale-in">
            <div className="h-28 w-28 bg-gradient-to-br from-[#00B074]/20 to-[#00B074]/5 rounded-[2.5rem] flex items-center justify-center mb-8 relative animate-pulse-glow">
              <FileText className="w-14 h-14 text-[#00B074]" />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg shadow-[#00B074]/20">
                <CheckCircle2 className="w-8 h-8 text-[#00B074]" />
              </div>
            </div>
            <div className="bg-[#F4F9F6] border border-[#00B074]/15 px-6 py-3.5 rounded-full mb-10 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00B074] animate-pulse" />
              <span className="text-[#1A2E26] font-bold tracking-tight">telco-customer-churn.csv</span>
              <span className="text-xs text-[#1A2E26]/40 font-medium">2.4 MB</span>
            </div>
            <button 
              onClick={startAnalysis}
              className="group bg-[#00B074] text-white px-10 py-4.5 rounded-full font-bold text-lg shadow-[0_12px_36px_rgba(0,176,116,0.3)] hover:shadow-[0_16px_48px_rgba(0,176,116,0.4)] hover:bg-[#00a068] transition-all duration-300 flex items-center gap-3 hover:scale-[1.03] active:scale-[0.98]"
            >
              Confirm & Run Analysis
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
