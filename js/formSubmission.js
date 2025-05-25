import { databaseURL } from "./firebase.js";

const submissionsList = document.getElementById("submissions-list");

async function loadSubmissions() {
  try {
    const response = await fetch(`${databaseURL}/formSubmissions.json`);
    if (!response.ok) throw new Error("Kunde inte hämta inskickade formulär.");

    const data = await response.json();
    if (!data) {
      submissionsList.innerHTML = "<p>Inga inskick hittades.</p>";
      return;
    }

    const entries = Object.entries(data);
    submissionsList.innerHTML = "";

    entries
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .forEach(([id, submission]) => {
        const div = document.createElement("div");
        div.classList.add("submission");

        const date = new Date(submission.timestamp).toLocaleString("sv-SE");

        div.innerHTML = `
          <p><strong>Namn:</strong> ${submission.name}</p>
          <p><strong>E-post:</strong> ${submission.email}</p>
          <p><strong>Meddelande:</strong> ${submission.message}</p>
          <p><small>Inskickat: ${date}</small></p>
          <button class="delete-btn" data-id="${id}">Ta bort</button>
          <hr />
        `;

        submissionsList.appendChild(div);
      });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Är du säker på att du vill ta bort detta inskick?")) {
          await deleteSubmission(id);
        }
      });
    });
  } catch (error) {
    submissionsList.innerHTML = `<p style="color:red;">Fel: ${error.message}</p>`;
  }
}

async function deleteSubmission(id) {
  try {
    const res = await fetch(`${databaseURL}/formSubmissions/${id}.json`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Kunde inte ta bort meddelandet.");
    loadSubmissions();
  } catch (err) {
    alert("Fel vid borttagning: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadSubmissions);
