export const databaseURL = "https://agil-projektledning-default-rtdb.europe-west1.firebasedatabase.app/";


export async function addCategory(categoryName) {
  const response = await fetch(`${databaseURL}/categories.json`, {
    method: "POST",
    body: JSON.stringify({ name: categoryName }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Kunde inte spara kategori.");
  return response.json();
}


export async function getCategories() {
  const res = await fetch(`${databaseURL}/categories.json`);
  const data = await res.json();
  if (!data) return [];
  return Object.values(data).map((cat) => cat.name);
}


export async function addProduct(product) {
  const response = await fetch(`${databaseURL}/products.json`, {
    method: "POST",
    body: JSON.stringify(product),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Kunde inte spara produkt.");
  return response.json();
}


export async function getProducts() {
  const res = await fetch(`${databaseURL}/products.json`);
  const data = await res.json();
  if (!data) return [];
  return Object.values(data);
}
