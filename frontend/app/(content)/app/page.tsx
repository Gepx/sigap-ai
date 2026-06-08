"use client"

import React, { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app/Sidebar"
import { UploadZone } from "@/components/app/UploadZone"
import { ProcessingState } from "@/components/app/ProcessingState"
import { DashboardGrid } from "@/components/app/DashboardGrid"
import { RecommendationsView } from "@/components/app/RecommendationsView"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Calendar } from "lucide-react"

import {
  processingSteps,
  summaryData,
  channelData,
  sentimentTrendData,
  channelDistributionData,
  topThemesData,
  recommendationProcessingSteps,
  recommendationData
} from "@/lib/data"

export default function Page() {
  const [currentState, setCurrentState] = useState<number>(1)
  const [loadingStep, setLoadingStep] = useState<number>(0)

  // Simulation logic for loading animations
  useEffect(() => {
    if (currentState === 3) {
      if (loadingStep < processingSteps.length) {
        const timer = setTimeout(() => {
          setLoadingStep(prev => prev + 1)
        }, 800)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setCurrentState(4)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }

    if (currentState === 6) {
      if (loadingStep < recommendationProcessingSteps.length) {
        const timer = setTimeout(() => {
          setLoadingStep(prev => prev + 1)
        }, 1200)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setCurrentState(7)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [currentState, loadingStep])

  const handleFileUpload = (e: React.DragEvent | React.ChangeEvent) => {
    e.preventDefault()
    setCurrentState(2)
  }

  const startAnalysis = () => {
    setLoadingStep(0)
    setCurrentState(3)
  }

  const startRecommendations = () => {
    setLoadingStep(0)
    setCurrentState(6)
  }

  const resetFlow = () => {
    setCurrentState(1)
    setLoadingStep(0)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F4F9F6] min-h-screen selection:bg-[#00B074]/20 selection:text-[#1A2E26]">
        <header className="flex h-[72px] shrink-0 items-center gap-2 border-b border-border/30 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2 px-6 w-full">
            <SidebarTrigger className="-ml-2 hover:bg-black/5 rounded-full p-2" />
            <div className="flex-1" />
            <div className="text-sm text-[#1A2E26]/60 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-border/40">
              <Calendar className="w-4 h-4 text-[#00B074]" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full flex flex-col">
          
          {(currentState === 1 || currentState === 2) && (
            <UploadZone 
              currentState={currentState}
              handleFileUpload={handleFileUpload}
              startAnalysis={startAnalysis}
            />
          )}

          {currentState === 3 && (
            <ProcessingState 
              steps={processingSteps}
              loadingStep={loadingStep}
            />
          )}

          {(currentState === 4 || currentState === 5) && (
            <DashboardGrid 
              summaryData={summaryData}
              channelData={channelData}
              sentimentTrendData={sentimentTrendData}
              topThemesData={topThemesData}
              channelDistributionData={channelDistributionData}
              startRecommendations={startRecommendations}
            />
          )}

          {currentState === 6 && (
            <ProcessingState 
              steps={recommendationProcessingSteps}
              loadingStep={loadingStep}
            />
          )}

          {currentState === 7 && (
            <RecommendationsView 
              recommendationData={recommendationData}
              resetFlow={resetFlow}
            />
          )}

        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

