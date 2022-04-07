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
productsDatas= [],
firstName, lastName,address, city, email;

fetch('http://localhost:3000/api/products/')
.then(res => res.json())
.then(datas => {
  productsDatas = datas;
  getCartStorage();
})
.catch(err => console.log(`Error with the message : ${err}`))

// affiche les élements du panier
const displayCart = () => {

  cartInfos = [];
  
  let productImageUrl, productAltTxt, productName, productPrice,
  cartList = '';
  
  for (let i = 0; i < cart.length; i++) {

    for (let a = 0; a < productsDatas.length; a++) {
      if (cart[i].id === productsDatas[a]._id) {
                productImageUrl = productsDatas[a].imageUrl;
                productAltTxt = productsDatas[a].altTxt;
                productName = productsDatas[a].name;
                productPrice = productsDatas[a].price
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
        
        cartList += `
        <article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
        <div class="cart__item__img">
        <img src="${productImageUrl}" alt="${productAltTxt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
        <h2>${productName}</h2>
        <p>${cart[i].color}</p>
        <p>${productPrice} €</p>
        </div>
        <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
        <p>Qté : ${cart[i].qty}</p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].qty}">
        </div>
        <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
        </div>
        </div>
        </div>
        </article>
        `
      }

      cartItemsContainer.innerHTML = cartList;
      calculTotal();
      addListenner();
      
}
  
// calcule le total du panier
const calculTotal = () => {
      let totalSum = 0, totalArticles = 0;

  for (let i = 0; i < cartInfos.length;i++) {
    let val = cartInfos[i].qty * cartInfos[i].price;
    totalSum += val;
    totalArticles += cartInfos[i].qty;
  }

  displayTotal(totalSum, totalArticles);
  
}

// affiche le total du panier
const displayTotal = (total, qty) => {
  totalQty.textContent = qty;
  totalPrice.textContent = total;
  setCartStorage();
}

// change la quantité d'un article du panier
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

// supprime un article
const deleteArticle = (id, color) => {
  const filteredSelectedId = cart.filter(el => el.id === id);
  const filteredWithSelectedColor = filteredSelectedId.filter(el => el.color !== color);
  const filteredOtherProductsId = cart.filter(el => el.id !== id);
  
  let newArr = filteredOtherProductsId;
  cart = newArr.concat(filteredWithSelectedColor);
  cart.sort(sortCartID);

  displayCart();
}

// trie les ids par ordre alphabétique
const sortCartID = (a, b) => {
    if (a.id < b.id) {return -1;}
    if (a.id > b.id) {return 1;}
    return 0;
}

// charge le panier depuis localStorage
const getCartStorage = () => {
    if (window.localStorage.getItem("localCart")) {
       cart = JSON.parse(localStorage.getItem("localCart"));
       cart.sort(sortCartID);
    } 
    displayCart();
}

// stock le panier dans localStorage
const setCartStorage = () => {
  window.localStorage.setItem("localCart", JSON.stringify(cart));
}

// ajoute des événements aux items créés 
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

// envoie la commande au server back
const postOrder = () => {

  let contactContent = {
    firstName : firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  },
  productIDArr = [],
  resDatas;

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
  .then(datas => {
    console.log(datas);
    resDatas = datas.orderId;
    toConfirmationPage(resDatas);
  })
  
  resetCart();
  
}

// redirige vers la page de confirmation
const toConfirmationPage = (id) => {
  let url = "/html/confirmation.html?order=" + id;
  
  window.open(url,"_self");
}

// réinitialise le panier
const resetCart = () => {
  cart = [];
  setCartStorage();
}

    ////////////////
    // FORMULAIRE //
    ////////////////

// affiche les erreurs pour le formulaire
const displayError = (tag, message) => {
  const span = document.getElementById(tag + 'ErrorMsg');
  
  span.textContent = message;
}

// verifie le champ prénom
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

// vérifie le champ nom
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

// vérifie le champ adresse
const addressCheck = (val) => {
  address = undefined;
  if (!val.match(/^[a-zA-Zé èà0-9\s,.'-]{3,}$/)) {
    displayError("address", "L'adresse n' est pas valide"); 
  } else {
    displayError("address", "");
    address = val;
  }
}

// vérifie le champ ville
const cityCheck = (val) => {
  city = undefined;
  if (!val.match(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/)) {
    displayError("city", "Le nom de la ville n'est pas valide");
  } else {
    displayError("city", "");
    city = val;
  }
}

// vérifie le champ email
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


inputFirstName.addEventListener("input", (e) => {
  firstNameCheck(e.target.value);
})

inputLastName.addEventListener("input", (e) => {
  lastNameCheck(e.target.value);
})

inputAddress.addEventListener("input", (e) => {
  addressCheck(e.target.value);
})

inputCity.addEventListener("input", (e) => {
  cityCheck(e.target.value);
})

inputEmail.addEventListener("input", (e) => {
  emailCheck(e.target.value);
})

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (firstName && lastName && address && city && email) {
    postOrder();
  } 
})