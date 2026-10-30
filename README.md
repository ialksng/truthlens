# 🔍 TruthLens — AI-Powered News Credibility Engine

TruthLens is a full-stack MERN application and browser extension engineered to combat online misinformation. It analyzes global news articles in real time to assess **credibility (0–100), political/editorial bias, clickbait level, and emotional tone** through a resilient, fail-safe multi-AI pipeline.

---

## 🔗 Quick Links

- 🌐 **Live Application:** [https://ialksng.me/work/projects/truthlens/app](https://ialksng.me/work/projects/truthlens/app)
- 👨‍💻 **Developer Portfolio:** [https://ialksng.me](https://ialksng.me)
- 🐙 **Source Code:** [https://github.com/ialksng/truthlens](https://github.com/ialksng/truthlens)

---

## 🚀 Key Features

### 1. 📰 Real-Time Global News Stream
- Live aggregation of breaking international headlines across technology, science, business, sports, and politics via the NewsData.io API.
- Intelligent fallback and caching to ensure unbroken UI availability during external API limits.

### 2. 🤖 Multi-Tiered AI Credibility & Bias Analysis
- **Credibility Index (0–100):** Evaluates factual consistency, sensationalism, and authoritativeness.
- **Bias & Tone Detection:** Classifies article framing (*Left-Leaning, Right-Leaning, Centrist, Sensationalist*) and emotional tone (*Neutral, Sensationalist, Fear-mongering, Angry, Optimistic*).
- **Clickbait Meter:** Flags manipulative headlines designed for viral engagement.
- **Detailed Executive Explanation:** Generates human-readable rationales behind every score.

### 3. ⚖️ Cross-Source News Comparison
- Side-by-side comparative analysis of how two different media outlets cover the exact same event.
- Exposes omitted facts, narrative spin, and framing divergences.

### 4. ✂️ AI Executive Summarization
- Condenses lengthy articles into concise, actionable intelligence briefs.

### 5. 🔐 User Library & Bookmarking
- Secure JWT-based user authentication (Sign Up / Login).
- Personal dashboard to bookmark, manage, and revisit analyzed news reports.

---

## 🧩 Browser Extension (Chrome Manifest V3)

TruthLens includes an active Chrome extension located in the [`/extension`](./extension) directory that allows users to verify articles directly on any news site without leaving their current tab.

### How It Works:
1. **Active Tab Scraping:** Uses the Chrome `scripting` API to extract article title, description, and source URL from the DOM.
2. **Instant Pipeline:** Sends extracted metadata to the TruthLens backend engine for rapid analysis.
3. **In-Popup HUD:** Renders credibility gauge, clickbait classification, bias tag, and bullet summaries directly in the popup.
4. **1-Click Bookmark:** Saves the current article directly to the authenticated user's library.

### How to Install & Use the Extension:
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** on (top-right corner).
3. Click **Load unpacked** (top-left).
4. Select the `extension` folder inside this repository:
   ```
   truthlens/extension
   ```
5. Pin the **TruthLens AI Fact Checker** icon to your Chrome toolbar.
6. Open any news article on the web (e.g. BBC, Reuters, TechCrunch) and click the TruthLens icon to analyze in real time!

---

## 🧠 Multi-LLM Resilient Architecture

TruthLens employs a layered fail-safe architecture to ensure 99.9% uptime and zero service disruptions:

```
[ Incoming Article ]
         │
         ▼
[ Layer 1: MongoDB Atlas Cache ] ──(Cache Hit)──► Return Cached Analysis (< 50ms)
         │ (Cache Miss)
         ▼
[ Layer 2: Google Gemini 2.0 Flash ] ──(Success)──► Save to DB & Return
         │ (Rate Limit / Failure)
         ▼
[ Layer 3: Groq Cloud (Llama 3.1) ] ──(Success)──► Save to DB & Return
         │ (Failure)
         ▼
[ Layer 4: Local Heuristic Engine ] ──────────────► Generate Rule-Based Analysis
```

1. **MongoDB Atlas Caching:** Previous analyses are hashed and stored to eliminate redundant LLM calls, saving costs and providing instant responses.
2. **Primary Engine (Google Gemini 2.0 Flash):** Low-latency, structured JSON generation with fine-tuned temperature.
3. **Automated Failover (Groq / Llama 3.1 8B):** Ultra-fast inference fallback triggered automatically on API errors or quota limits.
4. **Local Fallback:** Regular expression heuristics and rule-based linguistic evaluators keep the app functional even during complete provider outages.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS (v4), React Router 7, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js (ES Modules), Serverless Function Handlers |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **AI & APIs** | Google Generative AI (Gemini 2.0 Flash), Groq Cloud SDK (Llama 3.1), NewsData.io API |
| **Auth & Security** | JSON Web Tokens (JWT), bcryptjs password hashing, CORS |
| **Browser Extension**| Chrome Manifest V3, Chrome Scripting & Storage APIs |
| **Deployment** | Vercel (Single Full-Stack Serverless App), Cloudflare Pages reverse proxy |

---

## 💻 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or free MongoDB Atlas URI)
- Free API keys for:
  - [Google AI Studio](https://aistudio.google.com/) (Gemini)
  - [Groq Console](https://console.groq.com/) (Optional failover)
  - [NewsData.io](https://newsdata.io/) (Live news stream)

### 1. Clone the Repository
```bash
git clone https://github.com/ialksng/truthlens.git
cd truthlens
```

### 2. Install All Dependencies
Install dependencies across the root, client, and server:
```bash
npm run install-all
```

### 3. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Create a `.env` file inside the `client/` directory (optional for live news, fallback news included):
```env
VITE_NEWSDATA_API_KEY=your_newsdata_io_api_key
```

### 4. Start the Application
Run both the frontend and backend concurrently with one command:
```bash
npm run dev
```

- **Frontend:** `http://localhost:5173/work/projects/truthlens/app/`
- **Backend API:** `http://localhost:5000/api`

---

## ☁️ Deployment on Vercel

TruthLens is packaged to deploy as a unified full-stack application on Vercel:
1. Import this repository into Vercel.
2. In **Environment Variables**, set:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `VITE_NEWSDATA_API_KEY`
3. Deploy! Vercel will automatically build the client using `vercel.json` and deploy `api/index.js` as an edge-ready serverless function.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more details.

---

## 👨‍💻 Author

Created and maintained by **Alok Singh** ([ialksng](https://ialksng.me)).  
Connect on [ialksng.me](https://ialksng.me) or [GitHub](https://github.com/ialksng).
