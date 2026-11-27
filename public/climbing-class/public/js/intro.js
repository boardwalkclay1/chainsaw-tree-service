document.addEventListener(
"DOMContentLoaded",
() => {

const details =
document.querySelectorAll(
"details"
);

details.forEach(
detail => {

detail.addEventListener(
"toggle",
() => {

if(detail.open){

console.log(
"Opened:",
detail.querySelector(
"summary"
)?.textContent
);

}

}
);

}
);

}
);
