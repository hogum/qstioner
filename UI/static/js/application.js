const url = 'http://localhost:5000';
// const url = 'https://qstionerv2-api-heroku.herokuapp.com/';

function showNav() {
    let class_id = document.getElementById('navbar');

    if (class_id.className === "nav-nav") {
        class_id.className += " responsive";
    
    } else {
        class_id.className = "nav-nav";
    }
}


function registerUser() {
    let regForm = document.getElementById("registration-form");

    let firstname = regForm.elements['firstname'].value;
    let lastname = regForm.elements['lastname'].value;
    let username = regForm.elements['username'].value;
    let othername = regForm.elements['othername'].value;
    let email = regForm.elements['email'].value;
    let password = regForm.elements['password'].value;
    let phonenumber = regForm.elements['phonenumber'].value;
}
