"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileUp,
  Lightbulb,
  Loader2,
  ShieldAlert,
} from "lucide-react";

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

const simulationSteps = [
  "Reading CSV structure",
  "Cleaning Indonesian review text",
  "Classifying sentiment",
  "Detecting reputation risks",
  "Drafting action recommendation",
];

export default function Benefits() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % simulationSteps.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00B074]">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1A2E26] sm:text-5xl">
            From raw reviews to a clear response plan.
          </h2>
          <p className="mt-5 text-base font-medium leading-8 text-[#1A2E26]/60">
            The flow stays simple for business users: upload the feedback,
            let Sigap.ai read the perception signal, then act on the result.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <div
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
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-[#00B074] via-[#77E1B4] to-[#1A2E26] p-[1px]">
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

            <div className="rounded-[1.5rem] border border-[#1A2E26]/10 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b border-[#1A2E26]/8 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#00B074]/10 text-[#00B074]">
                    <FileUp className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#1A2E26]">
                      reviews_june.csv
                    </p>
                    <p className="text-xs font-bold text-[#1A2E26]/45">
                      1,247 rows detected
                    </p>
                  </div>
                </div>
                <span className="hidden items-center gap-2 rounded-full bg-[#00B074]/10 px-3 py-1 text-xs font-black text-[#007A51] sm:inline-flex">
                  Running
                  <ArrowRight className="size-3" />
                </span>
              </div>

              <div className="space-y-3">
                {simulationSteps.map((step, index) => {
                  const isDone = index < activeStep;
                  const isActive = index === activeStep;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 rounded-2xl border p-4 transition duration-300 ${
                        isActive
                          ? "border-[#00B074]/30 bg-[#E8FFF4] text-[#007A51]"
                          : isDone
                            ? "border-[#00B074]/15 bg-white text-[#1A2E26]/55"
                            : "border-[#1A2E26]/8 bg-[#F4F9F6] text-[#1A2E26]/35"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="size-5 text-[#00B074]" />
                      ) : isActive ? (
                        <Loader2 className="size-5 animate-spin text-[#00B074]" />
                      ) : (
                        <span className="size-5 rounded-full border-2 border-current" />
                      )}
                      <span className="text-sm font-bold">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
