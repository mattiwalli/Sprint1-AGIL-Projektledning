import { databaseURL } from "./firebase.js";

async function getLatestProduct() {
  const res = await fetch(`${databaseURL}/products.json`);
  const data = await res.json();
  if (!data) return [];

  const productsArray = Object.entries(data)
    .map(([id, product]) => ({ id, ...product }))
    .filter((p) => p.highlight) // Endast produkter som är markerade som highlight
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5); // Max 5 produkter

  return productsArray;
}

export async function displayNyheter() {
  const container = document.getElementById("nyheter");
  const products = await getLatestProduct();
  container.innerHTML = "";

  if (products.length === 0) {
    container.textContent = "Inga utvalda produkter hittades.";
    return;
  }

  let currentIndex = 0;

  const card = document.createElement("div");
  card.id = "product-card";

  const name = document.createElement("h3");
  const img = document.createElement("img");

  card.appendChild(name);
  card.appendChild(img);

  // Skapa en wrapper för knapparna inuti kortet
  const btnWrapper = document.createElement("div");
  btnWrapper.id = "btn-wrapper";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";

  btnWrapper.appendChild(prevBtn);
  btnWrapper.appendChild(nextBtn);

  card.appendChild(btnWrapper);  

  container.appendChild(card);    

  function showProduct(index) {
    const product = products[index];
    name.textContent = product.name;
    img.src = product.images[0];
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    showProduct(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % products.length;
    showProduct(currentIndex);
  });

  showProduct(currentIndex);
}
