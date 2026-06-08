"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  summaryData,
  sentimentTrendData,
  channelDistributionData,
  topThemesData,
  wordFrequencyData,
  sentimentOverTimeData,
} from "@/lib/data";
import RecommendationSection from "@/components/recommendation-section";

const COLORS = {
  positive: "#00b074",
  neutral: "#f2c94c",
  negative: "#f25f5c",
};

export default function DashboardView({ fileName }: { fileName: string }) {
  const metrics = [
    {
      label: "Total feedback",
      value: summaryData.totalFeedback.toLocaleString(),
      detail: "Rows processed from the uploaded CSV",
    },
    {
      label: "Positive",
      value: `${summaryData.positive.percentage}%`,
      detail: `${summaryData.positive.count.toLocaleString()} reviews`,
    },
    {
      label: "Neutral",
      value: `${summaryData.neutral.percentage}%`,
      detail: `${summaryData.neutral.count.toLocaleString()} reviews`,
    },
    {
      label: "Negative",
      value: `${summaryData.negative.percentage}%`,
      detail: `${summaryData.negative.count.toLocaleString()} reviews`,
    },
  ];

  return (
    <div className="relative flex min-h-[calc(100svh-2rem)] flex-1 overflow-hidden bg-[#F4F9F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,176,116,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(26,46,38,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-12 size-72 rounded-full bg-[#00B074]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-6rem] size-[30rem] rounded-full bg-[#1A2E26]/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6">
        {/* Simple inline header — title left, export right */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight text-[#1A2E26] sm:text-4xl">
            Sentiment Analysis
          </h1>
          <Button
            variant="outline"
            className="h-11 rounded-full border-[#1A2E26]/10 bg-white text-[#1A2E26] hover:bg-[#E8FFF4] hover:text-[#007A51]"
          >
            <Download className="size-4" />
            Export report
          </Button>
        </div>

        {/* Metric cards — no icons */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.5rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur"
            >
              <p className="text-sm font-bold text-[#1A2E26]/55">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-[#1A2E26]">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#1A2E26]/55">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Sentiment trend + Channel mix */}
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Line chart */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                  Sentiment trend
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Review sentiment over time
                </h3>
              </div>
              <span className="rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
                Interactive chart
              </span>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sentimentTrendData}
                  margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e9f2ed"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64756f" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64756f" }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(26,46,38,0.08)",
                      boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    name="Positive"
                    stroke={COLORS.positive}
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    name="Neutral"
                    stroke={COLORS.neutral}
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    name="Negative"
                    stroke={COLORS.negative}
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel donut charts */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                  Channel mix
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Sentiment by channel
                </h3>
              </div>
              <span className="rounded-full bg-[#F4F9F6] px-3 py-1 text-xs font-bold text-[#1A2E26]/55">
                3 sources
              </span>
            </div>

            <div className="space-y-4">
              {channelDistributionData.map((channel) => (
                <div
                  key={channel.channel}
                  className="rounded-[1.35rem] border border-[#1A2E26]/8 bg-[#FBFFFC] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-[#1A2E26]">
                        {channel.channel}
                      </p>
                      <p className="text-xs text-[#1A2E26]/52">
                        {channel.data.reduce(
                          (acc, curr) => acc + curr.value,
                          0,
                        )}{" "}
                        total reviews
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs font-bold text-[#1A2E26]/55">
                      <span className="rounded-full bg-[#E8FFF4] px-2 py-1 text-[#007A51]">
                        Positive
                      </span>
                      <span className="rounded-full bg-[#FFF8E1] px-2 py-1 text-[#9A7200]">
                        Neutral
                      </span>
                      <span className="rounded-full bg-[#FFF1F1] px-2 py-1 text-[#B43331]">
                        Negative
                      </span>
                    </div>
                  </div>
                  <div className="h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channel.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {channel.data.map((entry, index) => (
                            <Cell
                              key={`cell-${channel.channel}-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: 16,
                            border: "1px solid rgba(26,46,38,0.08)",
                            boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volume + themes + word frequency */}
        <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr] xl:items-stretch">
          <div className="grid gap-6">
            {/* Sentiment Volume Trend (Area Chart) */}
            <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 flex h-[320px] flex-col">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                    Volume
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                    Review volume over time
                  </h3>
                </div>
                <span className="rounded-full bg-[#F4F9F6] px-3 py-1 text-xs font-bold text-[#1A2E26]">
                  4 Weeks
                </span>
              </div>
              <div className="min-h-0 flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sentimentOverTimeData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={COLORS.positive}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.positive}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorNeu" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={COLORS.neutral}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.neutral}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={COLORS.negative}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.negative}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64756f", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64756f", fontSize: 12 }}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e9f2ed"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(26,46,38,0.08)",
                        boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stroke={COLORS.positive}
                      fillOpacity={1}
                      fill="url(#colorPos)"
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stroke={COLORS.neutral}
                      fillOpacity={1}
                      fill="url(#colorNeu)"
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stroke={COLORS.negative}
                      fillOpacity={1}
                      fill="url(#colorNeg)"
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Horizontal bar chart — themes */}
            <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 h-[320px]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                    Themes
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                    Top feedback themes
                  </h3>
                </div>
                <span className="rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-bold text-[#007A51]">
                  Prioritized
                </span>
              </div>
              <div className="h-[calc(100%-5rem)] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topThemesData}
                    layout="vertical"
                    margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e9f2ed"
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64756f" }}
                    />
                    <YAxis
                      dataKey="theme"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#1a2e26" }}
                      width={130}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#f4f9f6" }}
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(26,46,38,0.08)",
                        boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 12, 12, 0]}>
                      {topThemesData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.theme}-${index}`}
                          fill={COLORS[entry.sentiment as keyof typeof COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stacked bar chart — word frequency */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 flex h-full min-h-[41.5rem] flex-col">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                  Word frequency
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Common review terms
                </h3>
              </div>
              <span className="rounded-full bg-[#F4F9F6] px-3 py-1 text-xs font-bold text-[#1A2E26]/55">
                Stacked view
              </span>
            </div>
            <div className="min-h-0 flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wordFrequencyData}
                  margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e9f2ed"
                  />
                  <XAxis
                    dataKey="word"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#1a2e26" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64756f" }}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#f4f9f6" }}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(26,46,38,0.08)",
                      boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                  />
                  <Bar
                    dataKey="positive"
                    name="Positive"
                    stackId="a"
                    fill={COLORS.positive}
                    radius={[0, 0, 12, 12]}
                  />
                  <Bar
                    dataKey="neutral"
                    name="Neutral"
                    stackId="a"
                    fill={COLORS.neutral}
                  />
                  <Bar
                    dataKey="negative"
                    name="Negative"
                    stackId="a"
                    fill={COLORS.negative}
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <RecommendationSection />
      </div>
    </div>
  );
}
