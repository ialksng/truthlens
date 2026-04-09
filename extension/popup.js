document.addEventListener("DOMContentLoaded", () => {

  let currentPageData = null;

  // 🔍 ANALYZE BUTTON
  document.getElementById("analyze-btn").addEventListener("click", async () => {
    console.log("Analyze clicked");

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

    const bookmarkData = {
      title: currentPageData?.title || document.title,
      description: document.getElementById("res-summary").innerText,
      link: currentPageData?.url || window.location.href,
      source_name: currentPageData?.source || window.location.hostname,
      image_url: ""
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
        alert("Failed to save article.");
      }
    } catch {
      alert("Server error.");
    }
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
        alert("Login successful! Click save again.");
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