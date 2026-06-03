"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Hero Component: Serves as the landing page introductory section.
 * Contains:
 * - A background grid effect mask.
 * - Left column text headline, product description, and business stats.
 * - Right column transparent product illustration.
 * - A single key CTA (Get Started).
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-radial from-teal-50/50 via-white to-white py-20 lg:py-28">
      
      {/* Decorative SVG background grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Main Grid Wrapper (Responsive: Single column on mobile, 12-column split grid on desktop) */}
      <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Content & Actions (Column span 7 of 12) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Project ID / Track Info Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-3.5 py-1.5 text-xs font-semibold text-primary mb-8 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            Capstone Project PJK-GM029 — AI for Business Intelligence & Market Insights
          </div>
          
          {/* Main Title Hero Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl leading-[1.15] max-w-4xl">
            Analyze Reviews & Perception <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">Faster & Smarter</span> with <span className="text-primary">Sigap.ai</span>
          </h1>
          
          {/* Tagline / Subtitle description block */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-650 max-w-3xl leading-relaxed">
            <strong>Intelligent Perception Analysis System</strong> designed as a decision-support tool for SMEs to mitigate digital reputation risks, monitor sentiment in real-time, and generate tactical operational recommendations within 24–48 hours.
          </p>
          
          {/* CTA Button Block */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-start gap-4 w-full sm:w-auto">
            <Link
              href="#features"
              className="w-full sm:w-auto text-center font-bold text-white bg-primary hover:bg-teal-700 active:scale-98 transition-all px-8 py-4 rounded-xl shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Quick Metrics & Target KPIs Grid */}
          <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            <div>
              <p className="text-3xl font-extrabold text-primary">&ge; 85%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Classification Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary">&le; 500 ms</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Max API Response</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary">RAG-based</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Action Recommendation</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary">MVP Web</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Early Crisis Detection</p>
            </div>
          </div>
        </div>

        {/* Right Side: Product Visual Illustration (Column span 5 of 12) */}
        <div className="lg:col-span-5 flex justify-center items-center w-full">
          <Image
            src="/assets/illustrasi__lending_page.png"
            alt="Sigap.ai Landing Page Illustration"
            width={580}
            height={500}
            priority
            className="object-contain w-full max-w-[480px] lg:max-w-none drop-shadow-xs"
          />
        </div>
      </div>
    </section>
  );
}
