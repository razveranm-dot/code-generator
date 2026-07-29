const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwc-tnMgRirN2Rdy9Y6M3bMtTGTnJxgl2dIhxJc9WFAvlu4t6BkQ_zFkOdQRqze1DJX3w/exec"; // replace with your actual Google Apps Script Web App URL

async function generateCode(type) {
  let name = "";
  let clientCode = "";

  if (type === "PV") {
    name = document.getElementById("pvName").value;
    clientCode = document.getElementById("pvClient").value;
  } else if (type === "INV") {
    name = document.getElementById("invName").value;
  } else if (type === "QT") {
    name = document.getElementById("qtName").value;
    clientCode = document.getElementById("qtClient").value;
  }

  const response = await fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify({type, name, clientCode}),
    headers: {"Content-Type": "application/json"}
  });

  const result = await response.json();
  document.getElementById(type.toLowerCase() + "Result").innerText =
    "✅ " + type + " Code Generated: " + result.code;
}

async function searchCodes() {
  const type = document.getElementById("filterType").value;
  const clientCode = document.getElementById("filterClient").value;
  const date = document.getElementById("filterDate").value;

  const url = WEB_APP_URL + "?type=" + type + "&clientCode=" + clientCode + "&date=" + date;
  const response = await fetch(url);
  const data = await response.json();

  const tbody = document.getElementById("resultsTable").querySelector("tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.code}</td><td>${row.name}</td><td>${row.date}</td>`;
    tbody.appendChild(tr);
  });
}

function exportCSV() {
  const rows = document.querySelectorAll("#resultsTable tr");
  let csv = [];
  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    const rowData = [];
    cols.forEach(col => rowData.push(col.innerText));
    csv.push(rowData.join(","));
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "codes.csv");
  a.click();
}
