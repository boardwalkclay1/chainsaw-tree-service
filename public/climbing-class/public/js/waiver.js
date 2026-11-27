document.addEventListener(
"DOMContentLoaded",
() => {

const continueBtn =
document.getElementById(
"continueBtn"
);

if(!continueBtn) return;

continueBtn.addEventListener(
"click",
() => {

const agree =
document.getElementById(
"agreeBox"
);

if(
!agree ||
!agree.checked
){

alert(
"You must accept the waiver."
);

return;

}

localStorage.setItem(
"waiverAccepted",
"true"
);

window.location.href =
"/climbing-class/public/pages/payment.html";

}
);

}
);
