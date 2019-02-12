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
        })
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
        })
    }

    delete(url) {
        return fetch(path + url, {
                method: 'DELETE',
                headers: {
                'Content-type': 'application/json',
                'Acess-Control-Allow-Origin': '*',
                'Acess-Control-Request-Method': 'DELETE',
                'Authorization': 'Bearer ' + this.retrieveToken()
            },
        })
}
    put(url, data) {
        let absPath = path + url        

        return fetch(absPath, {
                method: 'PUT',
                headers: {
                'Content-type': 'application/json',
                'Acess-Control-Allow-Origin': '*',
                'Acess-Control-Request-Method': 'PUT',
                'Authorization': 'Bearer ' + this.retrieveToken()
            },
            body : JSON.stringify(data)
        })
    }

    postImage(url, data) {
        let XHR = new XMLHttpRequest()
        let absPath = path + url
        let urlData = ""
        let urlPairs = []
        let item

        let formData = new FormData()

        for (item in data) {
            urlPairs.push(encodeURIComponent(item)
                + '='
                + encodeURIComponent(data[item]))
        }
        urlData = urlPairs.join('&').replace(/%20g/, '+')
        console.log(urlData)

        formData.append('image', data.image)

        XHR.addEventListener('load', ()=> {
            console.log('Data sent')
        })
        XHR.addEventListener('error', ()=> {
            console.log('Send data failed')
        })
        XHR.open('POST', path + url)
        XHR.setRequestHeader(
            "Content-Type", "application/x-www-form-urlencoded"
            )
        XHR.send(data)

        return fetch(absPath, {
                method: 'POST',
                headers: {
                'Authorization': 'Bearer ' + this.retrieveToken(),
                'Acess-Control-Allow-Origin': "http://localhost:5000"
            },
            body: formData
    })
    }

    patch (url, data) {
        let absPath = path + url        

        return fetch(absPath, {
                method: 'PATCH',
                headers: {
                'Content-type': 'application/json',
                'Acess-Control-Allow-Origin': '*',
                'Acess-Control-Request-Method': 'PATCH',
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

    saveItem(item, value) {
        return localStorage.setItem(item, value)
    }

    retrieveItem(item) {
        return localStorage.getItem(item)
    }

    removeItem(item) {
        return localStorage.removeItem(item)
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

    const protectedRoutes = ['create_meetup.html', 'user_page.html',
                             'admin_page.html', 'tagged_meetups.html',
                             'community.html']

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
clearSigninPrompts()
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

function clearSigninPrompts() {
    /*
        Removes sign in prompts for logged in user
    */

    if ((handler.getCurrentUser()) && (handler.getCurrentUser !== 'Guest')) {
        let signPrompt = document.getElementById('sign-in')

        if (signPrompt)
            signPrompt.style.display = 'none'
    }
}

function registerUser(event) {
    /*
        Posts user registration form details */

    event.preventDefault();

    let firstname = registrationForm.elements['name'].value
    let username = registrationForm.elements['username'].value
    let email = registrationForm.elements['email'].value
    let password = registrationForm.elements['password'].value
    let retypedPass = registrationForm.elements['confirm-password'].value
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

        let newUser = {
            "email": email,
            "password": password
        }

        // Sign in User
        handler.post('auth/login', newUser)
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
                        registrationForm.reset()
                        handler.saveItem('currentUser', user)
                        window.location.href = `${userPage}?user=${user}`
                        successMessage.style.display = 'none'
                    }, 00)
                }
            }).catch(err => console.log(err))

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
                        clearFilledForm(signInPage)
                        window.location.href = userPage;
                    }, 000)

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

function logoutUser() {
    /* 
        Logs out current user by clearing current localstorage
        auth details.
    */

    let logoutButton = document.getElementsByClassName('logoutdiv')[0]

    logoutButton.addEventListener('click', () => {
        handler.removeItem('userToken')
        handler.removeItem('currentUser')
        window.location.href = 'sign-in.html'
    })
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
    let description = meetupDetails.elements['description'].value
    happeningOn = day + 'T' + time + ':00'
    tags = tagsString.split(',')

    let data = {
        topic: topic,
        happeningOn: happeningOn,
        tags: tags,
        location: location,
        description: description
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
            let meetId = payload.body.data[0].id
            sendImage(meetId, images)
        } else {
            let msg = payload.body.message ? payload.body.message : payload.body.message[0]
            showMessage(warningMessage, msg, timeOut)
        }
    }).catch(err => console.log(err))
}

function sendImage(meetId, images) {
    /*  Uploads selected image file to meetup
        after meetup is created
    */

     handler.postImage(`meetups/${meetId}/images`, {image: images})
        .then(response => response.json()
                .then(payload => ({status: response.status, body: payload})
                )).then(payload => {
                if (payload.status === 200) {
                    // updateMeetupImages(payload.body.data)        
                } else {
                    
                }
            }).catch(err => console.log(err))
}

function addCloseOption() {
    let notificationButton = document.getElementById('meetup-notifcation--close-button')
        
    if (notificationButton){
        notificationButton.addEventListener("click", function(event) {
            document.getElementById('create-meetup--success').style.display = 'none'
        })
    }

    let editButton = document.getElementById('edit-meetup-success-close')
    
    if(editButton) {    
        editButton.addEventListener('click', () => {
            document.getElementById('meet-cred--success').style.display = 'none'
        })
    }
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

    if (! meetCard)
        return

    meetupsList.forEach(meetup => {
        let meetupCard = meetCard.cloneNode(true)
        let day = new Date(meetup.happening_on)
            .toString()
            .split(' ')

        createMeetupElements(meetupCard, 'meetup-title', meetup.topic, meetup.id)
        createMeetupElements(meetupCard, 'meetup-location', meetup.location)
        createMeetupElements(meetupCard, 'maincard--card', meetup.images)
        createMeetupElements(meetupCard, 'meetup-descript', meetup.description.slice(0, 130) + '...')
      
        /* Day Mon DD YYYY */
        createMeetupElements(meetupCard, 'owner', day.slice(0, 4).join(' '))
       
        /* Date Tag -->  DD Mon, YY */
        createMeetupElements(meetupCard, 'meetup-date-tag',
            day.slice(1, 3)
            .join(' ')
            + ', '
            + day[3]
            .slice(1, 3))
        createMeetupElements(meetupCard, 'see-more-mdetails', 'meet', meetup.id)
        // createMeetupElements(meetup.tags)

        parent.appendChild(meetupCard)
        meetupCard.style.display = 'block'

        itemsCh ++ // Counts child elements in meetup display
    })
    requestLogin()
}

function createMeetupElements(meetupCard, classItem, detail, meetup_id) {
    /*
    Find child classes of meetup display card
    and appends new meetup data to them
    */

    card =  meetupCard.getElementsByClassName(classItem)[0]

    // Image
    if(classItem === 'maincard--card') {
        // Fails
        // Needs to store uploaded server images

        
        if (detail) {
            card.style.background = 'url(' 
            + detail[0].split(' ').shift() + ') center no-repeat'
            return
        }
        
     } else if (classItem === 'see-more-mdetails') {
        card.href = `meetup_questions.html?id=${meetup_id}`
        card.addEventListener('click', () => {
             if ((!handler.getCurrentUser()) || (handler.getCurrentUser() === 'Guest')) {
                showJoinUsMod()
            }
        })
        return
    } else if (classItem === 'meetup-title') {
        card.href = `meetup_questions.html?id=${meetup_id}`
        card.textContent = detail
        card.addEventListener('click', () => {
             if ((!handler.getCurrentUser()) || (handler.getCurrentUser() === 'Guest')) {
                showJoinUsMod()
            }
        })
        return
    } else
        card.textContent = detail
}

function requestLogin() {
    let element =document.getElementsByClassName('meetup-title')
    let seeMeetupButtons = document.getElementsByClassName('see-more-mdetails')

    for (let i = element.length - 1; i >= 0; i--) {
        element[i].addEventListener('click', (event) => {
            event.preventDefault()

            if ((!handler.getCurrentUser()) || (handler.getCurrentUser() === 'Guest')) {
                showJoinUsMod()
            }
            else {
                window.location.href = element[i].href
            }
        })
    }

    for (let i = seeMeetupButtons.length - 1; i >= 0; i--) {
        seeMeetupButtons[i].addEventListener('click', (event) => {
            event.preventDefault()

            if ((!handler.getCurrentUser()) || (handler.getCurrentUser() === 'Guest')) {
                showJoinUsMod()
            } else {
                window.location.href = seeMeetupButtons[i].href
            }
        })
    }
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
    getMeetupQuestions()
    showRsvpStatus()
    createQuestion()
    postImageToMeetup()
}

if (window.location.href.includes('tagged_meetups.html')) {
    showTaggedMeetups()
}

if (window.location.href.includes('comment_question.html')) {
    showComments()
    submitComment()
}

if (window.location.href.includes('sign-up.html')) {
        getModalUser()
}

if (window.location.href.includes('user_page.html')) {
    displayUserRSVPMeetups()
}

if (window.location.href.includes('index.html') || window.location.href.includes('trending.html')) {
    requestLogin()
}

if (window.location.href.includes('admin_page.html') || window.location.href.includes('user_page.html')) {
    logoutUser()
}

if (window.location.href.includes('edit_meetups.html')) {
    editMeetups()
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
    tagELem.href = `tagged_meetups.html?tag=${tag}` 
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
    document.getElementById('submit-rsvp').addEventListener('click', () => sendRSVP(meetupItem.id))

    meetupItem.tags.forEach(tag => {
        let tagELem = document.getElementById('mtag-inherit').cloneNode(true)
        
        tagELem.textContent = tag
        tagELem.href = `tagged_meetups.html?tag=${tag}`
        parentTags.appendChild(tagELem)
        tagELem.style.display = 'inline-block'
        })
    if (meetupItem.images) {
        meetupItem.images.forEach(image => {
            let imageEl = document.getElementById('images-meetup-inherit').cloneNode(true)
            imageEl.src = image
            document.getElementById('meetup-images').appendChild(imageEl)
        })
    }
}

function getMeetupQuestions() {
    /* Renders questions to a meetup in the question display area
    */

    let meetup_id = new URLSearchParams(window.location.search).get('id')

    handler.get(`meetups/${meetup_id}/questions`)
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
    /*
        Renders details of each fetched question to the
        question display elements.
    */

    let title = document.getElementById('question-card-inherit')
    let parent = document.getElementById('meetup-ques-display')

    if (questionsList.length === 0) {
        document.getElementById('no-questions-records').style.display = 'block'
        return
    }

    questionsList.forEach(question => {
        let qsCard = title.cloneNode(true)
        let body = qsCard.getElementsByClassName('question-body-cl')[0]
        let tags = qsCard.getElementsByClassName('qtags')

        body.textContent = question.body.slice(0, 220) + '...'
        body.href = `comment_question.html?question=${question.id}&title=${question.title}`
        qsCard.getElementsByClassName('up-vote')[0].addEventListener(
            'click', () => sendVote(question.id, 'upvote'))
        qsCard.getElementsByClassName('down-vote')[0].addEventListener(
            'click', () => sendVote(question.id, 'downvote'))
        qsCard.getElementsByClassName('vote-count')[0].textContent = question.votes

        for (let i = tags.length - 1; i >= 0; i--) {
            let word = 
            tags[i].textContent = question.title
            .split(' ')[
            Math.floor(Math.random() * tags.length)]
        }
        parent.appendChild(qsCard)
        qsCard.style.display = 'block'
    })
}

function sendVote(qId, vote) {
    /*
        Sends a PATCH request to UPvote or DOWN vote a particular
        question.
    */

    handler.patch(`questions/${qId}/${vote}`)
    .then(response => response.json()
        .then (payload => ({status: response.status, body: payload})
        )).then (
        payload => {
            console.log(payload)
            if (payload.status === 200) {
                window.location.reload()
            } else {

            }
        }).catch(err => console.log(err))
}

function showTaggedMeetups() {
    let meetupTag = new URLSearchParams(window.location.search).get('tag')
    document.getElementById('tag-title-text').textContent = `${meetupTag} Meetups`

    handler.get(`meetup/${meetupTag}`)
    .then(response => response.json()
        .then (payload => ({status: response.status, body: payload})
        )).then (
        payload => {
            if (payload.status === 200) {
                let meetups = payload.body.data
                displayMeetups(meetups)
            } else {

            }
        }).catch(err => console.log(err))
}

function sendRSVP(meetupId) {
    /*
        POSTs a user RSVP to a meetup
    */
    let rsvp = document.getElementById('select-rs').value
    let rsvpEl = document.getElementById('current-rsvp')
    let data = {'response': rsvp}

    handler.post(`meetups/${meetupId}/response`, data)
    .then(response => response.json()
        .then(payload => ({status: response.status, body: payload})
            )).then(payload => {
        if (payload.status === 201) {
            document.getElementById('current-rsvp').textContent = rsvp
            localStorage.setItem('meetupRSVP', rsvp)
            styleRsvpDisplay(rsvpEl, rsvp)
        } else if (payload.status === 409){
            rsvpEl.textContent = rsvp
            styleRsvpDisplay(rsvpEl, rsvp)
        }
    }).catch(err => console.log(err))
}

function showRsvpStatus() {
    /*Get rsvp of current logged in user*/
    let rsvpEl = document.getElementById('current-rsvp')
    let response = localStorage.getItem('meetupRSVP')
    
    if(response) {
        rsvpEl.textContent = response
        styleRsvpDisplay(rsvpEl, response)
    }
}

function styleRsvpDisplay(rsvpItem, answer) {
    /*
        Changes color of user rsvp depending on
        given response.
    */

    let ans = answer.toLowerCase()

    if (ans === 'yes')
        rsvpItem.style.color = '#098903'
    else if (ans === 'no')
        rsvpItem.style.color = '#B31100'
    else
        rsvpItem.style.color = '#C07D07'
}

function createQuestion() {
        let send = document.getElementsByClassName('createq-holder')[0]


    send.addEventListener('click', () => {
        let text = document.getElementById('text-question').value
        let meetupId = new URLSearchParams(window.location.search).get('id')
        let data = {
            title: text.split(' ').slice(0, 50).join(' '),
            body: text}

        handler.post(`meetups/${meetupId}/questions`, data)
            .then(response => response.json()
                .then(payload => ({status: response.status, body: payload})
                )).then(payload => {

                if (payload.status === 201) {
                   showQuestionError("Question Created", 'success')
                   setTimeout(() => {
                    window.location.reload()
                   }, 3000)
                } else if(payload.status === 409){
                    let msg = "You've posted this question"
                    showQuestionError(msg)                    
                } else {
                    showQuestionError("Just enter something readable, cool?")
                }

            }).catch(err => console.log(err))
    })
}

function showQuestionError(msg, success) {
    let elem = document.getElementById('invalidq')
    elem.style.visibility = 'visible'
    let txt = document.getElementById('invalidq-entry')

    txt.textContent = msg
    if (success) {
        document.getElementById('invalidq-entry').style.color = '#5ECDEF'
        elem.style.border = '1px solid #9FE7FD'
    }

    setTimeout(() => {
        elem.style.visibility = 'hidden'
        
        txt.style.color = '#8A0000'
        elem.style.border = '1px solid #E76200'

    }, 3000)
}

function showComments() {
    /*
        Fetches comments all comments to a question.
    */

    let question_id = new URLSearchParams(window.location.search).get('question')

     handler.get(`questions/${question_id}/comment`)
    .then(response => response.json()
        .then(payload => ({status: response.status, body: payload})
            )).then(payload => {
        if (payload.status === 200) {
            displayComments(payload.body.data)
        } else {
        
        }
    }).catch(err => console.log(err))
}

function displayComments(commentList) {
    /*
        Renders details of each fetched comment to the
        comments display page.
    */

    let title = document.getElementById('comments-inherit')
    let parent = document.getElementById('comments-cont')
    let qtitle = new URLSearchParams(window.location.search).get('title')
    let qId = new URLSearchParams(window.location.search).get('question')

    document.getElementById('com-header').textContent = qtitle

    if (commentList.length === 0) {
        document.getElementsByClassName('no-comments-rec')[0].style.display = 'block'
        return
    }

    commentList.forEach(comment => {
        let cCard = title.cloneNode(true)
        let body = cCard.getElementsByClassName('comment-text')[0]

        body.textContent = comment.body
        parent.appendChild(cCard)
        cCard.style.display = 'block'
        })

    document.getElementById('footer-cq').style.position = 'relative'
}

function submitComment() {
     let send = document.getElementById('send-comment')
     let questId = new URLSearchParams(window.location.search).get('question')

    send.addEventListener('click', () => {
        let questId = new URLSearchParams(window.location.search).get('question')
        let text = document.getElementById('text--comment').value
        let data = {body: text}

        handler.post(`questions/${questId}/comment`, data)
            .then(response => response.json()
                .then(payload => ({status: response.status, body: payload})
                )).then(payload => {
                console.log(payload)
                if (payload.status === 201) {
                    window.location.reload()
                } else {
                    showQuestionError("Just enter something readable, cool?")
                }

            }).catch(err => console.log(err))
    })
}

let itemPane = document.getElementsByClassName("main-pane")[0]
let itemsCh

if (itemPane){
    itemsCh = itemPane.childElementCount
    itemPane.addEventListener('scroll', listenForScroll)
}

function listenForScroll(event) {
    /*
        Appends child meetup display elements in container for infinite scroll
    */
    let parent = document.getElementsByClassName("main-pane")[0]
    let child = 1
    for (let i = 1; i<= itemsCh; i++) {
        child = i
       let newDiv = document.querySelector(`.main-pane > div:nth-child(${child})`).cloneNode(true)
       parent.appendChild(newDiv)
   }
  let lastDiv = document.querySelector(".main-pane > div:last-child")
  let maindiv = document.querySelector(".main-pane");
  let lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight
  let pageOffset = maindiv.offsetTop + maindiv.clientHeight

  console.log('divo', lastDivOffset)
  if(lastDivOffset >= 50000)
    showJoinUsMod()
}

function showJoinUsMod() {
    /*
        Displays registration prompt Modal to new user.
    */

    if ((handler.getCurrentUser()) && (handler.getCurrentUser !== 'Guest'))
        return

    let Signmodal = document.getElementsByClassName('wrapper-sign-in-mod')[0]
    let closeButton = document.getElementById('mod--close-button')

    Signmodal.style.opacity = '1'
    Signmodal.style.visibility = 'visible'

    closeButton.addEventListener(
        'click', () => {
            Signmodal.style.opacity = '0'
            // Signmodal.style.display = 'none'
            Signmodal.style.visibility = 'hidden'
        })
    let submitButton = document.getElementById('sign-in-modal-button')

    submitButton.addEventListener('click', () => submitModal())
}

function submitModal() {
    /*
        Sends submit requests to register new user.
    */
    let userEmail = document.getElementById('email-mod').value
    if (! userEmail) {
        return false
    }
    
    handler.saveItem('modalUser', userEmail)
    document.getElementsByClassName('wrapper-sign-in-mod')[0].style.opacity = '0'
    document.getElementsByClassName('wrapper-sign-in-mod')[0].style.visibility = 'hidden'
    window.location.href = 'sign-up.html'
}

function getModalUser() {
    /*
        Assigns given email in modal form to user registration form
    */

    let userEmail = handler.retrieveItem('modalUser')
    if(userEmail) {
        let regForm = document.getElementById('registration-form')
        regForm.elements['email'].value = userEmail
        localStorage.removeItem('modalUser')
    }
}

function postImageToMeetup() {
    /*
        Adds images to an existing meetup records
    */
    let meetupId = new URLSearchParams(window.location.search).get('id')
    let upload = document.getElementById('new-meet-img')

    upload.onchange = () => {
        handler.postImage(`meetups/${meetupId}/images`, {image: upload.files[0]})
            .then(response => response.json()
                .then(payload => ({status: response.status, body: payload})
                )).then(payload => {
                if (payload.status === 200) {
                    updateMeetupImages(payload.body.data)        
                } else {
                    
                }

            }).catch(err => console.log(err))
    }
}

function updateMeetupImages(image) {
    /*
        Updates uploaded image to present meetups
        display images.
    */

    let element = document.getElementById('images-meetup-inherit').cloneNode(true)
    
    element.src = image
    document.getElementById('meetup-images').appendChild(element)
}

function displayUserRSVPMeetups() {
    /*
        Displays meetups user has RSVP-ed for on the 
        uuser dashboard.
    */ 
    let user = handler.getCurrentUser()

    if(! user) {
        user = new URLSearchParams(window.location.search).get('user')
    }

    handler.get(`meetups/${user}/rsvp`)
    .then(response => response.json()
                .then(payload => ({status: response.status, body: payload})
                )).then(payload => {
                if (payload.status === 200) {
                    displayUserMeetups(payload.body.data)        
                } else {
                    
                }

            }).catch(err => console.log(err))
}

function displayUserMeetups(Useritems) {
    /*
        Renders user rsvp-ed meetups in
        user dashboard
    */

    let card = document.getElementById('user-dashcard--inherit').cloneNode('true')
    let parent = document.getElementById('user-card--parent')

    if (Useritems.length === 0) {
        document.getElementById('no-records-user-meetups').style.display = 'block'
        return
    }

    Useritems.forEach(response => {
        let card = document.getElementById('user-dashcard--inherit').cloneNode('true')
        let day = new Date(response[1].happeningOn)
            .toString()
            .split(' ')
        let mId = response[1].id
        let title = card.getElementsByClassName('meetup-title-user')[0]
        let rsvp = card.getElementsByClassName('rsvp-user-res')[0]

        title.textContent = response[1].topic
        title.href = `meetup_questions.html?id=${mId}`
        card.getElementsByClassName('acard-date')[0].textContent = day.slice(0, 3).join(' ')
        card.getElementsByClassName('edit-meetup-button')[0].href = `edit_meetups.html?id=${mId}`
        rsvp.textContent = response[0]

        styleRsvpDisplay(rsvp, response[0])
        parent.appendChild(card)
        card.style.display = 'block'
        document.getElementById('user-page-footer').style.position = 'relative'

    })

}

function editMeetups() {
    /*Allows users to make changes to existing meetup
    details
    */

    let editButton = document.getElementsByClassName('edit-meetup-item')[0]
    let delButton = document.getElementById('del-button')
    let meetDetail = document.getElementsByClassName('descr--meet')[0]
    let meetTitle = document.getElementsByClassName('del-text-display')[0]
    let mId = new URLSearchParams(window.location.search).get('id')
    
    handler.get(`meetups/${mId}`)
    .then(response => response.json()
        .then(payload => ({status: response.status, body: payload})
            )).then (payload => {
            if(payload.status === 200) {
                meetTitle.textContent = payload.body.data[0].topic
                meetDetail.textContent = payload.body.data[0].description
                meetUp = payload.body.data[0]
                editButton.addEventListener('click',(event) =>
                    showEditForm(meetUp))
                delButton.addEventListener('click', function(event) {
                    confirmUserOption(deleteMeetup, mId)
                })
            }
    }).catch(err => console.log(err))
}

function deleteMeetup(meetId) {
    /*Deletes selected meetup Item*/

    // Show confirm delete modal
    let successMessage = document.getElementById('meet-cred--success')

    handler.delete(`meetups/${meetId}`)
    .then(response => response.json()
        .then(payload => ({status: response.status, body: payload})
            )).then (payload => {
        console.log(payload)
            if(payload.status === 200) {
                // Show success message
                 successMessage.style.display = 'block'
                 addCloseOption()

            } else {

                // oops! something misbehaved
                successMessage.textContent = 'Your meetup seems to have relations'
                successMessage.style.display = 'block'
                successMessage.style = 'color: #FF6347; border-color: #FF6347;'
            }

    }).catch(err => console.log(err))
}

function updateMeetup(event) {
        event.preventDefault()

        let meetupItem = new URLSearchParams(window.location.search).get('id')
        let submitButt = document.getElementById('sign-up-button')
        let editForm = document.getElementById('meetup-edit--create')
        let topic = editForm.elements['name'].value
        let day = editForm.elements['date'].value
        let time = editForm.elements['time'].value
        let location = editForm.elements['location'].value
        let description = editForm.elements['description'].value
        let happeningOn = day + 'T' + time + ':00'
        // let tags = editForm.elements['tag'].value.split(',')

        let data = {
            topic: topic,
            happeningOn: happeningOn,
            location: location,
            description: description
        }
        console.log(data)

        handler.put(`meetups/${meetupItem}`, data)
        .then(response => response.json()
            .then(payload => ({status: response.status, body: payload})
                )).then (payload => {
                let successMessage = document.getElementById('meet-cred--success')
                let errMessage = document.getElementById('meet-cred--warning')
                console.log(payload)
                if(payload.status === 200) {
                    submitButt.disabled = false
                    errMessage.style.display = 'none'
                    successMessage.style.display = 'block'

                    addCloseOption()
                    document.getElementsByClassName('wrapper-sign-in')[0].style.display = 'none'


                } else {

                    errMessage.textContent = payload.body.message ? payload.body.message : payload.body.message[0]
                    errMessage.style.display = 'block'
                    submitButt.disabled = false

                    setTimeout(() => {
                        errMessage.style.display = 'none'
                    }, 5000)
                }

        }).catch(err => console.log(err))
}

let editForm = document.getElementById('meetup-edit--create')

if(editForm)
    editForm.addEventListener("submit", updateMeetup)

function showEditForm(meetupItem) {
    /*   Allows users to enter new details to
        making changes to meetuo details.
    */

    let editForm = document.getElementById('meetup-edit--create')
    let time = meetupItem.happeningOn.split('T')

    //document.getElementsByClassName('wrapper-sign-in')[0].addEventListener('click', () => {
     //   document.getElementsByClassName('wrapper-sign-in')[0].style.display = 'none'
    // })

    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.getElementsByClassName('wrapper-sign-in')[0].style.display = 'none'
    })

    document.getElementsByClassName('wrapper-sign-in')[0].style.display = 'block'
    editForm.elements['name'].value = meetupItem.topic
    editForm.elements['date'].value = time[0]
    editForm.elements['time'].value = time[1].toString().slice(0, -3)
    editForm.elements['description'].value = meetupItem.description
    editForm.elements['location'].value = meetupItem.location
    // editForm.elements['tag'].value = meetupItem.tags.toString()

    let submitButt = document.getElementById('sign-up-button')
    
    /*editForm.addEventListener('submit', () => (event) => {

        let topic = editForm.elements['name'].value
        let day = editForm.elements['date'].value
        let time = editForm.elements['time'].value
        let location = editForm.elements['location'].value
        let description = editForm.elements['description'].value
        let happeningOn = day + 'T' + time + ':00'
        // let tags = editForm.elements['tag'].value.split(',')

        let data = {
            topic: topic,
            happeningOn: happeningOn,
            location: location,
            description: description
        }
        
        handler.post(`meetups/${meetupItem.id}`, data)
        .then(response => response.json()
            .then(payload => ({status: response.status, body: payload})
                )).then (payload => {
                let successMessage = document.getElementById('meet-cred--success')
                let errMessage = document.getElementById('meet-cred--warning')
                console.log(payload)
                if(payload.status === 200) {
                    submitButt.disabled = false
                    errMessage.style.display = 'none'
                    successMessage.style.display = 'block'

                    setTimeout(() => {
                        successMessage.style.display = 'none'
                    })
                } else {

                    errMessage.textContent = payload.body.message ? payload.body.message : payload.body.message[0]
                    errMessage.style.display = 'block'
                    submitButt.disabled = false

                    setTimeout(() => {
                        errMessage.style.display = 'none'
                    })
                }

        }).catch(err => console.log(err))
    })*/
}

function confirmUserOption(fun, mId) {
    /*
        Shows confirmation dialogue to user
    */

    let confirmModal = document.getElementsByClassName('wrapper-sign-in-mod')[0]
    let no = document.getElementById('sign-in-modal-button-no')
    let yes = document.getElementById('sign-in-modal-button-yes')

    confirmModal.style.visibility = 'visible'
    confirmModal.style.opacity = '1'

    no.addEventListener('click', () => {
        hideConfirmModal()
        return false
    })
    yes.addEventListener('click', () => {
        hideConfirmModal()
        fun(mId)
    })
}

function hideConfirmModal() {
    /*Hides confrimation dialogue on user input*/
    let element = document.getElementsByClassName('wrapper-sign-in-mod')[0]

    element.style.visibility = 'hidden'
    element.style.opacity = '0'
}