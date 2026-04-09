const API_BASE = "https://truthlens-3r4q.onrender.com/api";

let currentAnalysis = null;
let currentArticleData = null;

// INIT (optional login)
chrome.storage.local.get(["token", "userName"], (result) => {
  if (result.token) {
    document.getElementById("logout-btn").classList.remove("hidden");
    document.getElementById("user-greeting").innerText = `Hello, ${result.userName}!`;
  }
});

// LOGIN
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      chrome.storage.local.set({
        token: data.token,
        userName: data.name
      });

      document.getElementById("auth-state").classList.add("hidden");
      document.getElementById("logout-btn").classList.remove("hidden");
      document.getElementById("user-greeting").innerText = `Hello, ${data.name}!`;
    } else {
      alert("Login failed");
    }
  } catch {
    alert("Server error");
  }
});

// LOGOUT
document.getElementById("logout-btn").addEventListener("click", () => {
  chrome.storage.local.clear();
  location.reload();
});

// ANALYZE
document.getElementById("analyze-btn").addEventListener("click", async () => {
  document.getElementById("analyze-state").classList.add("hidden");
  document.getElementById("loading-state").classList.remove("hidden");

  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.startsWith("http")) {
      throw new Error("Open a valid article.");
    }

    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, function: extractPageData },
      async (results) => {
        currentArticleData = results[0].result;

        try {
          const res = await fetch(`${API_BASE}/ai/extension-analyze`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(currentArticleData)
          });

          currentAnalysis = await res.json();

          showResults(currentAnalysis);
        } catch {
          showError("Analysis failed.");
        }
      }
    );
  } catch (err) {
    showError(err.message);
  }
});

// SHOW RESULTS
function showResults(data) {
  document.getElementById("loading-state").classList.add("hidden");
  document.getElementById("results-state").classList.remove("hidden");

  const scoreEl = document.getElementById("res-score");
  scoreEl.innerText = `${data.credibilityScore}/100`;

  scoreEl.classList.remove("score-high","score-med","score-low");

  if (data.credibilityScore >= 75) scoreEl.classList.add("score-high");
  else if (data.credibilityScore >= 50) scoreEl.classList.add("score-med");
  else scoreEl.classList.add("score-low");

  document.getElementById("res-bias").innerText = data.biasLevel || "--";
  document.getElementById("res-clickbait").innerText = data.clickbaitLevel || "--";
  document.getElementById("res-summary").innerText = data.summary || "--";
}

// SAVE (LOGIN REQUIRED)
document.getElementById("save-btn").addEventListener("click", async () => {
  const { token } = await chrome.storage.local.get("token");

  if (!token) {
    document.getElementById("auth-state").classList.remove("hidden");
    return;
  }

  const bookmarkData = {
    title: currentArticleData.title,
    description: currentArticleData.description,
    link: currentArticleData.url,
    source_name: currentArticleData.source,
    image_url: currentArticleData.image || ""
  };

  try {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookmarkData)
    });

    if (res.ok) {
      document.getElementById("save-status").classList.remove("hidden");
      document.getElementById("save-btn").classList.add("hidden");
    } else {
      alert("Save failed");
    }
  } catch {
    alert("Server error");
  }
});

// BACK
document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("results-state").classList.add("hidden");
  document.getElementById("analyze-state").classList.remove("hidden");
  document.getElementById("save-status").classList.add("hidden");
  document.getElementById("save-btn").classList.remove("hidden");
});

// ERROR
function showError(msg) {
  document.getElementById("loading-state").innerHTML =
    `<p style="color:#f87171;font-size:12px;">${msg}</p>`;
}

// CONTENT EXTRACTION
function extractPageData() {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || "",
    source: window.location.hostname,
    url: window.location.href,
    image: document.querySelector('meta[property="og:image"]')?.content || ""
  };
}