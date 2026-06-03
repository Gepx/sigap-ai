"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/**
 * Type defining the possible states of the interactive AI Pipeline Simulator.
 */
type SimulatorStatus = "idle" | "uploading" | "processing" | "done";

/**
 * Pipeline steps simulated during text preprocessing, analysis, and generation.
 */
const PIPELINE_STEPS: readonly string[] = [
  "Extracting review data from document...",
  "Cleaning and normalizing text structure...",
  "Classifying positive, neutral, and negative sentiments",
  "Finalizing sentiment report..."
] as const;

/**
 * Features Component: Showcases detailed MVP functions of the platform including:
 * 1. AI Sentiment Analysis (with interactive pipeline simulator)
 * 2. RAG Recommendation Engine (with preview mockup image)
 * 3. Dashboard Visualizer & Early Warning System (with analytics mockup image)
 */
export default function Features() {
  const [simStatus, setSimStatus] = useState<SimulatorStatus>("idle");
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Effect to automate transitioning between steps during "processing" status
  useEffect(() => {
    if (simStatus === "processing") {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < PIPELINE_STEPS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setSimStatus("done");
            return prev;
          }
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [simStatus]);

  /**
   * Action handler to begin the simulated review processing sequence.
   */
  const handleStartSim = () => {
    setSimStatus("uploading");
    setTimeout(() => {
      setSimStatus("processing");
      setCurrentStep(0);
    }, 1000);
  };

  /**
   * Resets simulator back to idle/upload state.
   */
  const handleReset = () => {
    setSimStatus("idle");
    setCurrentStep(0);
  };

  return (
    <section id="features" className="py-24 bg-slate-50/50">
      <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-base font-semibold tracking-wider text-primary uppercase">
            Core MVP Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Decision Support System Based on Sentiment Analysis
          </p>
          <p className="mt-4 text-lg text-slate-655">
            Sigap.ai integrates key features to help SME owners monitor business reputation and determine tactical steps independently.
          </p>
        </div>

        {/* Features Content Block */}
        <div className="space-y-28">
          
          {/* Feature 1: Sentiment Analysis & Simulator */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Feature Description (Left Column on Desktop) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-primary mb-4">
                MVP Feature 1
              </div>
              <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                AI Sentiment Analysis
              </h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                An NLP-based sentiment classification model curated specifically to understand marketplace and social media reviews. The system maps customer opinions directly to positive, negative, or neutral categories with high accuracy.
              </p>
              
              <ul className="mt-6 space-y-3.5">
                {[
                  "3-class classification (Positive, Neutral, Negative)",
                  "Supported by custom Indonesian preprocessing (slang, sarcasm)",
                  "Sentiment classification model accuracy target \u2265 85%"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                    <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Simulator Box (Right Column on Desktop) */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center w-full">
              <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300">
                
                {/* Simulator Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500" />
                    <span className="text-sm font-bold text-slate-700">AI Pipeline Simulator</span>
                  </div>
                  {simStatus !== "idle" && (
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Reset Simulator
                    </button>
                  )}
                </div>

                {/* State: Idle (Upload Area Trigger) */}
                {simStatus === "idle" && (
                  <div 
                    onClick={handleStartSim}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-teal-300 bg-teal-50/20 rounded-xl p-10 cursor-pointer hover:bg-teal-50/40 transition-colors group"
                  >
                    <div className="bg-primary text-white p-3.5 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="mt-4 font-bold text-slate-800 text-base">Select File</span>
                    <span className="mt-1 text-slate-500 text-xs">or drag file here</span>
                    <p className="mt-6 text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
                      Click to simulate the sentiment analysis process
                    </p>
                  </div>
                )}

                {/* State: Uploading Spinner */}
                {simStatus === "uploading" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
                    <span className="mt-4 font-semibold text-slate-700 text-sm">Uploading review file...</span>
                  </div>
                )}

                {/* State: Active Processing Steps & Results */}
                {(simStatus === "processing" || simStatus === "done") && (
                  <div className="space-y-3.5 py-2">
                    {PIPELINE_STEPS.map((step, idx) => {
                      const isActive = idx === currentStep && simStatus === "processing";
                      const isCompleted = idx < currentStep || simStatus === "done";

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                            isActive
                              ? "bg-teal-50/80 border-teal-200 shadow-sm translate-x-1"
                              : isCompleted
                              ? "bg-emerald-50/40 border-emerald-100 opacity-90"
                              : "bg-slate-50/40 border-slate-100 opacity-40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <svg className="h-5 w-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            ) : isActive ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-primary flex-shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                            )}
                            <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-slate-700"}`}>
                              {step}
                            </span>
                          </div>
                          {isActive && (
                            <span className="text-xs font-bold text-primary animate-pulse uppercase tracking-wider">
                              Processing
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                              Complete
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {/* Final simulated results metrics */}
                    {simStatus === "done" && (
                      <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl animate-fade-in text-center">
                        <p className="text-xs font-bold text-slate-800">
                          🎉 Analysis Complete! Sentiment Report Generated.
                        </p>
                        <div className="mt-3 flex gap-2 justify-center">
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            70% Positive
                          </span>
                          <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                            20% Neutral
                          </span>
                          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                            10% Negative
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          </div>

          {/* Feature 2: Actionable Recommendations (RAG) */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Mockup Preview Column */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl max-w-lg transition-all duration-300 hover:shadow-2xl">
                <Image
                  src="/assets/Main_Feature_After_Upload_File_Template.png"
                  alt="RAG Recommendation Platform Mockup"
                  width={600}
                  height={350}
                  className="rounded-lg object-contain w-full h-auto"
                />
              </div>
            </div>
            
            {/* Feature Description Column */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1 text-xs font-semibold text-amber-600 mb-4">
                MVP Feature 2
              </div>
              <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Actionable Recommendation (RAG)
              </h3>
              <p className="mt-4 text-slate-655 leading-relaxed font-medium">
                Transforms negative reviews into tactical operational solutions within 24-48 hours. Uses <strong>Retrieval-Augmented Generation</strong> (RAG) technology to provide action recommendations customized to the SME's industry type.
              </p>
              
              <ul className="mt-6 space-y-3.5">
                {[
                  "Practical and business-friendly tactical recommendations",
                  "Action-oriented suggestions (e.g. 'Add delivery courier if shipping is delayed')",
                  "Mitigates reputation crisis risks before they escalate"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-655">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3: Dashboard & Early Warning System */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Feature Description Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-primary mb-4">
                MVP Features 3 & 4
              </div>
              <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Dashboard & Early Warning System
              </h3>
              <p className="mt-4 text-slate-655 leading-relaxed font-medium">
                Interactive visual interface to track sentiment trends across multiple platforms. The system is equipped with an <strong>Early Warning System</strong> (EWS) that triggers warnings on the dashboard when a sudden spike in negative reviews is detected.
              </p>
              
              <ul className="mt-6 space-y-3.5">
                {[
                  "Visualizes perception trends and sentiment percentages",
                  "Early Warning System notifications for critical reviews",
                  "Periodic reports on digital reputation performance for SMEs"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-655">
                    <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Dashboard Mockup Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl max-w-lg transition-all duration-300 hover:shadow-2xl">
                <Image
                  src="/assets/Analytics_Page_Template.png"
                  alt="Dashboard Visualisasi Sigap.ai"
                  width={600}
                  height={350}
                  className="rounded-lg object-contain w-full h-auto"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
