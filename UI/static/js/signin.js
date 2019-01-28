import Handler from "./handler.js"

document.getElementById('sign-in-form').addEventListener("submit", signIn)

let handler = new Handler()

function signIn(event) {
    // Logs in registered user to an access
    // session
    event.preventDefault();

    let email = document.getElementById('sign-in-form').elements['email'].value;
    let password = document.getElementById('sign-in-form').elements['password'].value;

    let data = {
        "email": email,
        "password": password
    }
}
