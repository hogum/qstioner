const url = 'http://localhost:5000/api/v1/';
let path  = 'http://localhost:5000/api/v1/';
// const url = 'https://qstionerv2-api-heroku.herokuapp.com/';

function showNav() {
    // Toggles the nav bar button for responsiveness.
    let class_id = document.getElementById('navbar');

    if (class_id.className === "nav-nav") {
        class_id.className += " responsive";
    
    } else {
        class_id.className = "nav-nav";
    }
}

let handler = new Handler();

function loadNextPage(nextPage) {
    document.location.href = nextPage;
}


class Handler {
    // Handles api fetch, and other common methods.
    constructor () {

    }

    post (url, data) {
        let absPath = path + url        

        return fetch(absPath, {
                method: 'POST',
                headers: {
                'Content-type': 'application/json',
                'Acess-Control-Allow-Origin': '*',
                'Acess-Control-Request-Method': 'POST',
            },
            body : JSON.stringify(data)
        });
    }

    saveToken(authToken) {
        localStorage.setItem("userToken", authToken)
    }
}

let registrationForm = document.getElementById("registration-form");

if (registrationForm)
        registrationForm.addEventListener("submit", registerUser)

function registerUser(event) {
    event.preventDefault();

    let firstname = registrationForm.elements['name'].value;
    let username = registrationForm.elements['username'].value;
    let email = registrationForm.elements['email'].value;
    let password = registrationForm.elements['password'].value;
    console.log(firstname);
    console.log(email);

    let data = {
            firstname: firstname,
            lastname: "missing",
            othername: "missing",
            email: email,
            username: username,
            phonenumber: 123000,
            password: password
    }

    handler.post('auth/register', data)
    .then(response => response.json().then (
        payload => ({status: response.status, body: payload})
        )).then (payload => {
        if (payload.status === 201) {
            console.log("\nSuccess  Register")
        } else {
            let warningMessage = document.getElementById('reg-cred--warning')
            warningMessage.style.display = 'block';
            setItem(() => {
                warningMessage.style.display = 'none';
            }, 10000)
        }
    }).catch(error => console.log(error))
    
}


let signInPage = document.getElementById('signin-form')
if (signInPage)
        signInPage.addEventListener("submit", signIn)
function signIn(event) {
    // Logs in registered user to an access
    // session
    event.preventDefault();

    let email = document.getElementById('signin-form').elements['email'].value;
    let password = document.getElementById('signin-form').elements['password'].value;

    let data = {
        "email": email,
        "password": password
    }

    handler.post('auth/login', data)
        .then(response => response.json().then (
            payload => ({status: response.status, body: payload})
            )).then(payload => {

                let message = undefined;
                if (payload.status === 200) {
                    message = "Success"
                    handler.saveToken(payload.body.data[0].token)

                    // Assign guest name for failed login sessions
                    let user = payload.body.data[0].user ? payload.body.data[0].user.split(' ')[1] : "Guest";
                    localStorage.setItem("currentUser", user)

                    let isAdmin = payload.body.data[0].isadmin

                    let userPage = isAdmin ? 'admin_page.html' : 'user_page.html'

                    setTimeout(() => {
                        window.location.href = userPage;
                    }, 2000)

                } else {
                    // Show wrong credentials error
                    let errSign = document.getElementById('cred-error')
                    // innerHtml = payload.body.message ** For registration only
                    errSign.style.display = 'block';
                    setTimeout(() => {
                        // Possibly clear error notification
                        errSign.style.display = 'none';
                    }, 20000)
                }
        }).catch(err => console.log(err))
}
