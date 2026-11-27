const Auth = {

saveUser(user){

localStorage.setItem(
"studentUser",
JSON.stringify(user)
);

},

getUser(){

return JSON.parse(

localStorage.getItem(
"studentUser"
) || "null"

);

},

logout(){

localStorage.removeItem(
"studentUser"
);

window.location.href =
"/climbing-class/public/pages/login.html";

}

};
