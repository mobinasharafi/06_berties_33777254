# Berties Books

A complete implementation of Lab 6abc - d - ef for the Dynamic Web Applications module. followed by Lab 7 instructions and extensions.
The project is meant to use Node.js, Express, EJS, and MySQL to create a structured web application for a book store managing the customer needs.

What the app actually does

. Displays all books stored in the database

. Books can be added via a simple form

. Searches titles using both exact and partial matching (whether D is entered or Dorian, refers the customer to the book The Picture of Dorian Grey)

. Shows all books that under cost £20

. Uses consistent, minimal EJS templates

. Is meant to run on the Goldsmiths VM with forever

Main Routes are:

/books/list

/books/addbook

/books/search

/books/search-result

/books/bargainbooks

for Lab 7 instructions and extensions: 

/users/register

/users/registered

/users/login

/users/loggedin

/users/list

/users/audit

To install and run:

npm install
node index.js

Lab 7
## dotenv
The dotenv module to keep the database credentials out of the source code. 
The credentials are stored in a .env file and loaded using require('dotenv').config() 
so they are not exposed in the repository.

## password hashing
Bcrypt to hash user passwords before storing them into the database. 
Only the hashed password is saved, never the plain password.


## audit
To keep track of login activity, I added an audit_log table to store each login attempt along with 
whether it was successful or not. The /users/audit route shows all of these attempts in a list.

Lab 8a
this lab lead us to add basic login protection to the app.
I used express-session to keep track of the logged-in user, and created a small middleware function that blocks certain pages unless you’re logged in (pages like /list can only be seen after a successful login, while pages like /login and /register stay open to everyone.)

Lab 8bc
The following rules were enforced: Email must be a valid email format: check('email').isEmail() Username must be 5–20 characters Password must be at least 8 characters long If validation fails, the user is redirected back with an error message. Sanitisation in order to protect the application from XSS, the express-sanitizer middleware was added in index.js and sanitised user input inside /users/registered. I sanitised: First name (as required to demonstrate XSS) Last name Email (I did it however it was not necessary since the email authentication process does not accept symbols such as >) Example: req.body.first = req.sanitize(req.body.first) I tested XSS by entering: Henry .<script>alert("Gothca!")</script> Before sanitisation, the alert executed. After sanitisation, the alert did not execute, proving that user input is cleaned before being displayed. I then added sanctions for last name, username as well as the email. I could have removed the email sanitisation since the email verification does not allow for symbols to be entered either way.

Lab 9a
In Lab 9a, we were instructed to add a /weather route that calls the OpenWeatherMap API using the request module. The route accepts a city parameter (default set to: London), parses the JSON response, and renders a compact weather card (temperature, description, humidity, sunrise/sunset, and a weather icon). Invalid parameters for location are returned with a simple fallback view instead of breaking the app, so the route stays functional even when the API may return an error.