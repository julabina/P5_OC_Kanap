const cartItemsContainer = document.getElementById("cart__items");
const totalQty = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");
const submitBtn = document.getElementById("order");

let cart = [],
cartInfos = [],
productsData= [],
firstName, lastName,address, city, email;

/** 
 * récupère les données de l'API
*/
const init = () => {
  fetch('http://localhost:3000/api/products/')
  .then(res => res.json())
  .then(data => {
    productsData = data;
    getCartStorage();
  })
  .catch(err => console.log(`Error with the message : ${err}`))
}

init();

/** 
 * affiche les élements du panier
*/
const displayCart = () => {

  cartInfos = [];

  cartItemsContainer.textContent = ""
  
  if(cart.length === 0) { 
    const newH2CartEmpty = document.createElement('h2');
    const newH2CartEmptyContent = document.createTextNode('Votre panier est vide !');
    newH2CartEmpty.appendChild(newH2CartEmptyContent);
    newH2CartEmpty.setAttribute("style", "text-align: center");
    cartItemsContainer.appendChild(newH2CartEmpty)
  }

  let productImageUrl, productAltTxt, productName, productPrice;

  for (let i = 0; i < cart.length; i++) {

    for (let a = 0; a < productsData.length; a++) {
      if (cart[i].id === productsData[a]._id) {
                productImageUrl = productsData[a].imageUrl;
                productAltTxt = productsData[a].altTxt;
                productName = productsData[a].name;
                productPrice = productsData[a].price
       }
   
     }
            
          let article = {
            id : cart[i].id,
            qty: cart[i].qty,
            color : cart[i].color,
            name: productName,
            price: productPrice
        }
        
        cartInfos.push(article)
        
        const newCartArticle = document.createElement('article');
        newCartArticle.setAttribute("class", "cart__item");
        newCartArticle.setAttribute("data-id", cart[i].id);
        newCartArticle.setAttribute("data-color", cart[i].color);

        const newCartDivImg = document.createElement('div');
        newCartDivImg.setAttribute("class", "cart__item__img");

        const newCartImg = document.createElement('img');
        newCartImg.src = productImageUrl;
        newCartImg.alt = productAltTxt;
        newCartDivImg.appendChild(newCartImg);

        const newCartDivContent = document.createElement('div');
        newCartDivContent.setAttribute("class", "cart__item__content");

        const newCartDivDescription = document.createElement('div');
        newCartDivDescription.setAttribute("class", "cart__item__content__description");

        const newCartDescH2 = document.createElement('h2');
        const newCartDescH2Content = document.createTextNode(productName);
        newCartDescH2.appendChild(newCartDescH2Content);
        const newCartDescColor = document.createElement('p');
        const newCartDescColorContent = document.createTextNode(cart[i].color);
        newCartDescColor.appendChild(newCartDescColorContent);
        const newCartDescPrice = document.createElement('p');
        const newCartDescPriceContent = document.createTextNode(productPrice);
        newCartDescPrice.appendChild(newCartDescPriceContent);

        newCartDivDescription.appendChild(newCartDescH2);
        newCartDivDescription.appendChild(newCartDescColor);
        newCartDivDescription.appendChild(newCartDescPrice);
        
        const newCartDivSettings = document.createElement('div');
        newCartDivSettings.setAttribute("class", "cart__item__content__settings");

        const newCartSettingQty = document.createElement('div');
        newCartSettingQty.setAttribute("class", "cart__item__content__settings__quantity");

        const newCartSettingP = document.createElement('p');
        const newCartSettingPContent = document.createTextNode("Qté : ");
        newCartSettingP.appendChild(newCartSettingPContent);
        const newCartSettingInput = document.createElement('input');
        newCartSettingInput.type = "number";
        newCartSettingInput.name = "itemQuantity";
        newCartSettingInput.min = "1";
        newCartSettingInput.max = "100";
        newCartSettingInput.setAttribute("class", "itemQuantity");
        newCartSettingInput.setAttribute("value", cart[i].qty);

        newCartSettingQty.appendChild(newCartSettingP);
        newCartSettingQty.appendChild(newCartSettingInput);

        const newCartSettingDelete = document.createElement('div');
        newCartSettingDelete.setAttribute("class", "cart__item__content__settings__delete");
        const newCartSettingdeleteP = document.createElement('p');
        newCartSettingdeleteP.setAttribute("class", "deleteItem");
        const newCartSettingdeletePContent = document.createTextNode("Supprimer");
        newCartSettingdeleteP.appendChild(newCartSettingdeletePContent);
        newCartSettingDelete.appendChild(newCartSettingdeleteP);

        newCartDivSettings.appendChild(newCartSettingQty);
        newCartDivSettings.appendChild(newCartSettingDelete);

        newCartDivContent.appendChild(newCartDivDescription);
        newCartDivContent.appendChild(newCartDivSettings);

        newCartArticle.appendChild(newCartDivImg);
        newCartArticle.appendChild(newCartDivContent);

        cartItemsContainer.appendChild(newCartArticle);

      }

      calculTotal();
      addListenner();
      
}
  
/** 
 * calcule le total du panier
*/
const calculTotal = () => {
      let totalSum = 0, totalArticles = 0;

  for (let i = 0; i < cartInfos.length;i++) {
    let val = cartInfos[i].qty * cartInfos[i].price;
    totalSum += val;
    totalArticles += cartInfos[i].qty;
  }

  displayTotal(totalSum, totalArticles);
  
}

/** 
 * affiche le total du panier
 * @param total
 * @param qty
*/
const displayTotal = (total, qty) => {
  totalQty.textContent = qty;
  totalPrice.textContent = total;
  setCartStorage();
}

/** 
 * change la quantité d'un article du panier
 * @param value
 * @param id
 * @param color
*/
const changeQty = (value, id, color) => {
  let qtyInt = parseInt(value);
  let newArr = [];
  let newQty = Math.round(qtyInt);
  if (isNaN(newQty)) {
    newQty = 0;
  }
  if(qtyInt > 100) {
      newQty = 100;
  } else if (qtyInt < 0) {
      newQty = 1;
  }

  for(let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      if (cart[i].color === color) {
        let newArt = {
          id,
          qty: newQty,
          color
        }
        newArr.push(newArt);
      } else {
        newArr.push(cart[i]);
      }
    } else {
      newArr.push(cart[i]);
    }
  }

  cart = newArr;

  displayCart();
}

/** 
 * supprime un article
 * @param id
 * @param color
*/
const deleteArticle = (id, color) => {
  if(confirm("Voulez vous supprimer cet article ?")) {
    const filteredSelectedId = cart.filter(el => el.id === id);
    const filteredWithSelectedColor = filteredSelectedId.filter(el => el.color !== color);
    const filteredOtherProductsId = cart.filter(el => el.id !== id);
    
    let newArr = filteredOtherProductsId;
    cart = newArr.concat(filteredWithSelectedColor);
    cart.sort(sortCartID);
    
    displayCart();
  }
}

/** 
 * trie les ids par ordre alphabétique
 * @param a
 * @param b
*/
const sortCartID = (a, b) => {
    if (a.id < b.id) {return -1;}
    if (a.id > b.id) {return 1;}
    return 0;
}

/** 
 * charge le panier depuis localStorage
*/
const getCartStorage = () => {
    if (window.localStorage.getItem("localCart")) {
       cart = JSON.parse(localStorage.getItem("localCart"));
       cart.sort(sortCartID);
    } 
    displayCart();
}

/** 
 * stock le panier dans localStorage
*/
const setCartStorage = () => {
  window.localStorage.setItem("localCart", JSON.stringify(cart));
}

/** 
 * ajoute des événements aux items créés 
*/
const addListenner = () => {
  
  const articles = document.querySelectorAll(".cart__item");
  
  articles.forEach(art => {
    let inputs = art.children[1].children[1].children[0].children[1];
    let btns = art.children[1].children[1].children[1].children[0];

    inputs.addEventListener("input", (e) => {
      changeQty(e.target.value, art.attributes[1].value, art.attributes[2].value);
    })

    btns.addEventListener("click", () => {
      deleteArticle(art.attributes[1].value, art.attributes[2].value);
    })
  })
}

/** 
 * envoie la commande au server back
*/
const postOrder = () => {

  let contactContent = {
    firstName : firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  },
  productIDArr = [],
  resData;

  for(let i = 0; i < cart.length; i++) {
    productIDArr.push(cart[i].id);
  }

  let postOption = {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      contact: contactContent,
      products: productIDArr
    })
  }

  fetch('http://localhost:3000/api/products/order', postOption)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    resData = data.orderId;
    toConfirmationPage(resData);
  })
  
  resetCart();
  
}

/** 
 * redirige vers la page de confirmation
 * @param id
*/
const toConfirmationPage = (id) => {
  let url = "/html/confirmation.html?order=" + id;
  window.open(url,"_self");
}

/** 
 * réinitialise le panier
*/
const resetCart = () => {
  cart = [];
  setCartStorage();
}

    ////////////////
    // FORMULAIRE //
    ////////////////

/** 
 * affiche les erreurs pour le formulaire
 * @param tag
 * @param message
*/   
const displayError = (tag, message) => {
  const span = document.getElementById(tag + 'ErrorMsg');
  
  span.textContent = message;
}

/** 
 * verifie le champ prénom
 * @param val
*/
const firstNameCheck = (val) => {
    firstName = undefined;
    if (val.length > 0 && (val.length < 2 || val.length > 25)) {
      displayError("firstName", "Le prénom doit être compris entre 2 et 25 caractère");
    } else if (!val.match(/^[a-zA-Zé èà]*$/)) {
      displayError("firstName", "Le prénom doit contenir uniquement des lettres");
    } else {
      displayError("firstName", "");
      firstName = val;
    }
  }

  /** 
 * vérifie le champ nom
 * @param val
*/
const lastNameCheck = (val) => {
    lastName = undefined;
    if (val.length > 0 && (val.length < 2 || val.length > 25)) {
    displayError("lastName", "Le nom doit être compris entre 2 et 25 caractère");  
  } else if (!val.match(/^[a-zA-Zé èà]*$/)) {
    displayError("lastName", "Le nom doit contenir uniquement des lettres");
  } else {
    displayError("lastName", "");
    lastName = val;
  }
}

/** 
 * vérifie le champ adresse
 * @param val
*/
const addressCheck = (val) => {
  address = undefined;
  if (val.length > 0 && (val.length < 3 || val.length > 100)) {  
    displayError("address", "L' adresse doit être compris entre 3 et 100 caractère");  
  } else if (!val.match(/^[a-zA-Zé èà0-9\s,.'-]{3,}$/)) {
    displayError("address", 'L\'adresse ne doit contenir que des lettres, nombres, ainsi que ",.\'-"'); 
  } else {
    displayError("address", "");
    address = val;
  }
}

/** 
 * vérifie le champ ville
 * @param val
*/
const cityCheck = (val) => {
  city = undefined;
  if (val.length > 0 && (val.length < 2 || val.length > 50)) {  
    displayError("city", "La ville doit être compris entre 2 et 50 caractère");  
  } else if (!val.match(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/)) {
    displayError("city", "Le nom de la ville n'est pas valide, il ne doit comporter que des lettres");
  } else {
    displayError("city", "");
    city = val;
  }
}

/** 
 * vérifie le champ email
 * @param val
*/
const emailCheck = (val) => {
  email = undefined;
  if (!val.match(/^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    displayError("email", "L'email n'est pas valide");
  } else {
    displayError("email", "");
    email = val;
  }
}


/////////////
/// EVENT ///
/////////////

/**
 * champs prénom du formulaire
 */
inputFirstName.addEventListener("input", (e) => {
  firstNameCheck(e.target.value);
})

/**
 * champs nom du formulaire
 */
inputLastName.addEventListener("input", (e) => {
  lastNameCheck(e.target.value);
})

/**
 * champs adresse du formulaire
 */
inputAddress.addEventListener("input", (e) => {
  addressCheck(e.target.value);
})

/**
 * champs ville du formulaire
 */
inputCity.addEventListener("input", (e) => {
  cityCheck(e.target.value);
})

/**
 * champs email du formulaire
 */
inputEmail.addEventListener("input", (e) => {
  emailCheck(e.target.value);
})

/**
 * envoi, si validé, le formulaire au back
 */
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (firstName && lastName && address && city && email) {
    postOrder();
  } else {
    alert("Vérifier l'exactitude des informations, tous les champs sont requis.")
  }
})