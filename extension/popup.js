document.addEventListener("DOMContentLoaded", () => {
  let currentPageData = null;

  // 🔍 ANALYZE BUTTON
  document.getElementById("analyze-btn").addEventListener("click", async () => {
    document.getElementById("initial-state").classList.add("hidden");
    document.getElementById("loading-state").classList.remove("hidden");

    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

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

            const data = await response.json();

            document.getElementById("loading-state").classList.add("hidden");
            document.getElementById("results-state").classList.remove("hidden");
            document.getElementById("save-btn").classList.remove("hidden");

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

  // 💾 SAVE BUTTON LOGIC
  document.getElementById("save-btn").addEventListener("click", async () => {
    const { token } = await chrome.storage.local.get("token");

    if (!token) {
      // Switch UI to Login Form
      document.getElementById("results-state").classList.add("hidden");
      document.getElementById("save-btn").classList.add("hidden");
      document.getElementById("auth-state").classList.remove("hidden");
      return;
    }

    performSave(token);
  });

  // 🔐 LOGIN BUTTON LOGIC
  document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("https://truthlens-3r4q.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        await chrome.storage.local.set({ token: data.token, userName: data.name });
        
        // Hide login, go back to results, and auto-save
        document.getElementById("auth-state").classList.add("hidden");
        document.getElementById("results-state").classList.remove("hidden");
        document.getElementById("save-btn").classList.remove("hidden");
        
        performSave(data.token);
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Server error during login.");
    }
  });

  // Function to handle the actual API call to save
  async function performSave(token) {
    const bookmarkData = {
      title: currentPageData?.title || document.title,
      description: document.getElementById("res-summary").innerText,
      url: currentPageData?.url || window.location.href,
      source: currentPageData?.source || window.location.hostname,
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
        document.getElementById("save-btn").classList.add("hidden");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save.");
      }
    } catch {
      alert("Network error while saving.");
    }
  }

  function showError(msg) {
    document.getElementById("loading-state").innerHTML = `<p style="color:#f87171;">${msg}</p>`;
  }
});

function extractPageData() {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || "",
    source: window.location.hostname,
    url: window.location.href
  };
}