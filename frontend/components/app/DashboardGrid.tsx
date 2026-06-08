"use client"

import React from "react"
import { Download, Mail, MessageCircle, Share2, Sparkles, TrendingUp, BarChart3 } from "lucide-react"
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
  Legend
} from "recharts"

interface DashboardGridProps {
  summaryData: any;
  channelData: any[];
  sentimentTrendData: any[];
  topThemesData: any[];
  channelDistributionData: any[];
  startRecommendations: () => void;
}

export function DashboardGrid({
  summaryData,
  channelData,
  sentimentTrendData,
  topThemesData,
  channelDistributionData,
  startRecommendations
}: DashboardGridProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#00B074]/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#00B074]" />
            </div>
            <h1 className="text-3xl font-black text-[#1A2E26] tracking-tight">Sentiment Analysis</h1>
          </div>
          <div className="flex items-center gap-3 ml-[52px]">
            <span className="text-[#1A2E26]/40 text-sm font-medium">Source:</span>
            <span className="bg-white shadow-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1A2E26] border border-border/30 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00B074]" />
              telco-customer-churn.csv
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#00B074] text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-[#00B074]/20 hover:shadow-xl hover:shadow-[#00B074]/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-border/30 hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5">
          <p className="text-[#1A2E26]/40 text-xs font-bold tracking-[0.15em] uppercase mb-3">Total Feedback</p>
          <h2 className="text-5xl font-black text-[#1A2E26] mb-5 tracking-tight">{summaryData.totalFeedback}</h2>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="bg-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-full">{summaryData.positive.percentage}% Pos</span>
            <span className="bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1.5 rounded-full">{summaryData.neutral.percentage}% Neu</span>
            <span className="bg-[#f43f5e]/10 text-[#f43f5e] px-3 py-1.5 rounded-full">{summaryData.negative.percentage}% Neg</span>
          </div>
        </div>

        {channelData.map((channel, i) => {
          const icons = { Mail, MessageCircle, Share2 }
          const Icon = icons[channel.icon as keyof typeof icons] || MessageCircle
          return (
            <div key={i} className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-border/30 flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 group">
              <div className="flex justify-between items-start">
                <p className="text-[#1A2E26]/40 text-xs font-bold tracking-[0.15em] uppercase">{channel.channel} Vol.</p>
                <div className="bg-[#F4F9F6] p-3 rounded-2xl group-hover:bg-[#00B074]/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#00B074]" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-5">
                <h2 className="text-5xl font-black text-[#1A2E26] tracking-tight">{channel.count}</h2>
                <TrendingUp className="w-4 h-4 text-[#00B074] mb-3" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Core Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Sentiment Trend Overview */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-border/30 h-[400px] flex flex-col animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl text-[#1A2E26] tracking-tight">Sentiment Trend Overview</h3>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-[#10b981]" />Positive</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-[#f59e0b]" />Neutral</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-[#f43f5e]" />Negative</span>
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-5} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                    itemStyle={{ fontWeight: 700, fontSize: '13px' }}
                    labelStyle={{ fontWeight: 800, marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="negative" stroke="#f43f5e" strokeWidth={3} dot={false} activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Feedback Themes */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-border/30 flex flex-col animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-black text-xl text-[#1A2E26] mb-8 tracking-tight">Top Feedback Themes</h3>
            <div className="space-y-5">
              {topThemesData.map((theme, idx) => {
                const maxCount = Math.max(...topThemesData.map(t => t.count))
                const percentage = (theme.count / maxCount) * 100
                const colors: Record<string, string> = {
                  positive: "#10b981",
                  neutral: "#f59e0b",
                  negative: "#f43f5e"
                }
                const bgColors: Record<string, string> = {
                  positive: "bg-[#10b981]/10",
                  neutral: "bg-[#f59e0b]/10",
                  negative: "bg-[#f43f5e]/10"
                }
                const textColors: Record<string, string> = {
                  positive: "text-[#10b981]",
                  neutral: "text-[#f59e0b]",
                  negative: "text-[#f43f5e]"
                }
                return (
                  <div key={idx} className="group">
                    <div className="flex justify-between text-sm mb-2.5 items-center">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[#1A2E26]">{theme.theme}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bgColors[theme.sentiment]} ${textColors[theme.sentiment]}`}>
                          {theme.sentiment}
                        </span>
                      </div>
                      <span className="text-[#1A2E26]/50 font-bold tabular-nums">{theme.count}</span>
                    </div>
                    <div className="w-full bg-[#F4F9F6] rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[theme.sentiment],
                          animation: `progress-fill 1s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                          animationDelay: `${idx * 150}ms`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Panel - Donut Charts */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-border/30 flex flex-col animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h3 className="font-black text-xl text-[#1A2E26] mb-1 tracking-tight">Sentiment by Channel</h3>
          <p className="text-sm font-medium text-[#1A2E26]/40 mb-8">Distribution across communication methods</p>
          
          <div className="flex-1 flex flex-col gap-8 justify-between">
            {channelDistributionData.map((dist, idx) => (
              <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-[#F4F9F6] transition-colors duration-300 -mx-2">
                <div className="w-[120px] h-[120px] shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dist.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={52}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={6}
                      >
                        {dist.data.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-[#1A2E26]/60">
                      {dist.data.reduce((acc: number, d: any) => acc + d.value, 0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-[#1A2E26] mb-3 tracking-tight">{dist.channel}</p>
                  <div className="space-y-2">
                    {dist.data.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-[#1A2E26]/60">{item.name}</span>
                        </div>
                        <span className="font-bold text-[#1A2E26] tabular-nums">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* STATE 5 FOOTER TRIGGER */}
      <div className="mt-10 mb-16 flex justify-center w-full animate-fade-up" style={{ animationDelay: '400ms' }}>
        <button 
          onClick={startRecommendations}
          className="group relative bg-[#1A2E26] text-white px-12 py-6 rounded-full font-bold text-lg shadow-[0_16px_50px_rgba(26,46,38,0.35)] hover:shadow-[0_20px_60px_rgba(26,46,38,0.45)] transition-all duration-300 flex items-center gap-4 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] overflow-hidden"
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <Sparkles className="w-6 h-6 text-amber-300 group-hover:animate-pulse relative z-10" />
          <span className="relative z-10">Get AI Step Recommendation</span>
        </button>
      </div>

    </div>
  )
}
