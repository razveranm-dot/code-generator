// Replace with your actual Web App URL from Apps Script deployment
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxddQSq9G0Ey6Fd2ZpS_xQ3mAgG7vRWYpZHIpb4i8PLjTKIJRKrLxk4YIv8KthVlImH/exec";

let currentData = []; // store last search results

function generateCode(type) {
  let name = document.getElementById(type.toLowerCase() + "Name").value;
  let clientCode = "";
  if (type === "PV") clientCode = document.getElementById("pvClient").value;
  if (type === "QT") clientCode = document.getElementById("qtClient").value;

  fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify({type: type, name: name, clientCode: clientCode})
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById(type.toLowerCase() + "Result").innerText =
      "✅ " + type + " Code Generated: " + data.code;
  })
  .catch(err => {
    document.getElementById(type.toLowerCase() + "Result").innerText =
      "❌ Error generating code.";
  });
}

function loadDashboard() {
  let type = document.getElementById("dashType").value;
  let clientCode = document.getElementById("dashClient").value;
  let date = document.getElementById("dashDate").value;
  
  let url = WEB_APP_URL + "?type=" + type;
  if (clientCode) url += "&clientCode=" + clientCode;
  if (date) url += "&date=" + date;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      currentData = data; // save for export
      let tbody = document.querySelector("#dashboardTable tbody");
      tbody.innerHTML = "";
      data.forEach(row => {
        let tr = document.createElement("tr");
        tr.innerHTML = "<td>" + row.code + "</td><td>" + row.name + "</td><td>" + row.date + "</td>";
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      alert("Error loading dashboard: " + err);
    });
}

function exportCSV() {
  if (currentData.length === 0) {
    alert("No data to export. Please run a search first.");
    return;
  }
  
  let csv = "Code,Name,Date\n";
  currentData.forEach(row => {
    csv += row.code + "," + row.name + "," + row.date + "\n";
  });
  
  let blob = new Blob([csv], { type: "text/csv" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "codes_export.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}
