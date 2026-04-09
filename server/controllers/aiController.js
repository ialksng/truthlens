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

export const compareArticles = async (req, res) => {
  try {
    const { article1, article2 } = req.body;

    if (!article1 || !article2) {
      return res.status(400).json({ message: "Two articles are required for comparison." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert media analyst. Compare how these two different news sources are reporting on the same topic.
      
      ARTICLE 1:
      Source: "${article1.source}"
      Title: "${article1.title}"
      Snippet: "${article1.description || 'N/A'}"

      ARTICLE 2:
      Source: "${article2.source}"
      Title: "${article2.title}"
      Snippet: "${article2.description || 'N/A'}"

      Analyze the differences in their framing, bias, and tone. 
      Respond ONLY with a valid, raw JSON object matching exactly this structure (no markdown formatting, no \`\`\`json blocks):
      {
        "overallSummary": "A 2-sentence summary of the core event both articles are covering.",
        "factualDifferences": "Briefly state if one article includes facts or claims that the other omits.",
        "article1Analysis": {
          "bias": "<Left-Leaning | Right-Leaning | Centrist | Corporate | Sensationalist>",
          "tone": "1-2 words describing the tone",
          "focus": "What specific angle is this article prioritizing?"
        },
        "article2Analysis": {
          "bias": "<Left-Leaning | Right-Leaning | Centrist | Corporate | Sensationalist>",
          "tone": "1-2 words describing the tone",
          "focus": "What specific angle is this article prioritizing?"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    console.log("Raw Gemini Compare Response:", responseText);

    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const analysisData = JSON.parse(responseText);
      res.status(200).json(analysisData);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", responseText);
      return res.status(500).json({ 
        message: "AI returned an invalid format.",
        error: "JSON Parsing Error"
      });
    }

  } catch (error) {
    console.error("AI Compare Error:", error);
    res.status(500).json({ 
      message: "Failed to compare articles.",
      error: error.message 
    });
  }
};