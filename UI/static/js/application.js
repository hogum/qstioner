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



function registerUser() {
    let regForm = document.getElementById("registration-form");

    let firstname = regForm.elements['name'].value;
    let username = regForm.elements['username'].value;
    let email = regForm.elements['email'].value;
    let password = regForm.elements['password'].value;
    console.log(firstname);
    console.log(email);
    fetch(url + 'auth/register', {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            firstname: firstname,
            lastname: "missing",
            othername: "missing",
            email: email,
            username: username,
            phonenumber: 123000,
            isadmin: true,
            password: password
        })
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let resMessage = data.status;
        if (resMessage === 201) {
            let page = 'sign-in.html';
            regForm.reset();
            loadNextPage(page);
        }

        else {

        }
    }).catch(error => console.log(error))
}

function checkUserRole(userDetails) {
    return userDetails[0].isadmin;
}

/*
 function loginUser() {
    let logInForm = document.getElementById("signin-form");

    let userEmail = logInForm.elements["email"].value;
    let userPass = logInForm.elements["password"].value;
    let userPage = undefined;

    fetch(url + 'auth/login', {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPass
        })
    }).then(function (response) {
        return response.json()
        }).then(function (data) {
            let resMessage = data.status;
            console.log(resMessage + ' resMessage');
            console.log('data\n' + data.data);

            if (resMessage === 200) {
                let userRole = data.data[0]['isadmin'];
                let userToken = data.data[0]['token'];
                localstorage.setItem('userIsAdmin', userRole);
                localstorage.setItem('userToken', userToken);
                console.log(userToken);

                if (userRole) {
                    userPage = "admin-page.html";
                }

                else {
                    userPage = "user_page.html";
                }
                logInForm.reset();

                setTimeout(function () {
                    loadNextPage(userPage)
                }, 2000);
            } else {
                console.log("Failed\n" + data.status);
            }
        }).catch(error => console.log(error))
}
*/


let handler = new Handler();

document.getElementById('signin-form').addEventListener("submit", signIn)

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

                }
        })
}
