const certificateDatabase = {

"BBW-0001":{

title:
"Flint River Table",

species:
"Black Walnut",

status:
"Verified Original"

},

"BBW-0002":{

title:
"Live Edge Walnut Bench",

species:
"Walnut",

status:
"Verified Original"

}

};

document.addEventListener(
"DOMContentLoaded",
() => {

const button =
document.getElementById(
"verifyButton"
);

if(!button) return;

button.addEventListener(
"click",
() => {

const id =
document
.getElementById(
"certificateInput"
)
.value
.toUpperCase();

const result =
document.getElementById(
"verifyResult"
);

const cert =
certificateDatabase[id];

if(cert){

result.innerHTML = `

<h2>

Verified

</h2>

<p>

${id}

</p>

<p>

${cert.title}

</p>

<p>

${cert.species}

</p>

<p>

${cert.status}

</p>

`;

}else{

result.innerHTML = `

<h2>

Certificate Not Found

</h2>

`;

}

});

});
