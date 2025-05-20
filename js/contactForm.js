document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactFormElement");
    const thankYou = document.getElementById("thankYouMessage");
  
    if (!form) return;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      fetch("https://formspree.io/f/mdkgypqq", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          form.style.display = "none";
          if (thankYou) thankYou.style.display = "block";
        } else {
          alert("Något gick fel. Försök igen senare.");
        }
      })
      .catch(error => {
        alert("Nätverksfel. Försök igen senare.");
      });
    });
  });
  