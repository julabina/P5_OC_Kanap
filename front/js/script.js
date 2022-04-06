const itemsContainer = document.getElementById("items");

let productsDatas;

fetch("http://localhost:3000/api/products")
.then(res => res.json())
.then(datas => {
    productsDatas = datas;
    displayProduct();
})

const displayProduct = () => {

    let productList = '';

    for (let i = 0; i < productsDatas.length; i++) {
        productList += `
        <a href="./product.html?id=${productsDatas[i]._id}">
        <article>
          <img src="${productsDatas[i].imageUrl}" alt="${productsDatas[i].altTxt}, ${productsDatas[i].name}">
          <h3 class="productName">${productsDatas[i].name}</h3>
          <p class="productDescription">${productsDatas[i].description}</p>
        </article>
      </a>
        `
    }

    itemsContainer.innerHTML = productList;
}