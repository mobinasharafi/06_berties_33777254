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
