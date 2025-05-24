<<<<<<< HEAD
const BASE_URL = 'https://agil-projektledning-default-rtdb.europe-west1.firebasedatabase.app';


=======
import { updateProduct } from './firebase.js';

// Funktion för att visa produkter
>>>>>>> 093ee9c6c3293bc1d959ef2ae95be0861a0ee980
export function displayProducts(products) {
  const productListSection = document.getElementById('productList');
  productListSection.innerHTML = '';

<<<<<<< HEAD
  
  if (products.length === 0) {
    productListSection.innerHTML = '<p>Inga produkter hittades för den valda kategorin.</p>';
    console.log('Inga produkter att visa');
    return;
  }
  console.log('Produkter som ska visas:', products);

  products.forEach(product => {
    
    console.log('Visar produkt:', product.name, 'Kategori:', product.cat);

    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

   
=======
  if (products.length === 0) {
    productListSection.innerHTML = '<p>Inga produkter hittades för den valda kategorin.</p>';
    return;
  }

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

>>>>>>> 093ee9c6c3293bc1d959ef2ae95be0861a0ee980
    const productName = document.createElement('h3');
    productName.textContent = product.name;
    productDiv.appendChild(productName);

    const productDescription = document.createElement('p');
<<<<<<< HEAD
    productDescription.textContent = product.desc || product.description || '';
    productDiv.appendChild(productDescription);

    
    if (product.images && product.images.length > 0) {
      const productImage = document.createElement('img');
      productImage.src = product.images[0];
      productImage.alt = product.name;
      productImage.classList.add('product-image');
      productDiv.appendChild(productImage);
    } else {
      const noImage = document.createElement('p');
      noImage.textContent = 'Ingen bild tillgänglig';
      productDiv.appendChild(noImage);
    }

   
    productListSection.appendChild(productDiv);
  });
}

// Hämtar kategorier från Firebase
export async function fetchCategories() {
  console.log('Hämtar kategorier från Firebase...');
  try {
    const response = await fetch(`${BASE_URL}/categories.json`);
    if (!response.ok) {
      throw new Error('Det gick inte att hämta kategorier');
    }
    const data = await response.json();
    console.log('Kategorier från Firebase:', data);
    displayCategories(data);
  } catch (error) {
    console.error('Fel vid hämtning av kategorier:', error);
  }
}

export function displayCategories(categories) {
  const categoryListSection = document.getElementById('categories');
  categoryListSection.innerHTML = '';

  const allDiv = document.createElement('div');
  allDiv.classList.add('category');
  allDiv.textContent = 'Visa alla';
  allDiv.setAttribute('data-filter', '');
  allDiv.addEventListener('click', () => fetchProducts(''));
  categoryListSection.appendChild(allDiv);

  if (categories && Object.keys(categories).length === 0) {
    const noCategories = document.createElement('p');
    noCategories.textContent = 'Inga kategorier hittades.';
    categoryListSection.appendChild(noCategories);
  }

  for (const categoryKey in categories) {
    const category = categories[categoryKey];
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = category.name;
    categoryDiv.setAttribute('data-filter', category.name); 
    categoryDiv.addEventListener('click', () => {
      fetchProducts(category.name); 
    });
    categoryListSection.appendChild(categoryDiv);
  }
}

export async function fetchProducts(categoryName) {
  console.log('Hämtar produkter för kategori:', categoryName);
  try {
    const response = await fetch(`${BASE_URL}/products.json`);
    if (!response.ok) {
      throw new Error('Det gick inte att hämta produkter');
    }
    const data = await response.json();
    const allProducts = Object.values(data || {});

    console.log('Alla produkter:', allProducts); 

    const filteredProducts = categoryName
      ? allProducts.filter(product => product.cat === categoryName)  
      : allProducts;

    console.log('Filtrerade produkter:', filteredProducts); 

    displayProducts(filteredProducts);
  } catch (error) {
    console.error('Fel vid hämtning av produkter:', error);
  }
}
=======
    productDescription.textContent = product.description;
    productDiv.appendChild(productDescription);

    productDiv.addEventListener('click', () => {
      openImageModal(product.images);
    });

    if (product.images && Object.values(product.images).length > 0) {
      const firstImageBase64 = Object.values(product.images)[0];
      const productImage = document.createElement('img');
      productImage.src = firstImageBase64;
      productImage.alt = product.name;
      productImage.classList.add('product-image');
      productDiv.appendChild(productImage);
    } else {
      const noImage = document.createElement('p');
      noImage.textContent = 'Ingen bild tillgänglig';
      productDiv.appendChild(noImage);
    }

    // Lagerdata
  
    let stock = product.stock;
    if (stock === undefined) {
      stock = Math.floor(Math.random() * 20) + 1;
      product.stock = stock;

      updateProduct(product.id, { stock }).catch(err =>
        console.error(`Kunde inte uppdatera stock för ${product.name}`, err)
      );
    }

    const stockParagraph = document.createElement('p');
    stockParagraph.textContent = `I lager: ${stock} st`;
    productDiv.appendChild(stockParagraph);

    productListSection.appendChild(productDiv);
  });
}

// Funktion för att hämta kategorier
export function fetchCategories() {
  console.log('Hämtar kategorier från Firebase...');

  fetch('https://agil-projektledning-default-rtdb.europe-west1.firebasedatabase.app/categories.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Det gick inte att hämta kategorier');
      }
      return response.json();
    })
    .then(data => {
      console.log('Kategorier från Firebase:', data);
      displayCategories(data);
    })
    .catch(error => {
      console.error('Fel vid hämtning av kategorier:', error);
    });
}

// Funktion för att visa kategorier
export function displayCategories(categories) {
  const categoryListSection = document.getElementById('categories');
  categoryListSection.innerHTML = '';

  for (const categoryId in categories) {
    const category = categories[categoryId];
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = category.name;
    categoryDiv.setAttribute('data-filter', category.id);
    categoryDiv.addEventListener('click', () => {
      fetchProducts(category.id);
    });
    categoryListSection.appendChild(categoryDiv);
  }
}


export function fetchProducts(categoryId) {
  console.log('Hämtar produkter från Firebase för kategori:', categoryId);

  fetch('https://agil-projektledning-default-rtdb.europe-west1.firebasedatabase.app/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Det gick inte att hämta produkter');
      }
      return response.json();
    })
    .then(data => {
      console.log('Alla produkter från Firebase:', data);

      const allProducts = Object.entries(data).map(([id, product]) => ({
        id,
        ...product
      }));

      //const filteredProducts = Object.values(data).filter(product => {
      //  return categoryId === '' || product.categoryId === categoryId;
      //});
      const filteredProducts = allProducts.filter(product => {
        return categoryId === '' || product.categoryId === categoryId;
      });

      console.log('Filtrerade produkter:', filteredProducts);

      displayProducts(filteredProducts);
    })
    .catch(error => {
      console.error('Fel vid hämtning av produkter:', error);
    });
}



//funktion för att öppna och visa alla bilderna för en produkt
function openImageModal(images) {
  const modal = document.getElementById('image-modal');
  const modalImages = document.getElementById('modal-images');
  modalImages.innerHTML = '';

  Object.values(images).forEach(imageData => {
    const img = document.createElement('img');
    img.src = imageData;
    modalImages.appendChild(img);
  });

  modal.classList.remove('hidden');
  modal.style.display = 'block';
}

document.querySelector('.close-btn').addEventListener('click', () => {
  const modal = document.getElementById('image-modal');
  modal.style.display = 'none';
});
>>>>>>> 093ee9c6c3293bc1d959ef2ae95be0861a0ee980
