import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeArticle = async (req, res) => {
  try {
    const { title, description, source } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Article title is required for analysis." });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Strict prompt to force JSON output
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

    // 1. Log the raw response to the backend terminal so we can see what Gemini is actually saying!
    console.log("Raw Gemini Response:", responseText);

    // 2. Aggressively clean the response of markdown blocks just in case Gemini disobeys instructions
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      // 3. Try to parse the cleaned text into a Javascript Object
      const analysisData = JSON.parse(responseText);
      res.status(200).json(analysisData);
      
    } catch (parseError) {
      // If it fails to parse, log it to the backend terminal
      console.error("Failed to parse Gemini JSON. Raw text was:", responseText);
      return res.status(500).json({ 
        message: "AI returned an invalid format. Please try again.",
        error: "JSON Parsing Error"
      });
    }

  } catch (error) {
    // This catches errors like Missing API Key, Network issues with Google, etc.
    console.error("AI Analysis Error:", error);
    res.status(500).json({ 
      message: "Failed to analyze article.",
      error: error.message 
    });
  }
};