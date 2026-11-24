document.addEventListener(
"DOMContentLoaded",
() => {

const available =
document.getElementById(
"availablePieces"
);

const sold =
document.getElementById(
"soldPieces"
);

if(available){

pieces
.filter(
piece =>
piece.status ===
"available"
)

.forEach(piece => {

available.innerHTML += `

<div class="piece-card">

<img
src="${piece.image}"
class="piece-image">

<h2>

${piece.title}

</h2>

<p>

Certificate:
${piece.id}

</p>

<p>

${piece.species}

</p>

<p>

$${piece.price}

</p>

<a
class="wood-btn"
href="${piece.page}">

View Piece

</a>

</div>

`;

});

}

if(sold){

pieces
.filter(
piece =>
piece.status ===
"sold"
)

.forEach(piece => {

sold.innerHTML += `

<div class="piece-card">

<img
src="${piece.image}"
class="piece-image">

<h2>

${piece.title}

</h2>

<p>

${piece.id}

</p>

<p>

SOLD

</p>

</div>

`;

});

}

});
