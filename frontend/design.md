# Sigap.ai - Frontend Design & State Architecture

## 1. Color Palette Tokens

- Primary / Action Green: `#00B074` (Tailwind `emerald-500`)
- Light Neutral / Background: `#F4F9F6`
- Dark Neutral / Typography: `#1A2E26`
- Cards / Surfaces: `#FFFFFF`

## 2. Global Styling Rules

- Use Tailwind CSS for all styling.
- Ensure soft rounded corners (`rounded-2xl`) on major cards.
- Background of the main `/(content)/app` page must strictly be `#F4F9F6`.

## 3. Dashboard State Engine (/(content)/app)

The main application consists of 7 sequential UI states that must be respected:

1. Document Upload (Drag & Drop UI)
2. Approve Uploading Document (File badge + Confirm Button)
3. Model Thinking Animation (Skeleton loader + dynamic text from `processingSteps`)
4. Sentiment Analysis Dashboard (4 Metric cards, Recharts visualizations)
5. Recommendation Trigger (Button to initialize AI Strategy)
6. AI Strategy Thinking Animation (Loader from `recommendationProcessingSteps`)
7. AI Action Recommendations View (List rendered from `recommendationData`)
