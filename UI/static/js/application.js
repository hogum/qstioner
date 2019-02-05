 let path  = 'http://localhost:5000/api/v1/';
 // const path = 'https://qstionerv2-api-heroku.herokuapp.com/api/v1/';

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

function showMessage(element, message, period) {
    // Displays flash responses to user

    if (message)    
        element.textContent = message
    element.style.display = 'block'
    if (period) {
        setTimeout(() => {
            element.style.display = 'none'
        }, period)
    }
}

function clearFilledForm(form) {
    // Resets filled form data
    form.reset()
}

class Handler {
    // Handles api fetch, and other common methods.
    constructor () {

    }

    get(url) {
        let absPath = path + url

         return fetch(absPath, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Acess-Control-Allow-Origin': '*',
                'Acess-Control-Request-Method': 'GET',
                'Authorization': 'Bearer ' + this.retrieveToken()
            },
        });
    }

    post (url, data) {
        let absPath = path + url        

        return fetch(absPath, {
                method: 'POST',
                headers: {
                'Content-type': 'application/json',
                'Acess-Control-Allow-Origin': '*',
                'Acess-Control-Request-Method': 'POST',
                'Authorization': 'Bearer ' + this.retrieveToken()
            },
            body : JSON.stringify(data)
        });
    }

    saveToken(authToken) {
        // Ssaves auth token to local storage
        localStorage.setItem("userToken", authToken)
    }

    retrieveToken() {
        // Gets saved auth token from local storage
        let token = localStorage.getItem("userToken")

        if (token)
            return token
        return ' '
    }

    getCurrentUser() {
        return localStorage.getItem("currentUser")
    }

    confirmAuthorizedAccess() {

         if ((!this.getCurrentUser()) || (this.getCurrentUser() === 'Guest')) {
                window.location.href = 'sign-in.html'
                // **
                // Script terminates on redirect
                window.onload = function() {
                    let signInPrompt = document.getElementById('sign-in-guest-propmt')
                    signInPrompt.style.display = 'block'
                 }
        }
    }
}

let handler = new Handler();


function protectRoutes() {
    // Checks visited files in protected have
    // a current user session

    const protectedRoutes = ['create_meetup.html']
    let previous = localStorage.getItem('previous')
    let url = window.location.href
    let currentRoute = url.substr(url.lastIndexOf('/') + 1)
    let check = localStorage.getItem('check')

    // If user is redirected to sign-in page
    // from a protected route,
    // Display prompt request for login

    // Assign flag 'check' as '0'
    if (protectedRoutes.includes(currentRoute)) {    
        localStorage.setItem('check', 0)
    }

    // Flag matches 0
    // Store current protected route
    // Unmatch flag
    if (localStorage.getItem('check') == 0)  {
        previousPage = currentRoute
        localStorage.setItem('previous', previousPage)
        localStorage.setItem('check', 1)
    }
    previous = localStorage.getItem('previous')

    // For a redirection, display the prompt
    if (currentRoute === 'sign-in.html' && protectedRoutes.includes(previous)) {
        document.getElementById('sign-in-guest-propmt').style.display = 'block'
        document.getElementById('action-sign-header').style.display = 'none'
    } 

    if (protectedRoutes.includes(currentRoute)) {
        // Confirm user has access
        handler.confirmAuthorizedAccess()
    }
}

protectRoutes()

let registrationForm = document.getElementById("registration-form")

if (registrationForm)
        registrationForm.addEventListener("submit", registerUser)

function validateRegPass(passA, passB) {
    // Checks for similarity in registration passwords
    let passElement = document.getElementById('reg-cred--pass')

    if (passA != passB) {
        passElement.innerHTML = "Just let your passwords match. Cool?"
        passElement.style.display = 'block'

        setTimeout(() => {
            passElement.style.display = 'none'
        }, 6500)

        return false
    }
    return true
}

function registerUser(event) {
    // Posts user registration form details
    event.preventDefault();

    let firstname = registrationForm.elements['name'].value;
    let username = registrationForm.elements['username'].value;
    let email = registrationForm.elements['email'].value;
    let password = registrationForm.elements['password'].value;
    let retypedPass = registrationForm.elements['confirm-password'].value;

    if (! validateRegPass(password, retypedPass)) {
        return "failed password fields"
    }

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
        let warningMessage = document.getElementById('reg-cred--warning')
        let successMessage = document.getElementById('reg-cred--success')

        if (payload.status === 201) {

            warningMessage.style.display = 'none'
            successMessage.style.display = 'block'
            // Show success message on Registration
            // missing

            setTimeout(() => {
                registrationForm.reset()
                window.location.href = 'user_page.html';
                successMessage.style.display = 'none'
            }, 2500)
        } else {
            // invalid cred format response are an object in {message}
            // Conflicting accounts response is an object in {body}
            
            if (payload.status === 409) {
                warningMessage.textContent = payload.body.message
            } else {

                warningMessage.innerHTML = Object.keys(payload.body.message) ? Object.values(payload.body.message)[0] : payload.body.message
            }
            warningMessage.style.display = 'block';
            setTimeout(() => {
                warningMessage.style.display = 'none';
            }, 20000)
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
    let submitOption = document.getElementById('sign-in-form-button')
    submitOption.value = 'Signing in...'
    submitOption.disabled = true

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
                    submitOption.value = 'Sign in'
                    submitOption.disabled = false
                    // innerHtml = payload.body.message ** For registration only
                    errSign.style.display = 'block';
                    setTimeout(() => {
                        // Possibly clear error notification
                        errSign.style.display = 'none';
                    }, 20000)
                }
        }).catch(err => console.log(err))
}


let meetupDetails = document.getElementById('meetup-new--create')
if (meetupDetails)
    meetupDetails.addEventListener("submit", createMeetup)

function createMeetup(event) {
    // Posts a meetup from given meetups details
    event.preventDefault()

    let topic = meetupDetails.elements['name'].value
    let day = meetupDetails.elements['date'].value
    let time = meetupDetails.elements['time'].value
    let location = meetupDetails.elements['location'].value
    let tagsString = meetupDetails.elements['tag'].value
    let images = meetupDetails.elements['image'].value
    happeningOn = day + 'T' + time + ':00'
    tags = tagsString.split(',')

    let data = {
        topic: topic,
        happeningOn: happeningOn,
        tags: tags,
        location: location,
        images: images
    }

    handler.post('meetups', data)
    .then(response => response.json()
        .then(payload => ({status: response.status, body: payload})
            )).then(payload => {
        let warningMessage = document.getElementById('meetup-detail-error')
        let successMessage = document.getElementById('create-meetup--success')
        let timeOut = 15000

        if (payload.status === 201) {
            warningMessage.style.display = 'none'
            showMessage(successMessage)
            addCloseOption()
            clearFilledForm(meetupDetails)
        } else {
            let msg = payload.body.message ? payload.body.message : payload.body.message[0]
            showMessage(warningMessage, msg, timeOut)
        }
    }).catch(err => console.log(err))
}

function addCloseOption() {
    let notificationButton = document.getElementById('meetup-notifcation--close-button')
    notificationButton.addEventListener("click", function(event) {
        document.getElementById('create-meetup--success').style.display = 'none'
    })
}

function findMeetupPages(page) {
    /*
        Get all files sending GET requests to meetups resource
    */
    meetupPages = ['index.html', 'trending.html', 'admin_page.html']

    if (meetupPages.includes(page))
        retrieveAllMeetups()
}

let meetupsDisplayPage = window.location.href.split('/').pop()
findMeetupPages(meetupsDisplayPage)
let meetups = new Array()

function retrieveAllMeetups() {
    /*
        Send get request for existing meetup records.
    */

    handler.get('meetups/upcoming')
        .then(response => response.json()
            .then (payload => ({status: response.status, body: payload})
                )).then (
                    payload => {
                        console.log(payload)
                        if (payload.status === 200) {
                            meetups = payload.body.data
                            displayMeetups(meetups)
                        } else {
                            // window.location.href = 'sign-in.html'
                        }
                    }).catch(err => console.log(err))
}

function displayMeetups(meetupsList) {
    let meetCard = document.getElementById('main-card--id')
    let parent = document.getElementsByClassName('main-pane')[0]

    meetupsList.forEach(meetup => {
        var meetupCard = meetCard.cloneNode(true)
        console.log(meetupCard)
        createMeetupElements(meetupCard, 'meetup-title', meetup.title)
        createMeetupElements(meetupCard, 'meetup-location', meetup.location)
        createMeetupElements(meetupCard, 'maincard--card', meetup.images)
        createMeetupElements(meetupCard, 'owner', meetup.happening_on)
        createMeetupElements(meetupCard, 'see-more-mdetails', meetup.id)
        // createMeetupElements(meetup.tags)

        parent.appendChild(meetupCard)
        console.log(meetupCard)

    })
}

function createMeetupElements(meetupCard, classItem, detail) {
    /*
    Find child classes of meetup display card
    and appends new meetup data to them
    */

    card =  meetupCard.getElementsByClassName(classItem)[0]

    // Image
    if(classItem === 'maincard--card') {
        card.style.background = 'url(' + item[0] + ') center no-repeat'
        return
     }   
    if (classItem === 'see-more-mdetails') {
        card.addEventListener("click", () => {
            confirm("Sign in first")
        })
        return
    }
    if (classItem === 'meetup-title')
        card.href = 'meetup_questions.html'
    card.textContent = detail
}

function createMeetupNodes(meetupCard, element, item) {
    /* Appends meetup data to cloned card elements*/

      let filled = ''
      for (let i = meetupCard.childNodes.length - 1; i >= 0; i--) {

            if (meetupCard.childNodes[i].className === element) {
             if (element === 'maincard--card' && item === 'images') {
                filled = childNodes[i].style.background = 'url(' + item[0] + ') center no-repeat'
            } else if (element === 'see-more-mdetails') {
                childNodes[i].href = 'meetup_questions.html'
            }
             else
                filled = childNodes[i].textContent = item
            }
     }

}