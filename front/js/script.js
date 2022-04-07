const itemsContainer = document.getElementById("items");

let productsData;

fetch("http://localhost:3000/api/products")
.then(res => res.json())
.then(data => {
    productsData = data;
    displayProduct();
})
.catch(err => console.log(`Error with the message : ${err}`))

// affiche les produits
const displayProduct = () => {

    let productList = '';

    for (let i = 0; i < productsData.length; i++) {
        productList += `
        <a href="./product.html?id=${productsData[i]._id}">
        <article>
          <img src="${productsData[i].imageUrl}" alt="${productsData[i].altTxt}, ${productsData[i].name}">
          <h3 class="productName">${productsData[i].name}</h3>
          <p class="productDescription">${productsData[i].description}</p>
        </article>
      </a>
        `
    }

    itemsContainer.innerHTML = productList;
}