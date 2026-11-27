document.addEventListener(
"DOMContentLoaded",
() => {

const enrollment =

JSON.parse(
localStorage.getItem(
"pendingEnrollment"
) || "{}"
);

const summary =
document.getElementById(
"paymentSummary"
);

if(summary){

summary.innerHTML = `

<h3>

${enrollment.course || "Course"}

</h3>

<p>

Student:
${enrollment.name || ""}

</p>

`;

}

const payBtn =
document.getElementById(
"payNowBtn"
);

if(!payBtn) return;

payBtn.addEventListener(
"click",
async () => {

try{

const response =
await fetch(
"/api/class-signup",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

classId:
enrollment.classId,

name:
enrollment.name,

email:
enrollment.email

})
}
);

const data =
await response.json();

localStorage.setItem(
"signupResult",
JSON.stringify(
data
)
);

window.location.href =
"/climbing-class/public/pages/student-dashboard.html";

}
catch(err){

alert(
"Payment / Reservation Error"
);

}

}
);

}
);
