document.addEventListener(
"DOMContentLoaded",
() => {

const params =
new URLSearchParams(
window.location.search
);

const course =
params.get("course");

const classId =
params.get("class");

const courseField =
document.getElementById(
"selectedCourse"
);

const classField =
document.getElementById(
"selectedClass"
);

if(courseField && course){

courseField.value =
course;

}

if(classField && classId){

classField.value =
classId;

}

const form =
document.getElementById(
"enrollmentForm"
);

if(!form) return;

form.addEventListener(
"submit",
async e => {

e.preventDefault();

const payload = {

name:
document.getElementById(
"name"
).value,

email:
document.getElementById(
"email"
).value,

phone:
document.getElementById(
"phone"
)?.value || "",

course,

classId

};

localStorage.setItem(
"pendingEnrollment",
JSON.stringify(
payload
)
);

window.location.href =
"/climbing-class/public/pages/waiver.html";

}
);

}
);
