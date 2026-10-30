import mongoose from "mongoose";

const articleAnalysisSchema = new mongoose.Schema(
  {
    articleKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    source: {
      type: String,
      default: "Unknown"
    },
    summary: {
      type: String,
      default: ""
    },
    credibilityScore: {
      type: Number,
      default: 50
    },
    clickbaitLevel: {
      type: String,
      default: "Medium"
    },
    biasLevel: {
      type: String,
      default: "Medium"
    },
    emotionalTone: {
      type: String,
      default: "Neutral"
    },
    explanation: {
      type: String,
      default: ""
    },
    aiAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("ArticleAnalysis", articleAnalysisSchema);