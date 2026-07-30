console.log("✅ script.js loaded");

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6WF7wMjvjiWjLU9hjs99dCdGAL4eAK7IL1IOkMl46w7wxeNUFU64MJpCeIvtTVZbz/exec"; // paste your /exec URL here

async function generateCode(type) {
  let clientCode = document.getElementById("clientCode").value.trim();
  if (!clientCode) clientCode = "RSS";

  let name = document.getElementById("name").value.trim();

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ type: type, clientCode: clientCode, name: name }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    document.getElementById("output").innerText = data.code || JSON.stringify(data);

    loadHistory(); // refresh table
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").innerText = "❌ Failed to generate code";
  }
}

async function loadHistory() {
  try {
    const type = document.getElementById("filterType").value;
    const client = document.getElementById("filterClient").value.trim();

    let url = WEB_APP_URL;
    if (type || client) {
      url += "?";
      if (type) url += "type=" + encodeURIComponent(type) + "&";
      if (client) url += "client=" + encodeURIComponent(client);
    }

    const response = await fetch(url);
    const data = await response.json();

    const table = document.getElementById("historyTable");
    table.innerHTML = "<tr><th>Code</th><th>Name</th><th>Date</th></tr>";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${row.code}</td><td>${row.name}</td><td>${row.date}</td>`;
      table.appendChild(tr);
    });

    window.historyData = data; // save for CSV
  } catch (error) {
    console.error("Error loading history:", error);
  }
}

function downloadCSV() {
  if (!window.historyData || window.historyData.length === 0) {
    alert("No data to export");
    return;
  }

  let csv = "Code,Name,Date\n";
  window.historyData.forEach(row => {
    csv += `${row.code},${row.name},${row.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "codes_history.csv";
  a.click();
  URL.revokeObjectURL(url);
}

window.onload = loadHistory;
