const itemsContainer = document.getElementById("items");

let productsData;

/** 
 * récupère les données de l'API
*/
const init = () => {
  fetch("http://localhost:3000/api/products")
  .then(res => res.json())
  .then(data => {
    productsData = data;
    displayProduct();
  })
  .catch(err => console.log(`Error with the message : ${err}`))
}

init();

/** 
 * affiche les produits
*/
const displayProduct = () => {

    for (let i = 0; i < productsData.length; i++) {
      const newProductLink = document.createElement('a');
      newProductLink.href = "./product.html?id=" + productsData[i]._id;

      
      const newProductImg = document.createElement('img');
      newProductImg.src = productsData[i].imageUrl;
      newProductImg.alt = productsData[i].altTxt + ", " + productsData[i].name
      
      const newProductH3 = document.createElement('h3');
      newProductH3.setAttribute("class", "productName");
      const newProductH3Content = document.createTextNode(productsData[i].name);
      newProductH3.appendChild(newProductH3Content); 
      
      const newProductDesc = document.createElement('p');
      newProductDesc.setAttribute("class", "productDescription");
      const newProductDescContent = document.createTextNode(productsData[i].description);
      newProductDesc.appendChild(newProductDescContent);
      
      const newProductArticle = document.createElement('article');
      newProductArticle.appendChild(newProductImg);
      newProductArticle.appendChild(newProductH3); 
      newProductArticle.appendChild(newProductDesc);

      newProductLink.appendChild(newProductArticle); 

      itemsContainer.appendChild(newProductLink);

    }
}