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

    const productDescription = document.createElement('p');
    productDescription.textContent = product.desc || product.description || '';
    productDiv.appendChild(productDescription);
    
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
