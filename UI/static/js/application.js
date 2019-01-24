const url = 'http://localhost:5000/api/v1/';
// const url = 'https://qstionerv2-api-heroku.herokuapp.com/';

function showNav() {
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
    console.log(email
)
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
        return response.json()
    }).then(function (data) {
        let resMessage = data.Status;
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
    let form = document.getElementById('sign-in-form');
    let username = form.elements['username'].value;
    let email = form.elements['username'].value;
    let password = form.elements['password'].value

    fetch (url + 'auth/login', {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            email: username,
            password: password
        })
    }).then(function(response) {
        if (response.status !== 200) {
            console.log("Encountered a problem during log in");
            console.log("Status Code: " + response.status);
        }
        return response.json()
    }).then(function(data) {
        let resMessage = data.Status;

        if (resMessage === 200) {
            let isadmin = checkUserRole(data.Data);
            let token = data.Data[0].token;
            localStorage.setItem('isadmin', isadmin);
            localStorage.setItem('authToken', token);
            console.log(token);
            console.log(isadmin);

            if (isadmin) {
                let userDashboard = 'admin_page.html';;
            } else if (! isadmin) {
                let userDashboard = 'user_page.html';
            }
            form.reset();

            setTimeout(function() {
                loadNextPage(userDashboard)
            }, 2000);
        
        } else {
            console.log(data['Message']);
        }
    }).catch(error => console.log(error))
}
