import { fetchCategories, fetchProducts, displayProducts } from './displayProducts.js';

let cachedProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  // Hämta DOM-element
  const searchInput = document.getElementById("searchInput");

  // Hämta kategorier
  fetchCategories();

  // Hämta alla produkter och spara dem
  const response = await fetch("https://agil-projektledning-default-rtdb.europe-west1.firebasedatabase.app/products.json");
  const data = await response.json();
  cachedProducts = Object.values(data || {});
  displayProducts(cachedProducts); // Visa alla produkter

  // Aktivera sökfunktion
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = cachedProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      (product.desc?.toLowerCase().includes(searchTerm)) ||
      (product.description?.toLowerCase().includes(searchTerm)) // Lägg till description
    );
    displayProducts(filtered);
  });

  // Lägg till funktion för "Visa alla"-knappen
  const showAllBtn = document.querySelector('.category[data-filter=""]');
  if (showAllBtn) {
    showAllBtn.addEventListener("click", () => {
      displayProducts(cachedProducts);
    });
  }
});
