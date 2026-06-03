import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

/**
 * Interface representing each step in the product onboarding/workflow section.
 */
interface OnboardingStep {
  step: string;
  title: string;
  desc: string;
}

/**
 * Static workflow steps explaining how the application processes customer reviews.
 */
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    step: "01",
    title: "Upload Customer Reviews",
    desc: "Input unstructured review data from marketplaces or social media. The system supports direct text input or data files.",
  },
  {
    step: "02",
    title: "Detect Sentiment & Reputation",
    desc: "AI automatically classifies sentiment and triggers the Early Warning System if it detects critical negative reviews.",
  },
  {
    step: "03",
    title: "Get 24-Hour Tactical Solutions",
    desc: "RAG technology drafts practical short-term business improvement suggestions (24-48 hours) to implement immediately.",
  },
];

/**
 * Home component serving as the main entry point for the Sigap.ai Landing Page.
 * Organized into logical sections with clear semantic markup for SEO and layout readability.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-slate-700 selection:bg-teal-55 selection:text-primary">
      {/* 1. Header Navigation Bar */}
      <Navbar />

      {/* 2. Page Main Container */}
      <main className="flex-grow">
        
        {/* Welcome Section & Main Visual CTA */}
        <Hero />

        {/* Core Value Proposition & Capability Cards */}
        <Benefits />

        {/* Detailed Interactive Features Demonstration */}
        <Features />

        {/* High-level Operational Workflow Section */}
        <section id="how-it-works" className="py-24 bg-white border-t border-slate-100">
          <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 xl:px-32">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-base font-semibold tracking-wider text-primary uppercase">
                How it Works
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                Three Easy Steps to Use Sigap.ai
              </p>
            </div>

            {/* Workflow Steps Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {ONBOARDING_STEPS.map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-8 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Step ID badge */}
                  <div className="text-4xl font-extrabold text-primary/20 group-hover:text-primary transition-colors">
                    {item.step}
                  </div>
                  
                  {/* Step Title */}
                  <h3 className="mt-4 text-xl font-bold text-slate-800">
                    {item.title}
                  </h3>
                  
                  {/* Step Description */}
                  <p className="mt-2 text-sm text-slate-655 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* 3. Footer containing Team Profile and Partner Grid */}
      <Footer />
    </div>
  );
}
