// extension/popup.js

document.getElementById("analyze-btn").addEventListener("click", async () => {
  const initialState = document.getElementById("initial-state");
  const loadingState = document.getElementById("loading-state");
  const resultsState = document.getElementById("results-state");

  initialState.classList.add("hidden");
  loadingState.classList.remove("hidden");

  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 1. Check if we are on a valid webpage (not a chrome:// page)
    if (!tab.url.startsWith("http")) {
      throw new Error("Please open a news article first.");
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractPageData,
    }, async (results) => {
      
      if (!results || !results[0]?.result) {
        throw new Error("Could not read page content.");
      }

      const pageData = results[0].result;

      // 2. Call your LIVE Render API
      const response = await fetch("https://truthlens-3r4q.onrender.com/api/ai/extension-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData)
      });

      if (!response.ok) throw new Error("Server error. Is the API awake?");

      const data = await response.json();

      // 3. Update UI
      loadingState.classList.add("hidden");
      resultsState.classList.remove("hidden");

      document.getElementById("res-score").innerText = `${data.credibilityScore}/100`;
      document.getElementById("res-bias").innerText = data.biasLevel;
      document.getElementById("res-clickbait").innerText = data.clickbaitLevel;
      document.getElementById("res-summary").innerText = data.summary;
    });

  } catch (error) {
    loadingState.innerHTML = `<p style="color:#f87171; font-size:12px;">${error.message}</p>`;
  }
});

function extractPageData() {
  // Improved extraction: checks Meta tags, then Article tags, then Body
  const title = document.title || document.querySelector('h1')?.innerText;
  
  let description = document.querySelector('meta[name="description"]')?.content || 
                    document.querySelector('meta[property="og:description"]')?.content;
  
  if (!description || description.length < 100) {
    // Grab text from common article containers
    const selectors = ['article', '.article-body', '.story-content', 'main'];
    let container = null;
    for (const s of selectors) {
      if (document.querySelector(s)) { container = document.querySelector(s); break; }
    }
    
    const body = container || document.body;
    description = Array.from(body.querySelectorAll('p'))
      .map(p => p.innerText)
      .filter(t => t.length > 50)
      .join(' ')
      .substring(0, 1500);
  }

  return {
    title: title,
    description: description,
    source: window.location.hostname
  };
}