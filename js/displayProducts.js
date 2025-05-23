// Funktion för att visa produkter
export function displayProducts(products) {
  const productListSection = document.getElementById('productList');
  productListSection.innerHTML = '';

  if (products.length === 0) {
    productListSection.innerHTML = '<p>Inga produkter hittades för den valda kategorin.</p>';
    return;
  }

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const productName = document.createElement('h3');
    productName.textContent = product.name;
    productDiv.appendChild(productName);

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;
    productDiv.appendChild(productDescription);

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

      const filteredProducts = Object.values(data).filter(product => {
        return categoryId === '' || product.categoryId === categoryId;
      });

      console.log('Filtrerade produkter:', filteredProducts);

      displayProducts(filteredProducts);
    })
    .catch(error => {
      console.error('Fel vid hämtning av produkter:', error);
    });
}
