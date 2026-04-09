# 🔍 TruthLens: AI-Powered News Intelligence

TruthLens is a full-stack MERN platform and browser extension designed to combat misinformation. It uses a multi-tiered AI pipeline to analyze news articles for bias, credibility, and sensationalism in real-time.

**🌐 Live Demo:** [www.ialksng.me/projects/truthlens](https://www.ialksng.me/projects/truthlens)  
**🧩 Extension Status:** Developer Mode (GitHub Distribution)

---

## 🚀 The "Growth Hack": Browser Extension
Most users don't go to a website to check the news—they are already on it. I built the **TruthLens Extension** to bring AI insights directly to the user's active tab.

![TruthLens Extension Demo](path-to-your-gif-or-image.gif)

### Key Extension Features:
- **Active Tab Scraping:** Extracts article metadata using Chrome's `scripting` API.
- **Instant Analysis:** Connects to the TruthLens MERN backend for real-time processing.
- **Distribution:** Designed for zero-friction user onboarding.

---

## 🧠 Technical Architecture & "Bulletproof" AI
The core of TruthLens is a resilient AI pipeline designed to handle API rate limits and failures gracefully.

1. **Caching Layer:** MongoDB stores previously analyzed articles to save on LLM costs.
2. **Primary AI:** Google Gemini 2.0 Flash for high-speed, structured JSON analysis.
3. **Failover (Fallback):** If Gemini fails, the system automatically swaps to **Llama 3 (via Groq)**.
4. **Local Fallback:** A final heuristic-based safety net ensures the UI never crashes.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, React Hot Toast
- **Backend:** Node.js, Express, MongoDB Atlas, JWT Auth
- **AI Intelligence:** Google Generative AI (Gemini), Groq SDK (Llama 3)
- **Extension:** Manifest V3, Chrome Scripting API

---

## 📥 Local Installation (Extension)
1. Download the `/extension` folder from this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the folder.
5. Open any news site and click the TruthLens icon!