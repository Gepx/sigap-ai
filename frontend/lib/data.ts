export const processingSteps = [
  {
    message: "Extracting review data from document...",
    detail: "Parsing CSV structure and identifying columns",
  },
  {
    message: "Cleaning and normalizing text structure",
    detail: "Removing noise, handling missing values, tokenizing",
  },
  {
    message: "Running sentiment classification model",
    detail: "Classifying positive, neutral, and negative sentiments",
  },
  {
    message: "Analyzing sentiment distribution by channel",
    detail: "Mapping feedback sources to sentiment scores",
  },
  {
    message: "Identifying top feedback themes and topics",
    detail: "Extracting key phrases and clustering related topics",
  },
  {
    message: "Calculating word frequency metrics",
    detail: "Building word clouds and frequency distributions",
  },
  {
    message: "Generating trend analysis over time",
    detail: "Aggregating daily sentiment patterns",
  },
  {
    message: "Finalizing your sentiment report...",
    detail: "Compiling visualizations and summary statistics",
  },
];

export const summaryData = {
  totalFeedback: 1247,
  positive: { count: 724, percentage: 58.1 },
  neutral: { count: 311, percentage: 24.9 },
  negative: { count: 212, percentage: 17.0 },
};

export const channelData = [
  { channel: "Email", count: 482, icon: "Mail" },
  { channel: "Chat", count: 389, icon: "MessageCircle" },
  { channel: "Social Media", count: 376, icon: "Share2" },
];

export const sentimentTrendData = [
  { day: "Mon", positive: 72, neutral: 35, negative: 18 },
  { day: "Tue", positive: 85, neutral: 28, negative: 22 },
  { day: "Wed", positive: 65, neutral: 42, negative: 30 },
  { day: "Thu", positive: 90, neutral: 30, negative: 15 },
  { day: "Fri", positive: 110, neutral: 38, negative: 20 },
  { day: "Sat", positive: 95, neutral: 45, negative: 25 },
  { day: "Sun", positive: 78, neutral: 32, negative: 12 },
];

export const channelDistributionData = [
  {
    channel: "Email",
    data: [
      { name: "Positive", value: 290, color: "#10b981" },
      { name: "Neutral", value: 112, color: "#f59e0b" },
      { name: "Negative", value: 80, color: "#f43f5e" },
    ],
  },
  {
    channel: "Chat",
    data: [
      { name: "Positive", value: 215, color: "#10b981" },
      { name: "Neutral", value: 104, color: "#f59e0b" },
      { name: "Negative", value: 70, color: "#f43f5e" },
    ],
  },
  {
    channel: "Social Media",
    data: [
      { name: "Positive", value: 219, color: "#10b981" },
      { name: "Neutral", value: 95, color: "#f59e0b" },
      { name: "Negative", value: 62, color: "#f43f5e" },
    ],
  },
];

export const topThemesData = [
  { theme: "Delivery Time", count: 413, sentiment: "negative" },
  { theme: "Product Quality", count: 356, sentiment: "positive" },
  { theme: "Customer Service", count: 298, sentiment: "positive" },
  { theme: "Pricing", count: 187, sentiment: "neutral" },
  { theme: "User Experience", count: 142, sentiment: "positive" },
];

export const wordFrequencyData = [
  {
    word: "excellent",
    positive: 89,
    neutral: 12,
    negative: 3,
  },
  {
    word: "slow",
    positive: 5,
    neutral: 18,
    negative: 76,
  },
  {
    word: "helpful",
    positive: 72,
    neutral: 24,
    negative: 8,
  },
  {
    word: "disappointing",
    positive: 2,
    neutral: 9,
    negative: 64,
  },
  {
    word: "recommend",
    positive: 68,
    neutral: 15,
    negative: 5,
  },
];

export const sentimentOverTimeData = [
  { date: "Week 1", positive: 245, neutral: 102, negative: 68 },
  { date: "Week 2", positive: 280, neutral: 95, negative: 55 },
  { date: "Week 3", positive: 198, neutral: 114, negative: 89 },
  { date: "Week 4", positive: 310, neutral: 88, negative: 42 },
];

export const recommendationProcessingSteps = [
  {
    message: "Analyzing negative feedback trends...",
    detail: "Identifying root causes across 'Delivery Time' and 'Pricing'.",
  },
  {
    message: "Cross-referencing themes with channels...",
    detail:
      "Correlating specific issues with Email and Social Media interactions.",
  },
  {
    message: "Formulating actionable recommendations...",
    detail: "Generating prioritized list of strategic initiatives.",
  },
];

export const recommendationData = [
  {
    id: 1,
    title: "Optimize West Coast Logistics",
    description:
      "413 negative reviews mentioned 'Delivery Time'. 78% of these originated from West Coast customers. Investigate delays with primary logistics partner in this region.",
    priority: "High",
    impact: "Could improve overall sentiment by up to 15%.",
  },
  {
    id: 2,
    title: "Create Chat Support Templates for 'Product Quality'",
    description:
      "While product quality has positive mentions, the 64 negative mentions of 'disappointing' heavily correlate with Chat support inquiries. Pre-written templates for troubleshooting can reduce resolution time.",
    priority: "Medium",
    impact: "Expected to reduce average handle time (AHT) by 2 minutes.",
  },
  {
    id: 3,
    title: "Proactive Communication on Pricing",
    description:
      "Pricing was the largest 'Neutral' topic. Consider publishing a transparent pricing breakdown or offering a comparison guide to convert neutral sentiment into positive brand trust.",
    priority: "Low",
    impact: "May increase customer trust and conversion rates by 5%.",
  },
];

export const performanceMetricsData = [
  { metric: "Quality", score: 85, benchmark: 70 },
  { metric: "Support", score: 62, benchmark: 75 },
  { metric: "Usability", score: 92, benchmark: 80 },
  { metric: "Pricing", score: 55, benchmark: 60 },
  { metric: "Reliability", score: 88, benchmark: 85 },
  { metric: "Features", score: 75, benchmark: 70 },
];
