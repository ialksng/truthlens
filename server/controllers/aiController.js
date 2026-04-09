import { GoogleGenerativeAI } from "@google/generative-ai";
import ArticleAnalysis from "../models/ArticleAnalysis.js";

export const analyzeArticle = async (req, res) => {
  try {
    const { title, description, source, link } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Article title is required for analysis."
      });
    }

    // Create unique article key
    const articleKey = link || title.trim().toLowerCase();

    // 1. CHECK DATABASE CACHE FIRST
    const existingAnalysis = await ArticleAnalysis.findOne({ articleKey });

    if (existingAnalysis) {
      console.log("Returning cached AI analysis from MongoDB");

      return res.status(200).json({
        summary: existingAnalysis.summary,
        credibilityScore: existingAnalysis.credibilityScore,
        clickbaitLevel: existingAnalysis.clickbaitLevel,
        biasLevel: existingAnalysis.biasLevel,
        emotionalTone: existingAnalysis.emotionalTone,
        explanation: existingAnalysis.explanation,
        aiAvailable: existingAnalysis.aiAvailable,
        cached: true
      });
    }

    // 2. IF NOT FOUND, CALL GEMINI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const MODELS = [
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash"
    ];

    const prompt = `
Return ONLY a valid JSON object.

{
  "summary": "string",
  "credibilityScore": 0,
  "clickbaitLevel": "Low | Medium | High",
  "biasLevel": "Low | Medium | High",
  "emotionalTone": "Neutral | Sensationalist | Fear-mongering | Angry | Optimistic",
  "explanation": "string"
}

Analyze this news article:
Title: "${title}"
Description: "${description || "N/A"}"
Source: "${source || "Unknown"}"
`;

    let result;
    let lastError;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            maxOutputTokens: 500
          }
        });

        result = await model.generateContent(prompt);
        console.log(`Gemini success with model: ${modelName}`);
        break;
      } catch (err) {
        console.error(`Gemini failed with ${modelName}:`, err.message);
        lastError = err;
      }
    }

    if (!result) throw lastError;

    let responseText = result.response.text().trim();

    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let analysisData;

    try {
      analysisData = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON returned by AI");
      analysisData = JSON.parse(match[0]);
    }

    const safeResponse = {
      summary: analysisData.summary || "No summary available.",
      credibilityScore: Number(analysisData.credibilityScore) || 50,
      clickbaitLevel: ["Low", "Medium", "High"].includes(analysisData.clickbaitLevel)
        ? analysisData.clickbaitLevel
        : "Medium",
      biasLevel: ["Low", "Medium", "High"].includes(analysisData.biasLevel)
        ? analysisData.biasLevel
        : "Medium",
      emotionalTone: [
        "Neutral",
        "Sensationalist",
        "Fear-mongering",
        "Angry",
        "Optimistic"
      ].includes(analysisData.emotionalTone)
        ? analysisData.emotionalTone
        : "Neutral",
      explanation: analysisData.explanation || "No explanation provided.",
      aiAvailable: true,
      cached: false
    };

    // 3. SAVE TO MONGODB CACHE
    await ArticleAnalysis.create({
      articleKey,
      title,
      source: source || "Unknown",
      summary: safeResponse.summary,
      credibilityScore: safeResponse.credibilityScore,
      clickbaitLevel: safeResponse.clickbaitLevel,
      biasLevel: safeResponse.biasLevel,
      emotionalTone: safeResponse.emotionalTone,
      explanation: safeResponse.explanation,
      aiAvailable: safeResponse.aiAvailable
    });

    return res.status(200).json(safeResponse);
  } catch (error) {
    console.error("AI Analysis Error:", error);

    if (error.status === 429 || error.status === 404) {
      return res.status(200).json({
        summary: "AI analysis is temporarily unavailable due to API limits or model availability.",
        credibilityScore: 50,
        clickbaitLevel: "Medium",
        biasLevel: "Medium",
        emotionalTone: "Neutral",
        explanation:
          "TruthLens AI could not complete a full analysis right now. Please try again later.",
        aiAvailable: false,
        cached: false
      });
    }

    return res.status(500).json({
      message: "Failed to analyze article.",
      error: error.message
    });
  }
};