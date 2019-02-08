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

let handler = new Handler()


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
    let submitOption = document.getElementById('sign-up-button')
    submitOption.value = 'Signing up...'
    submitOption.disabled = true

    if (! validateRegPass(password, retypedPass)) {
        submitOption.value = 'Sign Up'
        submitOption.disabled = false
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
            submitOption.value = 'Sign Up'
            submitOption.disabled = false
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
let meetups = new Array()

findMeetupPages(meetupsDisplayPage)

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
                            //window.location.href = 'sign-in.html'
                        }
                    }).catch(err => console.log(err))
}

function showDashboardMeetups(cardTemplate, meetupsList) {
    /*
        Appends meetup details to display elements in the
        admin dashboard.
    */

    let parent = document.getElementsByClassName('meet-up-contents')[0]
    let noRecords = document.getElementById('no-records-admin-meetups')
    let imageUrls = ['default_meetup1.jpg',
                'default_meetup2.jpg',
                'default_meetup3.jpg',
                'default_meetup4.jpg']

    if (meetupsList.length === 0 && noRecords) {
        noRecords.style.display = 'block'
    } else {
        document.getElementById('footer-admin-dash').style.position = 'relative'
    }

    meetupsList.forEach(meetup => {
        let card = cardTemplate.cloneNode(true)
        let meetupTime = new Date(meetup.happening_on)
            .toString()
            .split(' ')
        let imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]
        let title = card.getElementsByClassName('meetup-link')[0]

        title.textContent = meetup.topic
        title.href = `meetup_questions.html?id=${meetup.id}`
        card.getElementsByClassName('acard-date')[0].textContent = meetupTime
            .slice(1, 3)
            .join(' ')
        card.getElementsByClassName('centre-photo')[0].src = `static/images/${imageUrl}`
        card.getElementsByClassName('edit-meets-location')[0].href = `edit_meetups.html?id=${meetup.id}`
        parent.appendChild(card)
        card.style.display = 'block'
    })
}

function displayMeetups(meetupsList) {
    let meetCard = document.getElementById('main-card--id')
    let adminCard = document.getElementById('inherit-admin-card')
    let parent = document.getElementsByClassName('main-pane')[0]
    let noRecords = document.getElementById('no-content-trending')
    if (meetupsList.length === 0 && noRecords) {
            noRecords.style.display = 'block'
    }

    if (adminCard)
        showDashboardMeetups(adminCard, meetupsList)


    meetupsList.forEach(meetup => {
        let meetupCard = meetCard.cloneNode(true)
        let day = new Date(meetup.happening_on)
            .toString()
            .split(' ')

        createMeetupElements(meetupCard, 'meetup-title', meetup.topic, meetup.id)
        createMeetupElements(meetupCard, 'meetup-location', meetup.location)
        createMeetupElements(meetupCard, 'maincard--card', meetup.images)
      
        /* Day Mon DD YYYY */
        createMeetupElements(meetupCard, 'owner', day.slice(0, 4).join(' '))
       
        /* Date Tag -->  DD Mon, YY */
        createMeetupElements(meetupCard, 'meetup-date-tag',
            day.slice(1, 3)
            .join(' ')
            + ', '
            + day[3]
            .slice(1, 3))
        createMeetupElements(meetupCard, 'see-more-mdetails', meetup.id)
        // createMeetupElements(meetup.tags)

        parent.appendChild(meetupCard)
        meetupCard.style.display = 'block'

    })
}

function createMeetupElements(meetupCard, classItem, detail, meetup_id) {
    /*
    Find child classes of meetup display card
    and appends new meetup data to them
    */

    card =  meetupCard.getElementsByClassName(classItem)[0]
    console.log(card)

    // Image
    if(classItem === 'maincard--card') {
        // Fails
        // Needs to store uploaded server images

        
        card.style.background = 'url(' 
        + detail[0].split(' ').shift() + ') center no-repeat'
        return
        
     } else if (classItem === 'see-more-mdetails') {
        card.href = `meetup_questions.html?id=${detail}`
        card.addEventListener("click", function() {
            // window.location.href = 'meetup_questions.html'
        })
        return
    } else if (classItem === 'meetup-title') {
        card.href = `meetup_questions.html?id=${meetup_id}`
        card.textContent = detail
        return
    } else
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

if (window.location.href.includes('meetup_questions.html')) {

    getSingleMeetup()
    // getMeetupQuestions()
} 

function getSingleMeetup() {
    /* Renders meetup details in meetup display page
    */

    let meetup_id = new URLSearchParams(window.location.search).get('id')
    handler.get(`meetups/${meetup_id}`)
        .then(response => response.json()
        .then (payload => ({status: response.status, body: payload})
        )).then (
        payload => {
            if (payload.status === 200) {
                meetup = payload.body.data
                displaySingleMeetup(meetup[0])
            } else {

            }
        }).catch(err => console.log(err))
}

function addNewTag(meetupId) {
    /**
        Sends a request to add a tag to a meetup item
    **/
    
    let newTag = document.getElementById('tag-input').value
    let data = {}
    const pattern = new RegExp('^[0-9]+$')

    if (! newTag || pattern.test(newTag))
        return

    handler.post(`meetup/${meetupId}/${newTag}`, data)
    .then(response => response.json()
        .then(payload => ({status: response.status, body: payload})
            )).then(payload => {
        console.log(payload)
        if (payload.status === 200) {
            updateTag(newTag)
        } else {
            
        }
    }).catch(err => console.log(err))


}


function updateTag(tag) {
    let tagELem = document.getElementById('mtag-inherit').cloneNode(true)
    let presentTags = document.getElementsByClassName('mmtags')

    for (let i = presentTags.length - 1; i >= 0; i--) {
        console.log(presentTags[i].textContent)
        if (presentTags[i].textContent === tag)
            return
    }
   
    tagELem.textContent = tag
    tagELem.href = `tagged_mmetups.html?tag=${tag}` 
    document.getElementById('tags-buttons').appendChild(tagELem)
    tagELem.style.display = 'inline-block'
}

function displaySingleMeetup(meetupItem) {
     let day = new Date(meetupItem.happeningOn)
            .toString()
            .split(' ')
    let parentTags = document.getElementById('tags-buttons')

    document.getElementsByClassName("meet-up-title")[0].textContent = meetupItem.topic
    document.getElementById('location-text').textContent = meetupItem.location
    document.getElementById('time-text').textContent = day.slice(0, 4).join(' ') + ', ' + day.slice(4, 5)
    document.getElementById('new-tag').addEventListener('click', () => addNewTag(meetupItem.id))

    meetupItem.tags.forEach(tag => {
        let tagELem = document.getElementById('mtag-inherit').cloneNode(true)
        
        tagELem.textContent = tag
        parentTags.appendChild(tagELem)
        tagELem.style.display = 'inline-block'
        })
}

function getMeetupQuestions() {
    /* Renders meetup questions in the question display area
    */

    let question_id = 1
    let meetup_id = new URLSearchParams(window.location.search).get('id')

    handler.get(`meetups/${meetup_id}/questions/${question_id}`)
        .then(response => response.json()
        .then (payload => ({status: response.status, body: payload})
        )).then (
        payload => {
            if (payload.status === 200) {
                questions = payload.body.data
                displayQuestions(questions)
            } else {

            }
        }).catch(err => console.log(err))
}

function displayQuestions(questionsList) {
    questionsList.forEach( question => {
        //
    })
}