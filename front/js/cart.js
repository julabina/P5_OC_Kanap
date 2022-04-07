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
    
const calculTotal = () => {
      let totalSum = 0, totalArticles = 0;

  for (let i = 0; i < cartInfos.length;i++) {
    let val = cartInfos[i].qty * cartInfos[i].price;
    totalSum += val;
    totalArticles += cartInfos[i].qty;
  }

  displayTotal(totalSum, totalArticles);
  
}

const displayTotal = (total, qty) => {
  totalQty.textContent = qty;
  totalPrice.textContent = total;
  setCartStorage();
}


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

const deleteArticle = () => {

}

const getCartStorage = () => {
    if (window.localStorage.getItem("localCart")) {
       cart = JSON.parse(localStorage.getItem("localCart"));
    } 
    displayCart();
}

const setCartStorage = () => {
  window.localStorage.setItem("localCart", JSON.stringify(cart));
}

const addListenner = () => {
  
  const qtyInputs = document.querySelectorAll(".itemQuantity");
  
  qtyInputs.forEach(input => {
    input.addEventListener("input", (e) => {
      changeQty(e.target.value, e.path[4].dataset.id, e.path[4].dataset.color);
    })
  })
}

const postOrder = () => {

  let contactContent = {
    firstName : firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  },
  productIDArr = [];

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
  .then(data => console.log(data))

  resetFormInputs();
  resetCart();
}

const resetFormInputs = () => {
  inputFirstName.value = "";
  inputLastName.value = "";
  inputAddress.value = "";
  inputCity.value = "";
  inputEmail.value = "";  
}

const resetCart = () => {
  cart = [];
  displayCart();
}

////////////////
// FORMULAIRE //
////////////////


const displayError = (tag, message) => {
  const span = document.getElementById(tag + 'ErrorMsg');
  
  span.textContent = message;
}

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

const addressCheck = (val) => {
  address = undefined;
  if (!val.match(/^[a-zA-Zé èà0-9\s,.'-]{3,}$/)) {
    displayError("address", "L'adresse n' est pas valide"); 
  } else {
    displayError("address", "");
    address = val;
  }
}

const cityCheck = (val) => {
  city = undefined;
  if (!val.match(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/)) {
    displayError("city", "Le nom de la ville n'est pas valide");
  } else {
    displayError("city", "");
    city = val;
  }
}

const emailCheck = (val) => {
  email = undefined;
  if (!val.match(/^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    displayError("email", "L'email n'est pas valide");
  } else {
    displayError("email", "");
    email = val;
  }
}

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