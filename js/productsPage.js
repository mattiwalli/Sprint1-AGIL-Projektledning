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

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
  
    const filtered = cachedProducts.filter(product => {
      const name = (product.name || '').toLowerCase();
      const desc = (product.desc || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const category = (product.cat || '').toLowerCase();
      const price = (product.price !== undefined ? String(product.price) : '').toLowerCase();
  
      return (
        name.includes(searchTerm) ||
        desc.includes(searchTerm) ||
        description.includes(searchTerm) ||
        category.includes(searchTerm) ||
        price.includes(searchTerm)
      );
    });
  
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
