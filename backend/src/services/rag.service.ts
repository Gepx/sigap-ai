import { GoogleGenAI } from "@google/genai";
import type { EarlyWarning } from "../types/ai.type.js";
import { mockSOPs, type SOPDocument } from "../utils/mockData.js";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const retrieveContext = (topic: string): SOPDocument[] => {
  const topicLower = topic.toLowerCase();
  return mockSOPs.filter(
    (sop) =>
      sop.tags.some((tag) => topicLower.includes(tag)) ||
      sop.title.toLowerCase().includes(topicLower),
  );
};

// Extract Aspects using Gemini
export const extractAspectsWithGemini = async (
  reviews: string[],
): Promise<string[]> => {
  if (reviews.length === 0) return [];
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Falling back to Lainnya.");
    return Array(reviews.length).fill("Lainnya");
  }

  const chunkSize = 500;
  const chunkPromises: Promise<string[]>[] = [];

  for (let i = 0; i < reviews.length; i += chunkSize) {
    const chunk = reviews.slice(i, i + chunkSize);
    const prompt = `
Categorize each of the following reviews into EXACTLY ONE of these categories: 
"Rasa & Kualitas", "Pelayanan", "Fasilitas & Suasana", "Harga & Nilai", or "Lainnya".
Reviews:
${JSON.stringify(chunk)}
    `;

    const chunkPromise = (async () => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              description:
                "Array of exactly " + chunk.length + " aspect categories.",
              items: {
                type: "STRING",
              },
            },
          },
        });
        let text = response.text || "[]";
        text = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const parsed = JSON.parse(text);
        
        if (Array.isArray(parsed) && parsed.length === chunk.length) {
          return parsed;
        } else if (Array.isArray(parsed)) {
          return Array.from(
            { length: chunk.length },
            (_, idx) => parsed[idx] || "Lainnya",
          );
        } else {
          return Array(chunk.length).fill("Lainnya");
        }
      } catch (e) {
        console.error("Gemini aspect extraction failed for chunk", e);
        return Array(chunk.length).fill("Lainnya");
      }
    })();

    chunkPromises.push(chunkPromise);
  }

  const chunkResults = await Promise.all(chunkPromises);
  return chunkResults.flat();
};

// Generate Recommendation
export const generateRecommendation = async (
  warning: EarlyWarning,
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  // 1. Retrieve Context
  const relevantSOPs = retrieveContext(warning.topic);

  let contextText =
    "No standard operating procedures found for this topic. Please rely entirely on the warning details and your general crisis management knowledge.";
  if (relevantSOPs.length > 0) {
    contextText = relevantSOPs
      .map((sop) => `Document Title: ${sop.title}\nContent: ${sop.content}`)
      .join("\n\n");
  }

  // 2. Construct Prompt
  const prompt = `
You are an expert crisis management and business strategy AI assistant.
An Early Warning has been triggered due to negative sentiment or customer feedback.

WARNING DETAILS:
- Topic/Category: ${warning.topic}
- Region: ${warning.region}
- Severity: ${warning.severity}
- Negative Sentiment Score: ${warning.triggerData.negative}%
- Sample Customer Comments:
${warning.triggerData.sampleComments.map((c) => `  - "${c}"`).join("\n")}

CONTEXT DOCUMENTS:
${contextText}

TASK:
Analyze the warning details, sample comments, and context documents (if any) to provide a strategic recommendation.

Output EXACTLY AND ONLY a JSON array containing 1 to 3 recommendation objects. Do NOT include markdown code blocks (\`\`\`json) or any conversational text.

Each object MUST have:
- "id": A unique string ID (e.g., "rec-1")
- "title": A short, actionable title
- "priority": "High", "Medium", or "Low"
- "description": A detailed explanation of the steps to take
- "impact": The expected positive result of this action

Ensure the language of your response matches the language of the sample comments (e.g. use Indonesian if the comments are in Indonesian).
Ensure your recommendations are highly specific to the Topic/Category (${warning.topic}) and the actual problems mentioned in the Sample Customer Comments. DO NOT generate generic public utility or water shortage recommendations unless the topic is explicitly about water utilities.
`;

  // 3. Generate (Generation)
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          description: "Array of 1 to 3 recommendation objects.",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              title: { type: "STRING" },
              priority: { type: "STRING", enum: ["High", "Medium", "Low"] },
              description: { type: "STRING" },
              impact: { type: "STRING" },
            },
            required: ["id", "title", "priority", "description", "impact"],
          },
        },
      },
    });

    return response.text || "[]";
  } catch (error) {
    console.error("Error generating RAG recommendation:", error);
    // Return a valid fallback JSON instead of throwing 500 so frontend can handle it
    return JSON.stringify([
      {
        id: "fallback-1",
        title: "Rate Limit Exceeded",
        priority: "Medium",
        description:
          "AI service is currently busy or rate-limited. Please try again in a minute.",
        impact:
          "We will be able to provide specific recommendations once the service is available.",
      },
    ]);
  }
};

// Generate Recommendation from Dashboard Data (no early warning)
export const generateRecommendationFromDashboard = async (
  dashboardData: any,
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const summary = dashboardData?.summary || {};
  const aspects = dashboardData?.aspect_breakdown || [];
  const channels = dashboardData?.channel_breakdown || [];
  const earlyWarnings = dashboardData?.early_warning || [];

  const topNegativeAspects = [...aspects]
    .sort((a: any, b: any) => (b.negative || 0) - (a.negative || 0))
    .slice(0, 5)
    .map(
      (a: any) =>
        `${a.aspect}: ${a.negative} negative, ${a.positive} positive, ${a.neutral} neutral`,
    )
    .join("\n  ");

  // Build channel info
  const channelInfo = channels
    .map(
      (c: any) =>
        `${c.channel}: ${(c.positive || 0) + (c.negative || 0) + (c.neutral || 0)} reviews`,
    )
    .join(", ");

  const sampleComments = earlyWarnings
    .slice(0, 5)
    .map((w: any) => w.text)
    .join("\n  - ");

  const prompt = `
You are an expert business strategy AI assistant specializing in customer review analysis.
You have been given a Sentiment Analysis Dashboard with real customer review data.

DASHBOARD SUMMARY:
- Total reviews analyzed: ${summary.total_reviews || 0}
- Positive: ${summary.sentiment_distribution?.positive || 0}
- Neutral: ${summary.sentiment_distribution?.neutral || 0}
- Negative: ${summary.sentiment_distribution?.negative || 0}
- Average AI Confidence: ${(summary.average_confidence || 0).toFixed(2)}
- Crisis-level reviews detected: ${summary.crisis_count || 0}

TOP ASPECTS BY NEGATIVE SENTIMENT:
  ${topNegativeAspects || "No aspect data available"}

REVIEW SOURCES:
  ${channelInfo || "Unknown"}

${sampleComments ? `SAMPLE NEGATIVE COMMENTS:\n  - ${sampleComments}` : "No sample comments available."}

TASK:
Analyze the dashboard data above and provide strategic, actionable business recommendations.
Your recommendations MUST be specific to the actual data shown above (the aspects, the types of complaints, the business context).
DO NOT generate recommendations about topics not present in the data (e.g., do NOT mention water shortages, public utilities, etc., unless the data is explicitly about that).

Output EXACTLY AND ONLY a JSON array containing 1 to 3 recommendation objects.

Each object MUST have:
- "id": A unique string ID (e.g., "rec-1")
- "title": A short, actionable title
- "priority": "High", "Medium", or "Low"
- "description": A detailed explanation of the steps to take
- "impact": The expected positive result of this action

Ensure the language of your response matches the language of the review data. If the reviews are in Indonesian, respond in Indonesian.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          description: "Array of 1 to 3 recommendation objects.",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              title: { type: "STRING" },
              priority: { type: "STRING", enum: ["High", "Medium", "Low"] },
              description: { type: "STRING" },
              impact: { type: "STRING" },
            },
            required: ["id", "title", "priority", "description", "impact"],
          },
        },
      },
    });

    return response.text || "[]";
  } catch (error) {
    console.error("Error generating dashboard recommendation:", error);
    return JSON.stringify([
      {
        id: "fallback-1",
        title: "Rate Limit Exceeded",
        priority: "Medium",
        description:
          "AI service is currently busy or rate-limited. Please try again in a minute.",
        impact:
          "We will be able to provide specific recommendations once the service is available.",
      },
    ]);
  }
};

// Generate Draft
export const generateDraft = async (
  recommendation: any,
  warningContext?: any,
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const prompt = `
You are an expert PR and crisis management assistant.
Based on the following AI recommendation:
Title: ${recommendation.title}
Description: ${recommendation.description}

And the following crisis context:
${warningContext ? JSON.stringify(warningContext, null, 2) : "None provided"}

TASK:
Draft a professional, ready-to-use public statement, press release, or customer email that executes this recommendation perfectly.
Output ONLY the draft text. Do not include conversational filler like "Here is the draft...".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Failed to generate draft.";
  } catch (error) {
    console.error("Error generating draft:", error);
    throw new Error("Failed to generate AI draft.");
  }
};

// Generate Chat Reply
export const generateChatReply = async (
  message: string,
  history: any[] = [],
  warningContext?: any,
  dashboardData?: any,
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  // Build context from dashboard data if available
  let dataContext = "";
  if (dashboardData) {
    const summary = dashboardData.summary || {};
    const aspects = dashboardData.aspect_breakdown || [];
    const channels = dashboardData.channel_breakdown || [];

    const aspectInfo = aspects
      .map(
        (a: any) =>
          `${a.aspect}: Positive=${a.positive}, Neutral=${a.neutral}, Negative=${a.negative}`,
      )
      .join("\n  ");

    const channelInfo = channels
      .map(
        (c: any) =>
          `${c.channel}: Positive=${c.positive}, Neutral=${c.neutral}, Negative=${c.negative}`,
      )
      .join("\n  ");

    dataContext = `
DASHBOARD DATA CONTEXT:
- Total reviews: ${summary.total_reviews || 0}
- Sentiment Distribution: Positive=${summary.sentiment_distribution?.positive || 0}, Neutral=${summary.sentiment_distribution?.neutral || 0}, Negative=${summary.sentiment_distribution?.negative || 0}
- Crisis-level reviews: ${summary.crisis_count || 0}
- Average Confidence: ${(summary.average_confidence || 0).toFixed(2)}

ASPECTS:
  ${aspectInfo || "No aspect data"}

REVIEW SOURCES (Platforms):
  ${channelInfo || "No channel data"}
`;

    if (
      dashboardData.sample_reviews &&
      dashboardData.sample_reviews.length > 0
    ) {
      const samplesText = dashboardData.sample_reviews
        .map(
          (r: any, i: number) =>
            `[${i + 1}] Sentiment: ${r.sentiment}, Aspect: ${r.aspect}\n    Text: "${r.text}"`,
        )
        .join("\n\n  ");

      dataContext += `\nSAMPLE REVIEWS (for context):\n  ${samplesText}\n`;
    }
  }

  if (warningContext) {
    dataContext += `\nEARLY WARNING CONTEXT:\n${JSON.stringify(warningContext, null, 2)}`;
  }

  const systemPrompt = `You are a helpful Data Analyst AI assistant called Sigap Analyst. 
You have access to the following customer review analysis data. Use it to answer the user's questions accurately.
${dataContext || "No specific data context provided."}

IMPORTANT RULES:
- ONLY answer based on the data context above. Do NOT make up information about topics not present in the data.
- If the data is about food/restaurant reviews, answer about food/restaurant topics.
- If there is no relevant data to answer the question, say so honestly.
- Answer concisely and professionally.
- Match the language of the user's question (e.g., respond in Indonesian if asked in Indonesian).`;

  const contents: any[] = [
    { role: "user", parts: [{ text: systemPrompt }] },
    {
      role: "model",
      parts: [
        {
          text: "Understood. I will act as the data analyst and only answer based on the provided dashboard data context.",
        },
      ],
    },
  ];

  for (const h of history) {
    contents.push({ role: h.role, parts: h.parts || [{ text: h.text || "" }] });
  }
  contents.push({ role: "user", parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    return response.text || "Failed to generate reply.";
  } catch (error) {
    console.error("Error generating chat reply:", error);
    throw new Error("Failed to generate chat reply.");
  }
};
