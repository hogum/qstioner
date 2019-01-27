const url = 'http://localhost:5000/api/v1/';
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

function loginUser() {
    let logInForm = document.getElementById("sign-in-form");

    let userEmail = logInForm.elements.["email"].value;
    let userPass = logInForm.elements["password"].value;
    let userPage = undefined;

    fetch(url + '/auth/login', {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPass
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log('There was an error '
                + response.status;
            }
            return response.json();
        }).then(function (data) {
            let resMessage = data.message;

            if (resMessage.includes('Logged in')) {
                let userRole = data[0]['isadmin'];
                let userToken = data[0]['token'];
                localstorage.setItem('userIsAdmin', userRole);
                localstorage.setItem('userToken', userToken);
                console.log(userToken);
            }
        })
    })
}