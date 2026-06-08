import {
  AlarmClock,
  BarChart3,
  BrainCircuit,
  Download,
  FileSearch,
  Lightbulb,
  MessageSquareWarning,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const mvpItems = [
  {
    title: "Sentiment classifier",
    description:
      "Classifies reviews into positive, neutral, and negative with an Indonesian-focused preprocessing pipeline.",
    metric: "3-class NLP",
    icon: BrainCircuit,
  },
  {
    title: "Reputation dashboard",
    description:
      "Visualizes trends, channel distribution, feedback themes, and urgent changes in one product view.",
    metric: "Real-time view",
    icon: BarChart3,
  },
  {
    title: "Early warning system",
    description:
      "Surfaces sudden negative-review spikes so owners can respond before a reputation issue grows.",
    metric: "Risk alerts",
    icon: MessageSquareWarning,
  },
  {
    title: "RAG recommendation",
    description:
      "Generates short-term tactical actions based on sentiment, themes, and business context.",
    metric: "24-48h plan",
    icon: Lightbulb,
  },
];

const features = [
  {
    title: "Theme clustering",
    description:
      "Groups repeated complaints like delivery, pricing, staff behavior, or product quality so teams know what to fix first.",
    icon: FileSearch,
  },
  {
    title: "Priority scoring",
    description:
      "Ranks issues by frequency, sentiment severity, and channel impact instead of showing charts without direction.",
    icon: AlarmClock,
  },
  {
    title: "Action playbooks",
    description:
      "Turns recommendations into concrete tasks such as courier backup, apology scripts, or service recovery steps.",
    icon: Route,
  },
  {
    title: "Exportable reports",
    description:
      "Creates shareable summaries for weekly business reviews, internal reports, or capstone evaluation demos.",
    icon: Download,
  },
  {
    title: "Owner-friendly language",
    description:
      "Explains what changed, why it matters, and what to do next without requiring data-science knowledge.",
    icon: Sparkles,
  },
  {
    title: "Operational guardrails",
    description:
      "Keeps the output tactical and realistic, focused on actions that can be tested quickly by SMEs.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <>
      <section id="mvp" className="bg-[#F4F9F6] px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00B074]">
                MVP scope
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1A2E26] sm:text-5xl">
                Built around the moments that protect reputation.
              </h2>
            </div>
            <p className="text-base font-medium leading-8 text-[#1A2E26]/60">
              The MVP should not feel like a generic analytics demo. Its job is
              to help a business owner move from review noise to prioritized,
              operational action.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {mvpItems.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.75rem] bg-gradient-to-br from-[#00B074]/45 via-transparent to-[#1A2E26]/15 p-[1px] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00B074]/10"
              >
                <div className="h-full rounded-[calc(1.75rem-1px)] bg-white p-6 transition group-hover:bg-[#FBFFFC]">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E8FFF4] text-[#00B074] transition group-hover:bg-[#00B074] group-hover:text-white">
                      <item.icon className="size-6" />
                    </span>
                    <span className="rounded-full bg-[#F4F9F6] px-3 py-1 text-xs font-black text-[#1A2E26]/55">
                      {item.metric}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#1A2E26]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-[#1A2E26]/60">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00B074]">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1A2E26] sm:text-5xl">
              Designed for fast, confident business decisions.
            </h2>
            <p className="mt-5 text-base font-medium leading-8 text-[#1A2E26]/60">
              These features support the current product and give the next
              iteration a clearer, more useful direction.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-[1.75rem] bg-gradient-to-br from-[#00B074]/45 via-[#00B074]/5 to-[#1A2E26]/15 p-[1px] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00B074]/10 ${
                  index === 0 || index === 3 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="h-full rounded-[calc(1.75rem-1px)] bg-[#F4F9F6] p-7 transition duration-300 group-hover:bg-white">
                  <span className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-white text-[#00B074] shadow-sm transition group-hover:scale-110 group-hover:bg-[#00B074] group-hover:text-white">
                    <feature.icon className="size-6" />
                  </span>
                  <h3 className="text-2xl font-black text-[#1A2E26]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-[#1A2E26]/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
