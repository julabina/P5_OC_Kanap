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

/** 
 * récupère les données du produit de l'API
*/
const init = () => {
    fetch('http://localhost:3000/api/products/' + productId)
    .then(res => res.json())
    .then(data => {
        productData = data;
        displayProduct();
    })
    .catch(err => console.log(`Error with the message : ${err}`))
}

init();

/** 
 * affiche les produits
*/
const displayProduct = () => {
    const newImgElement = document.createElement('img');
    newImgElement.src = productData.imageUrl;
    newImgElement.alt = productData.altTxt;
    productImage.appendChild(newImgElement);
    productTitle.textContent = productData.name;
    productPrice.textContent = productData.price;
    productDescription.textContent = productData.description;

    for (let i = 0; i < productData.colors.length; i++) {
        const newColorOption = document.createElement('option');
        const newColorsContent = document.createTextNode(productData.colors[i])
        newColorOption.value = productData.colors[i];
        newColorOption.appendChild(newColorsContent);
        productOption.appendChild(newColorOption);
    }

}

/** 
 * sélectionne la quantité à ajouter au panier
 * @param qty
*/
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

/** 
 * verifie que les inputs ne soit pas vides
*/
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

/** 
 * verifie si l'article existe deja dans le panier
*/
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

/**
 *  ouvre une fenetre de dialogue qui propose une redirection vers le panier
 */
const toCartPage = () => {
    if(confirm("Aller au panier !")) {
        let url = "/html/cart.html";
        window.open(url,"_self");
    } else { 
        window.scrollTo(top);
    }
}

/** 
 * ajoute dans localStorage le contenu du panier
*/
const addToCart = () => {
    window.localStorage.setItem("localCart", JSON.stringify(cart));
    productQuantityInput.value = 0;
    productOption.value = "";
    toCartPage();
}

/** 
 * récupere du localStorage le contenu du panier
*/
const getCartStorage = () => {
    if (window.localStorage.getItem("localCart")) {
       cart = JSON.parse(localStorage.getItem("localCart"));
    } 
}

getCartStorage();

        /////////////
        /// event ///
        /////////////

/** 
 * Change la quantitée d'article à ajouter au panier
 */
productQuantityInput.addEventListener("input", e => {
    selectQuantity(e.target.value)
});

/** 
 * Change la couleur de l'article à ajouter au panier
 */
productOption.addEventListener("change", e => {
    productColor = e.target.value;
});

/**
 * ajoute un article au panier, une fois celui ci validé 
 */
addToCartBtn.addEventListener("click", () => {
    verifyIsNotEmpty();
})

