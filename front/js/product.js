const productImage = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productOption = document.getElementById("colors");
const productQuantityInput = document.getElementById("quantity");
const addToCartBtn = document.getElementById("addToCart");

const urlQuery = window.location.search;
const productId = urlQuery.slice(4);

let productData,
productQuantity = 0,
productColor = "",
cart = [],
articles = {};

fetch('http://localhost:3000/api/products/' + productId)
.then(res => res.json())
.then(datas => {
    productData = datas;
    displayProduct();
})
.catch(err => console.log(`Error with the message : ${err}`))

// affiche les produits
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

// sélectionne la quantité à ajouter au panier
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

// verifie que les inputs ne soit pas vides
const verifyIsNotEmpty = () => {
    if (productQuantity === 0 && productColor === "") {
        alert("Veuillez choisir une couleur et une quantité");
    } else if (productColor === "") {
        alert("Veuillez choisir une couleur");   
    } else if (productQuantity === 0) {
        alert("Veuillez choisir une quantité");  
    } else {
        articles = {
            id: productId,
            qty: productQuantity,
            color: productColor
            }
        verifyIsExist();
    }
}

// verifie si l'article existe dans le panier
const verifyIsExist = () => {
    for (let i = 0; i < cart.length;i++) {
        if (cart[i].id === articles.id) {
            if (cart[i].color === articles.color) {
                let sum = cart[i].qty + articles.qty;
                cart[i].qty = sum;
                if (cart[i].qty > 100) {
                    cart[i].qty = 100;
                }
                return addToCart();
            } 
        }
    }
    cart.push(articles);
    addToCart();
}

// ajoute dans localStorage le contenu du panier
const addToCart = () => {
    window.localStorage.setItem("localCart", JSON.stringify(cart));
}

// récupere du localStorage le contenu du panier
const getCartStorage = () => {
    if (window.localStorage.getItem("localCart")) {
       cart = JSON.parse(localStorage.getItem("localCart"));
    } 
}

getCartStorage();

        /////////////
        /// event ///
        /////////////

productQuantityInput.addEventListener("input", e => {
    selectQuantity(e.target.value)
});

productOption.addEventListener("change", e => {
    productColor = e.target.value;
});

addToCartBtn.addEventListener("click", () => {
    verifyIsNotEmpty();
})

