import {
  addCategory,
  getCategories,
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
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
const highlightCheckbox = document.getElementById("highlightCheckbox");
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

let editingProduct = null;

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = productNameIn.value.trim();
  const desc = productDescIn.value.trim();
  const cat = productCatSel.value;
  const timestamp = Date.now();
  const highlight = highlightCheckbox.checked;

  if (!name || !desc || !cat) {
    return alert("Fyll i namn, beskrivning och kategori.");
  }

  const files = imgInputs.map((i) => i.files[0]).filter((f) => f);

  let imgUrls;
  if (files.length > 0) {
    imgUrls = await Promise.all(files.map(readFileAsDataURL));
  } else if (editingProduct && editingProduct.images) {
    imgUrls = editingProduct.images;
  } else {
    return alert("Lägg till minst en bild");
  }

  const product = {
    name,
    desc,
    cat,
    timestamp,
    images: imgUrls,
    highlight,
  };

  try {
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, product); // redigera
    } else {
      await addProduct(product); // ny
    }

    productForm.reset();
    editingProduct = null;

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

    const images = Array.isArray(p.images) ? p.images : [];

    li.innerHTML = `
      <h3>${p.name}</h3>
      <p><em>${p.cat}</em></p>
      <p>${p.desc}</p>
      <div class="thumbs">
        ${images
          .map((src) => `<img src="${src}" alt="${p.name}" width="60">`)
          .join("")}
      </div>
      <label>
        <input type="checkbox" class="highlight-checkbox" ${
          p.highlight ? "checked" : ""
        }> Highlight
      </label>
      <button class="edit-btn">Redigera</button>
      <button class="delete-btn">Ta bort</button>
    `;

    li.querySelector(".edit-btn").addEventListener("click", () => {
      productNameIn.value = p.name;
      productDescIn.value = p.desc;
      productCatSel.value = p.cat;
      highlightCheckbox.checked = p.highlight || false;
      editingProduct = p;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    li.querySelector(".delete-btn").addEventListener("click", async () => {
      if (confirm(`Vill du ta bort produkten "${p.name}"?`)) {
        try {
          await deleteProduct(p.id);
          await loadProducts();
        } catch (err) {
          alert(err.message);
        }
      }
    });

    li.querySelector(".highlight-checkbox").addEventListener(
      "change",
      async (e) => {
        const checked = e.target.checked;
        const highlightCount = products.filter((prod) => prod.highlight).length;

        if (checked && highlightCount >= 5 && !p.highlight) {
          alert("Du kan bara ha 5 highlights.");
          e.target.checked = false;
          return;
        }

        try {
          await updateProduct(p.id, { ...p, highlight: checked });
          await loadProducts();
        } catch (err) {
          alert(err.message);
        }
      }
    );

    productList.appendChild(li);
  });
}
