const cartItemsContainer = document.getElementById("cart__items");
const totalQty = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");


let cart = [],
cartInfos = [],
productsDatas= [];

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
}


const changeQty = (value, id, color) => {
  let qtyInt = parseInt(value);
  let newArr = [];
  let newQty = Math.round(qtyInt);
  if (isNaN(newQty)) {
    newQty = 0;
  }
  if(qtyInt > 100) {
      productQuantityInput.value = 100;
      newQty = 100;
  } else if (qtyInt < 0) {
      productQuantityInput.value = 0;
      newQty = 0;
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

/*const selectQuantity = (qty) => {
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
}*/

const getCartStorage = () => {
    if (window.localStorage.getItem("localCart")) {
       cart = JSON.parse(localStorage.getItem("localCart"));
    } 
    displayCart();
}

const addListenner = () => {
  
  const qtyInputs = document.querySelectorAll(".itemQuantity");
  
  qtyInputs.forEach(input => {
    input.addEventListener("input", (e) => {
      changeQty(e.target.value, e.path[4].dataset.id, e.path[4].dataset.color);
    })
  })
}