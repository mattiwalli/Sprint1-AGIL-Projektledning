import { databaseURL } from "./firebase.js";

async function getLatestProduct() {
    const res = await fetch(`${databaseURL}/products.json?orderBy=%22timestamp%22&limitToLast=3`);
    const data = await res.json();
    if (!data) return [];

    const productsArray = Object.entries(data)
        .map(([id, product]) => ({ id, ...product }))
        .sort((a, b) => b.timestamp - a.timestamp);


        console.log(data);
    return productsArray;
}

export async function displayNyheter() {
    const container = document.getElementById("nyheter");
    const products = await getLatestProduct();
    container.innerHTML = "";

    if (products.length === 0) {
        container.textContent = "No products found.";
        return;
    }

    let currentIndex = 0;

    const card = document.createElement("div");
    card.id = "product-card";

    const name = document.createElement("h3");
    const img = document.createElement("img");

    card.appendChild(name);
    card.appendChild(img);

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";

    container.appendChild(card);
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);

    function showProduct(index) {
        const product = products[index];
        name.textContent = product.name;
        img.src = product.images[0];
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + products.length) % products.length;
        showProduct(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % products.length;
        showProduct(currentIndex);
    });

    showProduct(currentIndex);
}