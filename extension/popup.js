document.addEventListener("DOMContentLoaded", () => {

  let currentPageData = null;

  // 🚀 EXTRACTED SAVE LOGIC (With corrected schema fields for the server)
  async function saveArticle(token) {
    let titleToSave = currentPageData?.title;
    let urlToSave = currentPageData?.url;
    let sourceToSave = currentPageData?.source;

    // Fallback if the user clicks Save without successful page data extraction
    if (!titleToSave || !urlToSave) {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      titleToSave = tab.title;
      urlToSave = tab.url;
      try {
        sourceToSave = new URL(tab.url).hostname;
      } catch (e) {
        sourceToSave = "Unknown";
      }
    }

    const summaryText = document.getElementById("res-summary").innerText;

    // 🔴 MATCHING SERVER SCHEMA EXACTLY (url, source, urlToImage)
    const bookmarkData = {
      title: titleToSave,
      description: summaryText !== "--" ? summaryText : "",
      url: urlToSave,
      source: sourceToSave,
      urlToImage: "",
      publishedAt: new Date().toISOString()
    };

    try {
      const res = await fetch("https://truthlens-3r4q.onrender.com/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookmarkData)
      });

      if (res.ok) {
        document.getElementById("save-status").classList.remove("hidden");
        document.getElementById("save-btn").style.display = "none";
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to save article.");
      }
    } catch {
      alert("Server error.");
    }
  }

  // 🔍 ANALYZE BUTTON
  document.getElementById("analyze-btn").addEventListener("click", async () => {
    document.getElementById("initial-state").classList.add("hidden");
    document.getElementById("loading-state").classList.remove("hidden");

    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Prevent chrome:// errors
      if (!tab.url.startsWith("http")) {
        throw new Error("Open a valid article page.");
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: extractPageData,
        },
        async (results) => {

          if (!results || !results[0] || !results[0].result) {
            showError("Could not extract page content.");
            return;
          }

          currentPageData = results[0].result;

          try {
            const response = await fetch("https://truthlens-3r4q.onrender.com/api/ai/extension-analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(currentPageData)
            });

            if (!response.ok) {
              throw new Error("API error");
            }

            const data = await response.json();

            document.getElementById("loading-state").classList.add("hidden");
            // 👇 REVEALS THE RESULTS AND THE SAVE BUTTON AT THE SAME TIME
            document.getElementById("results-state").classList.remove("hidden");

            const scoreEl = document.getElementById("res-score");

            scoreEl.innerText = data.credibilityScore + "/100";
            scoreEl.className = "value";

            if (data.credibilityScore >= 70) scoreEl.classList.add("score-high");
            else if (data.credibilityScore >= 40) scoreEl.classList.add("score-med");
            else scoreEl.classList.add("score-low");

            document.getElementById("res-bias").innerText = data.biasLevel || "--";
            document.getElementById("res-clickbait").innerText = data.clickbaitLevel || "--";
            document.getElementById("res-summary").innerText = data.summary || "--";

          } catch (error) {
            showError("API failed. Try again.");
          }
        }
      );

    } catch (error) {
      showError(error.message);
    }
  });

  // 💾 SAVE BUTTON
  document.getElementById("save-btn").addEventListener("click", async () => {
    const { token } = await chrome.storage.local.get("token");

    // If not logged in → show login form
    if (!token) {
      document.getElementById("auth-state").classList.remove("hidden");
      return;
    }

    await saveArticle(token);
  });

  // 🔐 LOGIN BUTTON
  document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://truthlens-3r4q.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        chrome.storage.local.set({
          token: data.token,
          userName: data.name
        });

        document.getElementById("auth-state").classList.add("hidden");
        
        // 🚀 AUTOMATICALLY SAVE THE ARTICLE AFTER LOGIN
        await saveArticle(data.token);
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Server error");
    }
  });

  // ❌ ERROR HANDLER
  function showError(msg) {
    document.getElementById("loading-state").innerHTML =
      `<p style="color:#f87171; font-size:12px;">${msg}</p>`;
  }

});

// 🧠 RUNS INSIDE WEBPAGE
function extractPageData() {
  let description =
    document.querySelector('meta[name="description"]')?.content ||
    document.querySelector('meta[property="og:description"]')?.content;

  if (!description || description.length < 100) {
    const paragraphs = Array.from(document.querySelectorAll("p"))
      .map(p => p.innerText)
      .filter(t => t.length > 50);

    description = paragraphs.join(" ").substring(0, 1500);
  }

  return {
    title: document.title,
    description,
    source: window.location.hostname,
    url: window.location.href
  };
}