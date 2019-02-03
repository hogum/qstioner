# qstioner
Questioner is a site that facilitates interactive crowd-sourcing of questions for a meet-up. Questioner helps the meetup organizer prioritize questions to be answered. Other users can vote on asked questions and they bubble at the top or bottom log.

## USER INTERFACE
### Set Up
- Create a new directory locally and open a terminal window from that folder
- Clone the repository
```shell
$ git clone https://github.com/hogum/qstioner.git
```
- Switch to the qstioner directory
```shell
$ cd qstioner-v2
```

### Starting the Interface
- The hosted testing interface can be accessed from [it's github-pages link](https://hogum.github.io/qstioner/)

Open the home page file from your terminal
``` shell
$ your_preferred_browser index.html"
```
If you prefer, you could navigate to the `qstioner` directory manually and load the `index.html` file

It should open on your default broswer

### Using the Application
#### Accounts

An account is required to get access to features of the application.
 - As a first time user, Navigate to the `sign up` page and fill in your desired account details.
 - Registred users have access to the `sign-in` button on the home page.
 - On successful registration or login, the application directs to a dashboard page, of either an Admin user or a normal user depending on the role registred.
 #### Users
 By default, all users are normal users. To change this for testing, a simple change can be made temporaily to the script in the `static/application.js` file.
 
 On the registerUser function, find the line `JSON.stringify` and add a statement `isAdmin: true,` beween the user details' statements.
 
 #### Adding Meetups
 Only an a user with admin privildeges can create a meetup on the apllication. This is a feature visible on the admin dashboard. 
