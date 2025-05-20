import { getLatestProduct } from "./firebase.js";

export async function displayNyheter() {
    const container = document.getElementById("nyheter");

    const products = await getLatestProduct();

    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const timestamp = document.createElement("p");
        const date = new Date(product.timestamp);
        timestamp.textContent = `Published: ${date.toLocaleString()}`;

        card.appendChild(name);
        card.appendChild(timestamp);

        container.appendChild(card);
    });
};