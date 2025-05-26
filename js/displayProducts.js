import { updateProduct } from './firebase.js';

const BASE_URL = 'https://agil-projektledning-default-rtdb.europe-west1.firebasedatabase.app';


export function displayProducts(products) {
  const productListSection = document.getElementById('productList');
  productListSection.innerHTML = '';


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


    const productName = document.createElement('h3');
    productName.textContent = product.name;
    productDiv.appendChild(productName);

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

    const productDescription = document.createElement('p');
    productDescription.textContent = product.desc || product.description || '';
    productDiv.appendChild(productDescription);
    productDiv.appendChild(stockParagraph);

    // Wishlist knapp
    const wishlistButton = document.createElement('button');
    wishlistButton.textContent = 'Lägg till i önskelista';
    wishlistButton.classList.add('wishlist-button');
    wishlistButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent modal from opening
      console.log(`Lägger till i önskelista: ${product.name}`);

      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};

      if (!wishlist[product.id]) {
        wishlist[product.id] = {
          id: product.id,
          name: product.name,
          cat: product.cat,
          desc: product.desc || product.description || '',
          images: product.images || null,
          stock: product.stock || 0
        };
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Produkt tillagd i önskelistan:', product);
      } else {
        console.log('Produkten finns redan i önskelistan.');
      }
    });
    productDiv.appendChild(wishlistButton);

    productListSection.appendChild(productDiv);
  });
}
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
    const allProducts = Object.entries(data || {}).map(([id, product]) => {
      return { ...product, id };
    });

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

