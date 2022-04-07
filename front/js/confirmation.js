const orderIdSpan = document.getElementById("orderId");

const urlQuery = window.location.search;
const orderId = urlQuery.slice(7);

const displayOrderId = () => orderIdSpan.textContent = orderId;

displayOrderId();