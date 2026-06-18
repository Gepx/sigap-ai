"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileUp,
  Lightbulb,
  Loader2,
  ShieldAlert,
  Play,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Upload review data",
    description:
      "Import CSV feedback from marketplaces, social media, support chat, or survey exports.",
    icon: FileUp,
  },
  {
    number: "02",
    title: "Analyze sentiment",
    description:
      "The model classifies sentiment, detects recurring themes, and highlights negative-review spikes.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Get recommendations",
    description:
      "RAG turns insight into tactical actions your team can execute within the next 24-48 hours.",
    icon: Lightbulb,
  },
];

type SimulatorStatus = "idle" | "uploading" | "processing" | "done";

const simulationSteps = [
  "Reading CSV structure",
  "Cleaning Indonesian review text",
  "Classifying sentiment",
  "Detecting reputation risks",
  "Drafting action recommendation",
];

export default function Benefits() {
  const [simStatus, setSimStatus] = useState<SimulatorStatus>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const activeStepRef = useRef<HTMLDivElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (simStatus === "processing") {
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev < simulationSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setSimStatus("done");
            return prev + 1;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [simStatus]);

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeStep]);

  const handleStartSim = () => {
    if (simStatus !== "idle") return;
    setSimStatus("uploading");
    setTimeout(() => {
      setSimStatus("processing");
      setActiveStep(0);
    }, 1000);
  };

  const handleReset = () => {
    setSimStatus("idle");
    setActiveStep(-1);
  };

  return (
    <section id="how-it-works" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-black uppercase tracking-[0.25em] text-[#00B074]"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-black tracking-tight text-[#1A2E26] sm:text-5xl"
          >
            From raw reviews to a clear response plan.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base font-medium leading-8 text-[#1A2E26]/60"
          >
            The flow stays simple for business users: upload the feedback, let
            Sigap.ai read the perception signal, then act on the result.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-start"
        >
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-[#00B074]/20 bg-[#F4F9F6] py-1.5 pl-1.5 pr-5 transition-all duration-300 hover:border-[#00B074]/30 hover:bg-[#00B074]/10 hover:shadow-md"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#00B074] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 size-4 fill-current" />
            </span>
            <span className="text-sm font-bold text-[#00B074]">
              Watch video
            </span>
          </button>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
          className="mt-2 grid gap-5 lg:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              key={step.number}
              className="group relative rounded-[1.75rem] bg-gradient-to-br from-[#00B074]/45 via-[#00B074]/10 to-[#1A2E26]/15 p-[1px] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00B074]/10"
            >
              <div className="h-full rounded-[calc(1.75rem-1px)] bg-[#F4F9F6] p-7 transition duration-300 group-hover:bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-[#00B074]/20 transition group-hover:text-[#00B074]">
                    {step.number}
                  </span>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-[#00B074] shadow-sm transition group-hover:scale-110 group-hover:bg-[#00B074] group-hover:text-white">
                    <step.icon className="size-6" />
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-black text-[#1A2E26]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-7 text-[#1A2E26]/60">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-8 rounded-[2rem] bg-gradient-to-br from-[#00B074] via-[#77E1B4] to-[#1A2E26] p-[1px]"
        >
          <div className="grid gap-8 rounded-[calc(2rem-1px)] bg-[#F4F9F6] p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="flex flex-col justify-center">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#00B074] text-white shadow-lg shadow-[#00B074]/20">
                <ShieldAlert className="size-7" />
              </div>
              <h3 className="text-2xl font-black text-[#1A2E26] sm:text-3xl">
                Mini app simulation
              </h3>
              <p className="mt-4 text-sm font-medium leading-7 text-[#1A2E26]/60">
                This mirrors the product experience: a focused upload, visible
                AI processing, and an output that points to the next business
                move.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#1A2E26]/10 bg-white p-5 shadow-sm transition-all duration-300">
              <div className="mb-5 flex items-center justify-between border-b border-[#1A2E26]/8 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#00B074]/10 text-[#00B074]">
                    <FileUp className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#1A2E26]">
                      AI Pipeline Simulator
                    </p>
                  </div>
                </div>
                {simStatus !== "idle" && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-[#00B074] hover:underline"
                  >
                    Reset Simulator
                  </button>
                )}
              </div>

              {simStatus === "idle" && (
                <div
                  onClick={handleStartSim}
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#00B074]/30 bg-[#00B074]/5 p-10 transition-colors hover:bg-[#00B074]/10"
                >
                  <div className="rounded-xl bg-[#00B074] p-3.5 text-white shadow-sm transition-transform group-hover:scale-105">
                    <FileUp className="size-6" />
                  </div>
                  <span className="mt-4 text-base font-black text-[#1A2E26]">
                    Select File
                  </span>
                  <span className="mt-1 text-xs font-bold text-[#1A2E26]/45">
                    or drag file here
                  </span>
                  <p className="mt-6 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1A2E26]/60 shadow-sm">
                    Click to simulate the sentiment analysis
                  </p>
                </div>
              )}

              {simStatus === "uploading" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="size-10 animate-spin text-[#00B074]" />
                  <span className="mt-4 text-sm font-bold text-[#1A2E26]/70">
                    Uploading review file...
                  </span>
                </div>
              )}

              {(simStatus === "processing" || simStatus === "done") && (
                <div className="space-y-3">
                  {/* File Mockup Header */}
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-[#00B074]/10 bg-[#F4F9F6] p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[#00B074] text-white">
                        <FileUp className="size-4" />
                      </span>
                      <div>
                        <p className="text-xs font-black text-[#1A2E26]">
                          reviews_june.csv
                        </p>
                        <p className="text-[10px] font-bold text-[#1A2E26]/45">
                          1,247 rows detected
                        </p>
                      </div>
                    </div>
                    {simStatus === "processing" && (
                      <span className="hidden items-center gap-1.5 rounded-full bg-[#00B074]/10 px-2.5 py-1 text-[10px] font-black text-[#007A51] sm:inline-flex">
                        Running
                        <Loader2 className="size-3 animate-spin" />
                      </span>
                    )}
                  </div>

                  {simStatus !== "done" && (
                    <div className="max-h-[12rem] space-y-3 overflow-y-auto pr-2">
                      {simulationSteps.map((step, index) => {
                        const isDone = index < activeStep;
                        const isActive =
                          index === activeStep && simStatus === "processing";

                        return (
                          <div
                            key={step}
                            ref={isActive ? activeStepRef : null}
                            className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                              isActive
                                ? "translate-x-1 border-[#00B074]/30 bg-[#E8FFF4] text-[#007A51] shadow-sm"
                                : isDone
                                  ? "border-[#00B074]/15 bg-white text-[#1A2E26]/55"
                                  : "border-[#1A2E26]/8 bg-[#F4F9F6] text-[#1A2E26]/35"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isDone ? (
                                <CheckCircle2 className="size-5 text-[#00B074]" />
                              ) : isActive ? (
                                <Loader2 className="size-5 animate-spin text-[#00B074]" />
                              ) : (
                                <span className="size-5 rounded-full border-2 border-current" />
                              )}
                              <span className="text-sm font-bold">{step}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Final Visualization Mockup */}
                  {simStatus === "done" && (
                    <div className="mt-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="rounded-2xl border border-[#00B074]/20 bg-[#F4F9F6] p-4 text-center shadow-sm">
                        <p className="text-xs font-black text-[#1A2E26]">
                          🎉 Analysis Complete!
                        </p>
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          <span className="rounded-full bg-[#00B074]/15 px-3 py-1 text-xs font-bold text-[#007A51]">
                            58% Positive
                          </span>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            25% Neutral
                          </span>
                          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                            17% Negative
                          </span>
                        </div>
                        <div className="mt-3 rounded-xl bg-white p-3 border border-[#1A2E26]/5 text-left">
                          <p className="text-[11px] font-black uppercase text-[#1A2E26]/60">
                            Top Recommendation
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#1A2E26]">
                            "Customers love the new packaging, but shipping
                            delays are causing frustration. Prioritize
                            alternative courier options."
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2E26]/80 p-4 backdrop-blur-sm"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
              >
                <X className="size-5" />
              </button>
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  src="https://www.youtube.com/embed/zjoBwqDOUzc?autoplay=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
