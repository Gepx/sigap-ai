import { GoogleGenAI } from "@google/genai";
import type { EarlyWarning } from "../types/ai.type.js";
import { mockSOPs, type SOPDocument } from "../utils/mockData.js";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Private function for retrieval
const retrieveContext = (topic: string): SOPDocument[] => {
  const topicLower = topic.toLowerCase();
  return mockSOPs.filter(
    (sop) =>
      sop.tags.some((tag) => topicLower.includes(tag)) ||
      sop.title.toLowerCase().includes(topicLower),
  );
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

  // Fallback if no specific SOP is found
  if (relevantSOPs.length === 0) {
    const generalSOP = mockSOPs.find((s) => s.id === "sop-103");
    if (generalSOP) relevantSOPs.push(generalSOP);
  }

  const contextText = relevantSOPs
    .map((sop) => `Document Title: ${sop.title}\nContent: ${sop.content}`)
    .join("\n\n");

  // 2. Construct Prompt
  const prompt = `
You are an expert crisis management AI assistant for a local government or organization.
An Early Warning has been triggered due to negative public sentiment.

WARNING DETAILS:
- Topic: ${warning.topic}
- Region: ${warning.region}
- Severity: ${warning.severity}
- Negative Sentiment Score: ${warning.triggerData.negative}%
- Sample Public Comments:
${warning.triggerData.sampleComments.map((c) => `  * "${c}"`).join("\n")}

STANDARD OPERATING PROCEDURES (CONTEXT):
${contextText}

TASK:
Based on the warning details and the provided Standard Operating Procedures context, provide 1-3 actionable recommendations on how the organization should respond to this situation.
You must output ONLY valid JSON. The JSON must be an array of objects matching this exact schema:
[
  {
    "id": "unique-id-string",
    "title": "Short title of the recommendation",
    "priority": "High" | "Medium" | "Low",
    "description": "Detailed explanation of the action to take.",
    "impact": "Expected outcome (e.g. 'Mitigates public anger in 24h')"
  }
]
Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Just output the raw JSON array.
`;

  // 3. Generate (Generation)
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "No recommendation could be generated.";
  } catch (error) {
    console.error("Error generating RAG recommendation:", error);
    throw new Error("Failed to generate AI recommendation.");
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
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const systemPrompt = `You are a helpful Data Analyst & Crisis Management AI. 
Use the following context to answer the user's questions:
${warningContext ? JSON.stringify(warningContext, null, 2) : "No specific data context provided."}
Answer concisely and professionally.`;

  // Construct contents array matching Gemini SDK
  const contents: any[] = [
    { role: "user", parts: [{ text: systemPrompt }] },
    {
      role: "model",
      parts: [
        {
          text: "Understood. I will act as the data analyst and use the provided context.",
        },
      ],
    },
  ];

  // Map incoming history
  for (const h of history) {
    contents.push({ role: h.role, parts: h.parts || [{ text: h.text || "" }] });
  }

  // Add the latest user message
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
