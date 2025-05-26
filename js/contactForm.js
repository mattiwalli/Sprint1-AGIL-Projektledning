import { databaseURL } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactFormElement");
  const thankYou = document.getElementById("thankYouMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      timestamp: Date.now(),
    };

    try {
      const response = await fetch(`${databaseURL}/formSubmissions.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Något gick fel vid sparning");

      form.style.display = "none";
      thankYou.style.display = "block";
    } catch (error) {
      alert("Fel: " + error.message);
    }
  });
});
