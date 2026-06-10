export interface SentimentData {
  id: string;
  topic: string;
  region: string;
  positive: number;
  negative: number;
  neutral: number;
  date: string;
  sampleComments: string[];
}

export const mockSentiments: SentimentData[] = [
  {
    id: "sent-001",
    topic: "Water Shortage",
    region: "North District",
    positive: 10,
    negative: 75,
    neutral: 15,
    date: new Date().toISOString(),
    sampleComments: [
      "No water for 2 days now, this is unacceptable!",
      "When will the pipes be fixed?",
      "Terrible management of the water crisis."
    ]
  },
  {
    id: "sent-002",
    topic: "New Public Park Opening",
    region: "East District",
    positive: 80,
    negative: 5,
    neutral: 15,
    date: new Date().toISOString(),
    sampleComments: [
      "The new park looks amazing!",
      "Great place to take the kids.",
      "Beautiful scenery."
    ]
  },
  {
    id: "sent-003",
    topic: "Traffic Congestion",
    region: "Central Hub",
    positive: 5,
    negative: 65,
    neutral: 30,
    date: new Date().toISOString(),
    sampleComments: [
      "Stuck in traffic for 2 hours again.",
      "The new traffic light system is making it worse.",
      "Need better public transport."
    ]
  }
];

export interface SOPDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export const mockSOPs: SOPDocument[] = [
  {
    id: "sop-101",
    title: "Crisis Management: Utility Outages (Water/Electricity)",
    content: "1. Acknowledge the issue publicly within 1 hour. 2. Provide a timeline for resolution. 3. Dispatch emergency utility crews to the affected region. 4. Setup temporary distribution centers if outage exceeds 12 hours. 5. Issue daily press releases updating the public.",
    tags: ["water", "electricity", "outage", "utility"]
  },
  {
    id: "sop-102",
    title: "Traffic and Infrastructure Management",
    content: "1. Monitor traffic cameras and update smart routing systems. 2. Deploy traffic officers to severely congested intersections. 3. Issue public advisories via social media to use alternate routes. 4. Review long-term infrastructure plans for the affected hub.",
    tags: ["traffic", "congestion", "transport"]
  },
  {
    id: "sop-103",
    title: "Public Relations: General Negative Sentiment",
    content: "1. Identify the core grievance. 2. Draft a holding statement showing empathy. 3. Schedule a town hall or press briefing if sentiment is consistently negative for >48 hours. 4. Avoid defensive language in official communications.",
    tags: ["pr", "sentiment", "complaint"]
  }
];
