import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const sentimentBars = [
  { label: "Positive", value: "58%", color: "bg-[#00B074]", width: "w-[58%]" },
  { label: "Neutral", value: "25%", color: "bg-[#F2C94C]", width: "w-[25%]" },
  { label: "Negative", value: "17%", color: "bg-[#F25F5C]", width: "w-[17%]" },
];

function DashboardPreview() {
  return (
    <div className="sigap-dashboard-float relative mx-auto w-full max-w-5xl rounded-[2rem] bg-gradient-to-br from-[#00B074] via-[#77E1B4] to-[#1A2E26] p-[1px] shadow-2xl shadow-[#00B074]/20">
      <div className="overflow-hidden rounded-[calc(2rem-1px)] bg-[#FBFFFC]">
        <div className="flex items-center justify-between border-b border-[#1A2E26]/8 bg-white/80 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-[#F25F5C]" />
              <span className="size-3 rounded-full bg-[#F2C94C]" />
              <span className="size-3 rounded-full bg-[#00B074]" />
            </div>
            <span className="text-sm font-black text-[#1A2E26]">
              Sigap.ai reputation dashboard
            </span>
          </div>
          <span className="hidden rounded-full bg-[#00B074]/10 px-3 py-1 text-xs font-bold text-[#007A51] sm:inline-flex">
            Live analysis
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#1A2E26]/8 bg-[#F4F9F6] p-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00B074]">
                    Sentiment overview
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#1A2E26]">
                    1,247 reviews processed
                  </h3>
                </div>
                <div className="rounded-2xl bg-white p-3 text-[#00B074] shadow-sm">
                  <BarChart3 className="size-5" />
                </div>
              </div>

              <div className="space-y-4">
                {sentimentBars.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#1A2E26]/70">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className={`sigap-bar-grow h-full rounded-full ${item.color} ${item.width}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Accuracy", "88.6%", TrendingUp],
                ["Response", "< 500ms", CheckCircle2],
                ["Risk alerts", "12", AlertTriangle],
              ].map(([label, value, Icon]) => (
                <div
                  key={label as string}
                  className="rounded-2xl border border-[#1A2E26]/8 bg-white p-4 shadow-sm"
                >
                  <Icon className="mb-3 size-5 text-[#00B074]" />
                  <p className="text-xs font-bold text-[#1A2E26]/50">
                    {label as string}
                  </p>
                  <p className="mt-1 text-xl font-black text-[#1A2E26]">
                    {value as string}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-[#1A2E26]/8 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-[#1A2E26]">Critical theme</h3>
                <span className="rounded-full bg-[#F25F5C]/10 px-3 py-1 text-xs font-bold text-[#B43331]">
                  High priority
                </span>
              </div>
              <div className="rounded-2xl bg-[#1A2E26] p-4 text-white">
                <p className="text-sm font-bold">Delivery time spike</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Negative reviews mention late delivery 413 times this week.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#00B074]/20 bg-[#E8FFF4] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#00B074] text-white">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-black text-[#1A2E26]">
                    AI recommendation
                  </p>
                  <p className="text-xs font-bold text-[#1A2E26]/50">
                    Ready in 24-48h action window
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#1A2E26]/70">
                Add courier backup for peak hours and send proactive delay
                messages to customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-[#1A2E26]/10 px-5 pb-20 pt-16 sm:px-8 lg:px-10 lg:pb-28"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,176,116,0.18),transparent_35%),linear-gradient(180deg,#F4F9F6_0%,#FFFFFF_70%)]" />
      <div className="absolute left-1/2 top-36 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-[#00B074]/10 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00B074]/25 bg-white/70 px-4 py-2 text-sm font-bold text-[#007A51] shadow-sm">
          <FileText className="size-4" />
          AI perception analysis for SME reputation risk
        </div>

        <h1 className="max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-[#1A2E26] sm:text-6xl lg:text-7xl">
          Turn customer reviews into
          <span className="block bg-gradient-to-r from-[#00B074] via-[#079968] to-[#1A2E26] bg-clip-text text-transparent">
            tactical business action.
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-[#1A2E26]/65 sm:text-lg">
          Sigap.ai helps businesses detect sentiment, spot reputation risks,
          and generate practical recommendations before small review problems
          become operational crises.
        </p>

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B074] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#00B074]/25 transition hover:-translate-y-0.5 hover:bg-[#079968]"
          >
            Try the dashboard
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-[#1A2E26]/10 bg-white px-7 py-4 text-sm font-black text-[#1A2E26] shadow-sm transition hover:-translate-y-0.5 hover:border-[#00B074]/40 hover:text-[#007A51]"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-14 w-full">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
