import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import ArticleAnalysis from "../models/ArticleAnalysis.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeArticle = async (req, res) => {
  try {
    const { title, description, source, link } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Article title is required",
      });
    }

    const articleKey = link || title.trim().toLowerCase();

    // ✅ 1. CHECK DB CACHE
    const existing = await ArticleAnalysis.findOne({ articleKey });
    if (existing) {
      console.log("Using cached result");
      return res.status(200).json({ ...existing.toObject(), cached: true });
    }

    let analysisData = null;

    // 🔥 2. TRY GEMINI FIRST
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const prompt = `
Return ONLY JSON:
{
  "summary": "string",
  "credibilityScore": 0,
  "clickbaitLevel": "Low | Medium | High",
  "biasLevel": "Low | Medium | High",
  "emotionalTone": "Neutral | Sensationalist | Fear-mongering | Angry | Optimistic",
  "explanation": "string"
}

Title: ${title}
Description: ${description || "N/A"}
Source: ${source || "Unknown"}
`;

      const result = await model.generateContent(prompt);
      let text = result.response.text();

      text = text.replace(/```/g, "").trim();

      analysisData = JSON.parse(text);

      console.log("✅ Gemini success");
    } catch (err) {
      console.log("❌ Gemini failed → trying Groq");
    }

    // 🔥 3. FALLBACK TO GROQ
    if (!analysisData) {
      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: "Return only JSON output.",
            },
            {
              role: "user",
              content: `
Return JSON:
{
  "summary": "string",
  "credibilityScore": 0,
  "clickbaitLevel": "Low | Medium | High",
  "biasLevel": "Low | Medium | High",
  "emotionalTone": "Neutral | Sensationalist | Fear-mongering | Angry | Optimistic",
  "explanation": "string"
}

Title: ${title}
Description: ${description || "N/A"}
Source: ${source || "Unknown"}
`,
            },
          ],
        });

        let text = completion.choices[0]?.message?.content || "";
        text = text.replace(/```/g, "").trim();

        analysisData = JSON.parse(text);

        console.log("✅ Groq success");
      } catch (err) {
        console.log("❌ Groq also failed → using fallback");
      }
    }

    // 🔥 4. LOCAL FALLBACK (ALWAYS WORKS)
    if (!analysisData) {
      const lowerTitle = title.toLowerCase();

      let clickbaitLevel = "Low";
      if (
        lowerTitle.includes("shocking") ||
        lowerTitle.includes("breaking")
      ) {
        clickbaitLevel = "High";
      }

      analysisData = {
        summary:
          description?.slice(0, 200) ||
          "Basic summary unavailable from AI.",
        credibilityScore: 60,
        clickbaitLevel,
        biasLevel: "Medium",
        emotionalTone: "Neutral",
        explanation:
          "Fallback analysis generated locally because AI providers were unavailable.",
      };
    }

    const safeResponse = {
      summary: analysisData.summary || "No summary",
      credibilityScore: Number(analysisData.credibilityScore) || 50,
      clickbaitLevel: analysisData.clickbaitLevel || "Medium",
      biasLevel: analysisData.biasLevel || "Medium",
      emotionalTone: analysisData.emotionalTone || "Neutral",
      explanation: analysisData.explanation || "",
      aiAvailable: true,
      cached: false,
    };

    // ✅ SAVE TO DB
    await ArticleAnalysis.create({
      articleKey,
      title,
      source,
      ...safeResponse,
    });

    return res.status(200).json(safeResponse);
  } catch (error) {
    console.error("FINAL ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};