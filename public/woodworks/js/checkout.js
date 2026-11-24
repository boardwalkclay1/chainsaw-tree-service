document.addEventListener(
"DOMContentLoaded",
() => {

const form =
document.getElementById(
"checkoutForm"
);

if(!form) return;

form.addEventListener(
"submit",
e => {

e.preventDefault();

const orderNumber =

"BBW-ORDER-" +

Date.now();

localStorage.setItem(

"lastOrder",

orderNumber

);

window.location.href =

"/woodworks/thank-you.html";

});

});
