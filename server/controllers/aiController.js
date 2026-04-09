import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeArticle = async (req, res) => {
  try {
    const { title, description, source } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Article title is required for analysis."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        responseMimeType: "application/json",
        maxOutputTokens: 500
      }
    });

    const prompt = `
Return ONLY a valid JSON object.
Do NOT include markdown, code blocks, explanations, or extra text.

Required JSON format:
{
  "summary": "string",
  "credibilityScore": 0,
  "clickbaitLevel": "Low | Medium | High",
  "biasLevel": "Low | Medium | High",
  "emotionalTone": "Neutral | Sensationalist | Fear-mongering | Angry | Optimistic",
  "explanation": "string"
}

Task:
Analyze the following news article snippet for credibility, clickbait, bias, and emotional tone.
Base your judgment ONLY on:
1. the provided title/description
2. general reputation of the source if known

Article:
Title: "${title}"
Description: "${description || "N/A"}"
Source: "${source || "Unknown"}"
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    console.log("Raw Gemini Response:", responseText);

    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let analysisData;

    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Initial JSON parse failed:", responseText);

      const match = responseText.match(/\{[\s\S]*\}/);
      if (!match) {
        return res.status(500).json({
          message: "AI returned invalid JSON format.",
          error: "JSON Parsing Error"
        });
      }

      try {
        analysisData = JSON.parse(match[0]);
      } catch (fallbackError) {
        console.error("Fallback JSON parse also failed:", match[0]);
        return res.status(500).json({
          message: "AI returned malformed JSON.",
          error: "JSON Parsing Error"
        });
      }
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
      explanation: analysisData.explanation || "No explanation provided."
    };

    return res.status(200).json(safeResponse);

  } catch (error) {
    console.error("AI Analysis Error:", error);

    return res.status(500).json({
      message: "Failed to analyze article.",
      error: error.message
    });
  }
};