document.addEventListener(
"DOMContentLoaded",
() => {

const signup =

JSON.parse(
localStorage.getItem(
"signupResult"
) || "{}"
);

const enrollment =

JSON.parse(
localStorage.getItem(
"pendingEnrollment"
) || "{}"
);

const dashboard =
document.getElementById(
"dashboardData"
);

if(!dashboard) return;

dashboard.innerHTML = `

<div class="category-card">

<h3>

Student

</h3>

<p>

${enrollment.name || ""}

</p>

</div>

<div class="category-card">

<h3>

Email

</h3>

<p>

${enrollment.email || ""}

</p>

</div>

<div class="category-card">

<h3>

Course

</h3>

<p>

${enrollment.course || ""}

</p>

</div>

<div class="category-card">

<h3>

Reward Applied

</h3>

<p>

${signup.discountApplied || 0}%

</p>

</div>

`;

}
);
