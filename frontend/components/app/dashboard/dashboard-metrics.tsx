export default function DashboardMetrics({ summary }: { summary?: any }) {
  if (!summary) {
    return (
      <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 text-center text-[#1A2E26]/55">
        No metrics data available for this analysis. Please try re-uploading the
        file.
      </div>
    );
  }

  const total = summary.total_reviews || 0;
  const posPct =
    total > 0
      ? ((summary.sentiment_distribution.positive / total) * 100).toFixed(1)
      : "0.0";
  const neuPct =
    total > 0
      ? ((summary.sentiment_distribution.neutral / total) * 100).toFixed(1)
      : "0.0";
  const negPct =
    total > 0
      ? ((summary.sentiment_distribution.negative / total) * 100).toFixed(1)
      : "0.0";

  const metrics = [
    {
      label: "Total feedback",
      value: total.toLocaleString(),
      detail: "Rows processed from the uploaded CSV",
    },
    {
      label: "Positive",
      value: `${posPct}%`,
      detail: `${summary.sentiment_distribution.positive.toLocaleString()} reviews`,
    },
    {
      label: "Neutral",
      value: `${neuPct}%`,
      detail: `${summary.sentiment_distribution.neutral.toLocaleString()} reviews`,
    },
    {
      label: "Negative",
      value: `${negPct}%`,
      detail: `${summary.sentiment_distribution.negative.toLocaleString()} reviews`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[1.5rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur"
        >
          <p className="text-sm font-bold text-[#1A2E26]/55">{metric.label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[#1A2E26]">
            {metric.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#1A2E26]/55">
            {metric.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
