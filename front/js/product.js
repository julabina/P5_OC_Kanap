const productImage = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productOption = document.getElementById("colors");

const urlQuery = window.location.search;
const productId = urlQuery.slice(4)

let productData;

fetch('http://localhost:3000/api/products/' + productId)
.then(res => res.json())
.then(datas => {
    productData = datas;
    displayProduct();
})

const displayProduct = () => {
    productImage.innerHTML += `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
    productTitle.textContent = productData.name;
    productPrice.textContent = productData.price;
    productDescription.textContent = productData.description;
    for (let i = 0; i < productData.colors.length; i++) {
        productOption.innerHTML += `
            <option value="${productData.colors[i]}">${productData.colors[i]}</option>
        `
    }
}
