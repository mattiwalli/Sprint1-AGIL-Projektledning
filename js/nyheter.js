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

    products.forEach(product => {
        const card = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const img = document.createElement('img');
        img.src = product.images[0];

        card.append(name, img);

        container.appendChild(card);
    });
};