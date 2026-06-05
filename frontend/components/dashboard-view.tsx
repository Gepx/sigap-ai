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
} from "recharts";
import { Calendar, Download, FileText, Mail, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  summaryData,
  channelData,
  sentimentTrendData,
  channelDistributionData,
  topThemesData,
  wordFrequencyData,
} from "@/lib/data";
import RecommendationSection from "@/components/recommendation-section";

const COLORS = {
  positive: "#10b981", // emerald-500
  neutral: "#fcd34d", // amber-300
  negative: "#f43f5e", // rose-500
};

export default function DashboardView({ fileName }: { fileName: string }) {
  // Map string icon names to Lucide components
  const getIcon = (name: string) => {
    switch (name) {
      case "Mail": return <Mail className="size-4" />;
      case "MessageCircle": return <MessageCircle className="size-4" />;
      case "Share2": return <Share2 className="size-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-svh bg-emerald-50/30">
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800 tracking-tight">
              Sentiment Analysis
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full bg-emerald-600 text-white text-sm font-medium">
              <FileText className="size-4" />
              {fileName}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <Calendar className="size-4 mr-2" />
              Time & Date
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="size-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800">{summaryData.totalFeedback}</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-emerald-100 px-3 py-1.5 rounded-lg text-center">
                <p className="text-xs text-emerald-700 font-medium mb-0.5">Positive</p>
                <p className="text-sm font-bold text-emerald-800">{summaryData.positive.percentage}%</p>
              </div>
              <div className="bg-amber-100 px-3 py-1.5 rounded-lg text-center">
                <p className="text-xs text-amber-700 font-medium mb-0.5">Neutral</p>
                <p className="text-sm font-bold text-amber-800">{summaryData.neutral.percentage}%</p>
              </div>
              <div className="bg-rose-100 px-3 py-1.5 rounded-lg text-center">
                <p className="text-xs text-rose-700 font-medium mb-0.5">Negative</p>
                <p className="text-sm font-bold text-rose-800">{summaryData.negative.percentage}%</p>
              </div>
            </div>
          </div>
          
          {channelData.map((channel, i) => (
            <div key={i} className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                {getIcon(channel.icon)}
                {channel.channel}
              </div>
              <p className="text-2xl font-bold text-gray-800">{channel.count}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sentiment Trend Overview (Line Chart) */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-6">Sentiment Trend Overview</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="positive" name="Positive" stroke={COLORS.positive} strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="neutral" name="Neutral" stroke={COLORS.neutral} strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="negative" name="Negative" stroke={COLORS.negative} strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Distribution by Channel (Donut Charts) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-blue-400 shadow-sm lg:row-span-2">
            <h3 className="text-base font-semibold text-gray-800 mb-6">Sentiment Distribution by Channel</h3>
            <div className="flex flex-col gap-8">
              {channelDistributionData.map((channel, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-1/3 text-center">
                    <p className="font-medium text-gray-700">{channel.channel}</p>
                    <p className="text-sm text-gray-500">{channel.data.reduce((acc, curr) => acc + curr.value, 0)} total</p>
                  </div>
                  <div className="w-2/3 h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channel.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {channel.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs text-gray-600">Positive</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div><span className="text-xs text-gray-600">Neutral</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-400"></div><span className="text-xs text-gray-600">Negative</span></div>
              </div>
            </div>
          </div>

          {/* Top Feedback Themes (Bar Chart) */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-6">Top Feedback Themes/Topics</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topThemesData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis dataKey="theme" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} width={100} />
                  <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {topThemesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment as keyof typeof COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Word Frequency by Sentiment (Stacked Bar Chart) */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-800 mb-6">Word Frequency by Sentiment</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wordFrequencyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="word" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="positive" name="Positive" stackId="a" fill={COLORS.positive} radius={[0, 0, 4, 4]} />
                  <Bar dataKey="neutral" name="Neutral" stackId="a" fill={COLORS.neutral} />
                  <Bar dataKey="negative" name="Negative" stackId="a" fill={COLORS.negative} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* AI Action Recommendations Section */}
        <RecommendationSection />
      </div>
    </div>
  );
}
