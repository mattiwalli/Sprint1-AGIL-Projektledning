document.addEventListener('DOMContentLoaded', () => {
  const wishlistContainer = document.getElementById('wishlistItems');

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};

  if (Object.keys(wishlist).length === 0) {
    wishlistContainer.innerHTML = '<p>Önskelistan är tom.</p>';
    return;
  }

  Object.values(wishlist).forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const productName = document.createElement('h3');
    productName.textContent = product.name;

    if (product.images && Object.values(product.images).length > 0) {
      const firstImage = Object.values(product.images)[0];
      const img = document.createElement('img');
      img.src = firstImage;
      img.alt = product.name;
      img.classList.add('product-image');
      productDiv.appendChild(img);
    } else {
      const noImg = document.createElement('p');
      noImg.textContent = 'Ingen bild tillgänglig';
      productDiv.appendChild(noImg);
    }

    const description = document.createElement('p');
    description.textContent = product.desc || '';

    const stock = document.createElement('p');
    stock.textContent = `I lager: ${product.stock || 0} st`;

    productDiv.appendChild(productName);
    productDiv.appendChild(description);
    productDiv.appendChild(stock);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Ta bort från önskelista';
    removeBtn.classList.add('wishlist-button');

    removeBtn.addEventListener('click', () => {
      delete wishlist[product.id];
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      productDiv.remove();

      if (Object.keys(wishlist).length === 0) {
        wishlistContainer.innerHTML = '<p>Önskelistan är tom.</p>';
      }
    });

    productDiv.appendChild(removeBtn);

    wishlistContainer.appendChild(productDiv);
  });
});
