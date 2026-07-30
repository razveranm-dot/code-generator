console.log("✅ script.js loaded");

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUVV_44MfJs4vbOzNqQPsIP99xx3P-T2B2VOuLGqQlGvZ8r-ukOJFyxYiKfRtHfflDZg/exec"; // paste your /exec URL here

async function generateCode(type) {
  // Get client code (default RSS if empty)
  let clientCode = document.getElementById("clientCode").value.trim();
  if (!clientCode) clientCode = "RSS";

  // Get name (optional)
  let name = document.getElementById("name").value.trim();

  try {
    // Send request to backend
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ type: type, clientCode: clientCode, name: name }),
      headers: { "Content-Type": "application/json" }
    });

    // Parse response
    const data = await response.json();

    // Show code on page
    document.getElementById("output").innerText = data.code || "❌ No code returned";
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").innerText = "❌ Failed to generate code";
  }
}
