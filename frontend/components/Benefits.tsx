"use client";

import Link from "next/link";
import { BrainCircuit, Lightbulb, BellRing, ArrowRight } from "lucide-react";

/**
 * Interface representing a benefit or capability card item.
 */
interface BenefitCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

/**
 * Core product benefit cards containing titles, descriptions, and lucide icon graphics.
 */
const BENEFIT_CARDS: BenefitCard[] = [
  {
    title: "AI Sentiment Analysis",
    desc: "Classifies customer reviews into positive, negative, or neutral categories instantly.",
    icon: <BrainCircuit className="h-6 w-6 text-[#0D6D5F]" />,
  },
  {
    title: "Actionable Recommendations",
    desc: "Transforms sentiment data into practical business development advice using RAG technology.",
    icon: <Lightbulb className="h-6 w-6 text-[#0D6D5F]" />,
  },
  {
    title: "Early Warning System",
    desc: "Automated notifications for negative reviews that could potentially trigger a reputation crisis.",
    icon: <BellRing className="h-6 w-6 text-[#0D6D5F]" />,
  },
];

/**
 * Static bullet items explaining the benefits of choosing Sigap.ai.
 */
const WHY_SIGAP_BULLETS: string[] = [
  "Real-time monitoring for digital channels.",
  "Data-driven decisions without needing technical expertise.",
  "Focus on tactical, short-term operational improvements.",
];

/**
 * Benefits Component: Displays feature highlight cards and a two-column detail section
 * explaining the business impact and core value proposition of Sigap.ai.
 */
export default function Benefits() {
  return (
    <div id="benefits" className="w-full bg-white">
      
      {/* 1. Feature / Benefit Cards Grid */}
      <section className="py-20">
        <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFIT_CARDS.map((card, idx) => (
              <div 
                key={idx} 
                className="bg-[#E8F3F1] hover:bg-[#DCEFEF] rounded-3xl p-8 flex flex-col justify-between items-start min-h-[220px] transition-all duration-300 group shadow-xs hover:shadow-md"
              >
                {/* Icon, Card Title & Desc */}
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-2xl inline-block shadow-xs">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0D6D5F] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                
                {/* Target link for details */}
                <Link 
                  href="#features" 
                  className="mt-6 flex items-center gap-1.5 text-xs font-black text-[#0D6D5F] hover:underline"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Why Sigap.Ai? Split Section */}
      <section className="py-24 bg-[#F0F7F6] border-y border-[#D5E6E3]">
        <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Headings & Business Pitch */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-[#EAB308] uppercase tracking-wider">
                Why Sigap.Ai?
              </h2>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                <strong>"Prevent Crises, Protect Your Revenue."</strong>
              </h3>
              <p className="text-sm sm:text-base text-slate-655 leading-relaxed font-semibold">
                Unmonitored negative reviews can drop sales by 40-70% within weeks. Sigap.ai helps you stay ahead by turning unstructured feedback into actionable business strategies, preventing minor issues from becoming reputation crises.
              </p>
            </div>

            {/* Right Column: Key Value Proposition Bullet list */}
            <div className="space-y-6">
              {WHY_SIGAP_BULLETS.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  {/* Custom square marker */}
                  <div className="h-4 w-4 bg-[#EAB308] rounded-xs mt-1 flex-shrink-0" />
                  <p className="text-sm sm:text-base font-extrabold text-slate-700">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
