const productImage = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productOption = document.getElementById("colors");
const productQuantityInput = document.getElementById("quantity");
const addToCartBtn = document.getElementById("addToCart");

const urlQuery = window.location.search;
const productId = urlQuery.slice(4)

let productData,
productQuantity = 0,
productColor = "";

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

const selectQuantity = (qty) => {
    let qtyInt = parseInt(qty);
    let qtyToAdd = Math.round(qtyInt);
    if (isNaN(qtyToAdd)) {
        qtyToAdd = 0;
    }
    if(qtyInt > 100) {
        productQuantityInput.value = 100;
        qtyToAdd = 100;
    } else if (qtyInt < 0) {
        productQuantityInput.value = 0;
        qtyToAdd = 0;
    }
    productQuantity = qtyToAdd;
}

const verifyIsNotEmpty = () => {
    if (productQuantity === 0 && productColor === "") {
        alert("Veuillez choisir une couleur et une quantité");
    } else if (productColor === "") {
        alert("Veuillez choisir une couleur");   
    } else if (productQuantity === 0) {
        alert("Veuillez choisir une quantité");  
    } else {
        
    }
}

productQuantityInput.addEventListener("input", e => {
    selectQuantity(e.target.value)
});

productOption.addEventListener("change", e => {
    productColor = e.target.value;
});

addToCartBtn.addEventListener("click", () => {
    verifyIsNotEmpty();
})

