import {
  addCategory,
  getCategories,
  addProduct,
  getProducts,
} from "./firebase.js";

const categoryForm = document.getElementById("categoryForm");
const categoryInput = document.getElementById("categoryName");
const categoryMsg = document.getElementById("categoryMessage");

const productForm = document.getElementById("productForm");
const productNameIn = document.getElementById("productName");
const productDescIn = document.getElementById("productDesc");
const productCatSel = document.getElementById("productCategory");
const imgInputs = [
  document.getElementById("image1"),
  document.getElementById("image2"),
  document.getElementById("image3"),
];
const productMsg = document.getElementById("productMessage");

const productList = document.getElementById("productList");
const categoryList = document.getElementById("categoryList");

let categories = [];
let products = [];

loadCategories();
loadProducts();


async function loadCategories() {
  categories = await getCategories();
  updateCategorySelect();
  renderCategoryList();
}

async function loadProducts() {
  products = await getProducts();
  renderProductList();
}


categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = categoryInput.value.trim();
  if (!name) return;

  try {
    await addCategory(name);
    categoryInput.value = "";
    categoryMsg.hidden = false;
    setTimeout(() => (categoryMsg.hidden = true), 2000);
    await loadCategories();
  } catch (err) {
    alert(err.message);
  }
});


function updateCategorySelect() {
  productCatSel.innerHTML =
    '<option value="" disabled selected>Välj kategori</option>';
  categories.forEach((cat) => {
    const o = document.createElement("option");
    o.value = cat;
    o.textContent = cat;
    productCatSel.appendChild(o);
  });
}


function renderCategoryList() {
  categoryList.innerHTML = "";
  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat;
    categoryList.appendChild(li);
  });
}


productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = productNameIn.value.trim();
  const desc = productDescIn.value.trim();
  const cat = productCatSel.value;
  if (!name || !desc || !cat) {
    return alert("Fyll i namn, beskrivning och kategori.");
  }

  const files = imgInputs.map((i) => i.files[0]).filter((f) => f);
  if (files.length === 0) return alert("Lägg till minst en bild");

  // Läs in varje fil som Base64
  const imgUrls = await Promise.all(files.map(readFileAsDataURL));

  const product = 
  { 
    name,
     desc, 
     cat, 
     images: 
     imgUrls

   };

  try {
    await addProduct(product);
    productNameIn.value = "";
    productDescIn.value = "";
    productCatSel.selectedIndex = 0;
    imgInputs.forEach((i) => (i.value = ""));
    productMsg.hidden = false;
    setTimeout(() => (productMsg.hidden = true), 2000);
    await loadProducts();
  } catch (err) {
    alert(err.message);
  }
});


function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}


function renderProductList() {
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${p.name}</h3>
      <p><em>${p.cat}</em></p>
      <p>${p.desc}</p>
      <div class="thumbs">
        ${p.images
          .map((src) => `<img src="${src}" alt="${p.name}" width="60">`)
          .join("")}
      </div>
    `;
    productList.appendChild(li);
  });
}
