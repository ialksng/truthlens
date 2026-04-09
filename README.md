# 🔍 TruthLens — AI-Powered News Credibility Engine

TruthLens is a full-stack **MERN application + Chrome extension** built to combat misinformation. It analyzes news articles in real time to detect **credibility, bias, emotional tone, and sensationalism** using a resilient multi-AI pipeline.

---

## 🌐 Live Demo  
👉 https://ialksng.me/projects/truthlens  

## 🧩 Chrome Extension  
Available in the `/extension` folder (load via Developer Mode)

---

## 🚀 Features

- 📰 **Live News Feed**  
  Aggregates real-time global news using NewsData.io API  

- 🤖 **AI Credibility Analysis**  
  - Generates credibility score (0–100)  
  - Detects bias, emotional tone, and clickbait  

- ⚖️ **Cross-Source Comparison**  
  Compare how different outlets report the same topic  

- ✂️ **AI Summarization**  
  Converts long articles into concise summaries  

- 🔐 **User Library**  
  - JWT authentication  
  - Bookmark & manage saved articles  

- 🌐 **Browser Extension**  
  - Chrome Manifest V3  
  - Analyze any article directly from the active tab  

---

## 🧠 Architecture (Resilient AI System)

TruthLens uses a **multi-layer fail-safe pipeline**:

### 1. Caching Layer
- MongoDB stores analyzed articles  
- Reduces API usage & improves speed  

### 2. Primary AI
- Powered by Google Gemini (Gemini 2.0 Flash)  
- Fast structured JSON output  

### 3. Failover System
- Switches to Groq (Llama 3)  
- Ensures reliability under API limits  

### 4. Local Heuristics
- Regex-based fallback system  
- Keeps UI functional during outages  

---

## 🛠️ Tech Stack

### Frontend
- React 19  
- Vite  
- Tailwind CSS  
- React Router 7  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB Atlas (Mongoose)

### AI & APIs
- Google Generative AI (Gemini)  
- Groq (Llama 3)  
- NewsData.io API  

### Extension
- Chrome Manifest V3  
- Chrome Scripting API  

### Deployment
- Render  

---

## 📥 Installation

### 1. Clone Repository
```bash
git clone https://github.com/ialksng/truthlens.git
cd truthlens
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Environment Variables

Create a `.env` file in `/server`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_ai_key
GROQ_API_KEY=your_groq_key
VITE_NEWSDATA_API_KEY=your_newsdata_key
```

### 4. Run Project
```bash
npm run dev
```

---

## 🧩 Chrome Extension Setup

1. Go to `chrome://extensions/`  
2. Enable **Developer Mode**  
3. Click **Load Unpacked**  
4. Select the `/extension` folder  

---

## 📌 Future Enhancements

- 🌍 Multi-language misinformation detection  
- 📊 Bias visualization dashboards  
- 🔎 Source reliability scoring system  
- 🧾 Claim → evidence fact-check mapping  
- 🧠 Fine-tuned custom ML model  

---

## ⭐ Why This Project Matters

- Solves a real-world problem: **fake news detection**  
- Uses **multi-LLM architecture with failover**  
- Combines:
  - Full-stack development  
  - AI integration  
  - Browser extension  

---

## ⚡ Highlight

> Built with a resilient multi-LLM architecture (Gemini + Llama fallback) to maintain functionality even under API failures.

---

## 👨‍💻 Author

**ialksng**