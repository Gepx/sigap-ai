"use client";

import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const COLORS = {
  positive: "#00b074",
  neutral: "#f2c94c",
  negative: "#f25f5c",
};

interface ChannelBreakdownItem {
  channel: string;
  positive: number;
  negative: number;
  neutral: number;
}

export default function DashboardCharts({
  aspectBreakdown,
  channelBreakdown,
  timeSeriesData,
  wordFreqData,
}: {
  aspectBreakdown?: any[];
  channelBreakdown?: ChannelBreakdownItem[];
  timeSeriesData?: any[];
  wordFreqData?: any[];
}) {
  const [timeSeriesFilter, setTimeSeriesFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  if (!aspectBreakdown) {
    return (
      <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 text-center text-[#1A2E26]/55">
        No chart data available for this analysis. Please try re-uploading the
        file.
      </div>
    );
  }

  // Fallbacks if data is missing
  const rawTimeSeries = timeSeriesData || [];
  const chartWordFreq = wordFreqData || [];

  const now = new Date();

  // Filter for Time Series
  let chartTimeSeries = [...rawTimeSeries];
  if (timeSeriesFilter !== "all" && chartTimeSeries.length > 0) {
    const cutoffTS = new Date(now);
    if (timeSeriesFilter === "7d") cutoffTS.setDate(now.getDate() - 7);
    else if (timeSeriesFilter === "1m") cutoffTS.setMonth(now.getMonth() - 1);
    else if (timeSeriesFilter === "3m") cutoffTS.setMonth(now.getMonth() - 3);
    else if (timeSeriesFilter === "6m") cutoffTS.setMonth(now.getMonth() - 6);
    else if (timeSeriesFilter === "1y")
      cutoffTS.setFullYear(now.getFullYear() - 1);

    chartTimeSeries = chartTimeSeries.filter((item: any) => {
      return new Date(item.date) >= cutoffTS;
    });
  }

  // Filter for Platform Comparison
  let platformChartData = channelBreakdown || [];
  if (platformFilter !== "all" && rawTimeSeries.length > 0) {
    const cutoffPlat = new Date(now);
    if (platformFilter === "7d") cutoffPlat.setDate(now.getDate() - 7);
    else if (platformFilter === "1m") cutoffPlat.setMonth(now.getMonth() - 1);
    else if (platformFilter === "3m") cutoffPlat.setMonth(now.getMonth() - 3);
    else if (platformFilter === "6m") cutoffPlat.setMonth(now.getMonth() - 6);
    else if (platformFilter === "1y")
      cutoffPlat.setFullYear(now.getFullYear() - 1);

    const newChannelMap: Record<
      string,
      { positive: number; negative: number; neutral: number; total: number }
    > = {};
    rawTimeSeries.forEach((item: any) => {
      if (new Date(item.date) >= cutoffPlat && item.channels) {
        Object.keys(item.channels).forEach((channel) => {
          if (!newChannelMap[channel]) {
            newChannelMap[channel] = {
              positive: 0,
              negative: 0,
              neutral: 0,
              total: 0,
            };
          }
          newChannelMap[channel].total += item.channels[channel];
        });
      }
    });
    platformChartData = Object.keys(newChannelMap).map((channel) => ({
      channel,
      ...newChannelMap[channel],
    }));
  }

  return (
    <>
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 h-full">
          {/* Sentiment Volume Trend (Line Chart) */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 flex h-[320px] flex-col">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                  Sentiment Trend
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Review sentiment over time
                </h3>
              </div>
              <select
                value={timeSeriesFilter}
                onChange={(e) => setTimeSeriesFilter(e.target.value)}
                className="rounded-full bg-[#F4F9F6] border-none px-3 py-1 text-xs font-bold text-[#1A2E26] focus:ring-1 focus:ring-[#00B074]"
              >
                <option value="7d">Last 7 Days</option>
                <option value="1m">Last 1 Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last 1 Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartTimeSeries}
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
                  <Area
                    type="monotone"
                    dataKey="negative"
                    name="Negative"
                    stackId="a"
                    stroke={COLORS.negative}
                    fill={COLORS.negative}
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    name="Neutral"
                    stackId="a"
                    stroke={COLORS.neutral}
                    fill={COLORS.neutral}
                  />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    name="Positive"
                    stackId="a"
                    stroke={COLORS.positive}
                    fill={COLORS.positive}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Platform Comparison Trend (Bar Chart) */}
          <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 flex h-[320px] flex-col">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
                  Platform
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
                  Review volume by platform
                </h3>
              </div>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="rounded-full bg-[#F4F9F6] border-none px-3 py-1 text-xs font-bold text-[#1A2E26] focus:ring-1 focus:ring-[#00B074]"
              >
                <option value="7d">Last 7 Days</option>
                <option value="1m">Last 1 Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last 1 Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="min-h-0 flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="channel"
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
                    cursor={{ fill: "rgba(0,176,116,0.05)" }}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(26,46,38,0.08)",
                      boxShadow: "0 20px 40px -20px rgba(26,46,38,0.25)",
                    }}
                  />
                  <Bar
                    dataKey="positive"
                    name="Positive"
                    stackId="a"
                    fill={COLORS.positive}
                    radius={[0, 0, 4, 4]}
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
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
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
                data={chartWordFreq}
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
      {/* Aspect Bar Chart */}
      <div className="rounded-[1.75rem] border border-[#1A2E26]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 flex h-[400px] flex-col">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007A51]">
              Aspect mix
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-[#1A2E26]">
              Sentiment by aspect
            </h3>
          </div>
          <span className="rounded-full bg-[#F4F9F6] px-3 py-1 text-xs font-bold text-[#1A2E26]/55">
            {aspectBreakdown.length}{" "}
            {aspectBreakdown.length === 1 ? "aspect" : "aspects"}
          </span>
        </div>
        <div className="min-h-0 flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={aspectBreakdown}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
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
                type="category"
                dataKey="aspect"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#1a2e26" }}
                width={120}
              />
              <RechartsTooltip
                cursor={{ fill: "rgba(0,176,116,0.05)" }}
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
              <Bar
                dataKey="positive"
                name="Positive"
                stackId="a"
                fill={COLORS.positive}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="neutral"
                name="Neutral"
                stackId="a"
                fill={COLORS.neutral}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="negative"
                name="Negative"
                stackId="a"
                fill={COLORS.negative}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
