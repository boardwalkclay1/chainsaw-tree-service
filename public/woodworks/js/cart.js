let cart = [];

function addToCart(id){

const piece =
pieces.find(
p => p.id === id
);

if(!piece) return;

cart.push(piece);

localStorage.setItem(

"woodworksCart",

JSON.stringify(cart)

);

alert(

piece.title +

" added to cart."

);

}

function loadCart(){

const saved =

localStorage.getItem(
"woodworksCart"
);

if(saved){

cart =
JSON.parse(saved);

}

}

loadCart();
