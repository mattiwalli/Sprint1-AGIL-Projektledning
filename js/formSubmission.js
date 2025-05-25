import { databaseURL } from "./firebase.js";

export async function getFormSubmissions() {
  const res = await fetch(`${databaseURL}/formSubmissions.json`);
  const data = await res.json();
  if (!data) return [];

  return Object.entries(data)
    .map(([id, submission]) => ({ id, ...submission }))
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function displayFormSubmissions() {
  const container = document.getElementById("submissions-list");
  const submissions = await getFormSubmissions();

  container.innerHTML = "";

  if (submissions.length === 0) {
    container.textContent = "Inga inskickade formulär hittades.";
    return;
  }

  const list = document.createElement("ul");
  list.style.listStyle = "none";
  list.style.padding = "0";

  submissions.forEach((sub) => {
    const li = document.createElement("li");
    li.style.borderBottom = "1px solid #ddd";
    li.style.padding = "0.5rem 0";

    li.innerHTML = `
      <strong>Namn:</strong> ${sub.name} <br/>
      <strong>Email:</strong> ${sub.email} <br/>
      <strong>Meddelande:</strong> ${sub.message} <br/>
      <small>Skickat: ${new Date(sub.timestamp).toLocaleString()}</small>
    `;

    list.appendChild(li);
  });

  container.appendChild(list);
}
