// =====================================================
// CHAINSAW CLAY CLASSES SYSTEM
// =====================================================

const classSchedule = [

{
id:"fund-001",

date:"2026-12-05",

time:"9:00 AM",

title:"Tree Climbing Fundamentals",

price:99,

spots:12,

course:"fundamentals"

},

{
id:"rapp-001",

date:"2026-12-06",

time:"10:00 AM",

title:"Professional Rappelling Academy",

price:125,

spots:10,

course:"rappelling"

},

{
id:"foot-001",

date:"2026-12-12",

time:"9:00 AM",

title:"Footlocking Academy",

price:125,

spots:8,

course:"footlocking"

},

{
id:"rig-001",

date:"2026-12-19",

time:"9:00 AM",

title:"Rigging Academy",

price:150,

spots:8,

course:"rigging"

},

{
id:"priv-001",

date:"2026-12-20",

time:"Custom",

title:"Private Coaching Session",

price:200,

spots:1,

course:"private"

}

];

// =====================================================
// DOM
// =====================================================

const calendarHeader =
document.getElementById(
"calendarHeader"
);

const calendarGrid =
document.getElementById(
"calendarGrid"
);

const classesList =
document.getElementById(
"classesList"
);

// =====================================================
// CALENDAR
// =====================================================

function buildCalendar() {

if(!calendarGrid) return;

const today =
new Date();

const year =
today.getFullYear();

const month =
today.getMonth();

const firstDay =
new Date(
year,
month,
1
);

const lastDay =
new Date(
year,
month + 1,
0
);

calendarHeader.textContent =

firstDay.toLocaleString(
"default",
{
month:"long"
}
)

+ " " +

year;

calendarGrid.innerHTML = "";

const blanks =
firstDay.getDay();

for(
let i = 0;
i < blanks;
i++
){

const empty =
document.createElement("div");

empty.className =
"calendar-day empty";

calendarGrid.appendChild(
empty
);

}

for(
let d = 1;
d <= lastDay.getDate();
d++
){

const currentDate =
new Date(
year,
month,
d
);

const dateString =
currentDate
.toISOString()
.split("T")[0];

const day =
document.createElement(
"div"
);

day.className =
"calendar-day";

day.textContent = d;

const hasClass =

classSchedule.some(
c =>
c.date === dateString
);

if(hasClass){

day.classList.add(
"has-class"
);

}

day.onclick = () => {

document
.querySelectorAll(
".calendar-day"
)
.forEach(
el =>
el.classList.remove(
"selected"
)
);

day.classList.add(
"selected"
);

renderClasses(
dateString
);

};

calendarGrid.appendChild(
day
);

}

}

// =====================================================
// CLASSES
// =====================================================

function renderClasses(
date
){

if(!classesList) return;

const classes =

classSchedule.filter(
c =>
c.date === date
);

classesList.innerHTML = "";

if(
classes.length === 0
){

classesList.innerHTML = `

<div class="category-card">

<h3>

No Classes Scheduled

</h3>

<p>

No training sessions
scheduled on this date.

</p>

</div>

`;

return;

}

classes.forEach(
cls => {

const card =
document.createElement(
"div"
);

card.className =
"category-card";

card.innerHTML = `

<h3>

${cls.title}

</h3>

<p>

Date:
${cls.date}

</p>

<p>

Time:
${cls.time}

</p>

<p>

Spots Available:
${cls.spots}

</p>

<h2>

$${cls.price}

</h2>

<a
href="/climbing-class/public/pages/enroll.html?course=${cls.course}&class=${cls.id}"
class="btn primary">

Reserve Spot

</a>

`;

classesList.appendChild(
card
);

}

);

}

// =====================================================
// DASHBOARD COUNTS
// =====================================================

function loadDashboardStats(){

const stats =
document.getElementById(
"dashboardStats"
);

if(!stats) return;

stats.innerHTML = `

<div class="category-card">

<h3>

Active Courses

</h3>

<h2>

4

</h2>

</div>

<div class="category-card">

<h3>

Certificates Earned

</h3>

<h2>

0

</h2>

</div>

<div class="category-card">

<h3>

Upcoming Classes

</h3>

<h2>

${classSchedule.length}

</h2>

</div>

`;

}

// =====================================================
// MEMBERSHIP DISPLAY
// =====================================================

function membershipStatus(){

const card =
document.getElementById(
"membershipStatus"
);

if(!card) return;

card.innerHTML = `

<h3>

Student Membership

</h3>

<p>

Active

</p>

`;

}

// =====================================================
// INIT
// =====================================================

document.addEventListener(
"DOMContentLoaded",
() => {

buildCalendar();

loadDashboardStats();

membershipStatus();

}
);
