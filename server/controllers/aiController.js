import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeArticle = async (req, res) => {
  try {
    const { title, description, source } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Article title is required for analysis." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert journalist and fact-checker. Analyze the following news article snippet.
      
      Title: "${title}"
      Snippet/Description: "${description || 'N/A'}"
      Source: "${source || 'Unknown'}"

      Evaluate it for credibility, clickbait, bias, and emotional tone based ONLY on the provided text and your knowledge of the source's general reputation.

      Respond ONLY with a valid, raw JSON object matching exactly this structure (no markdown formatting, no \`\`\`json blocks):
      {
        "summary": "A concise 2-sentence summary of what the article is claiming.",
        "credibilityScore": <number between 0-100>,
        "clickbaitLevel": "<Low | Medium | High>",
        "biasLevel": "<Low | Medium | High>",
        "emotionalTone": "<Neutral | Sensationalist | Fear-mongering | Angry | Optimistic>",
        "explanation": "A 2-3 sentence explanation justifying these scores based on the language used and the source."
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const analysisData = JSON.parse(responseText);

    res.status(200).json(analysisData);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ 
      message: "Failed to analyze article.",
      error: error.message 
    });
  }
};