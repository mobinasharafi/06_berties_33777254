# Berties Books

A complete implementation of Lab 6abc - d - ef for the Dynamic Web Applications module.
The project is meant to use Node.js, Express, EJS, and MySQL to create a structured web application for a book store managing the customer needs.

What the app actually does

. Displays all books stored in the database

. Books can be added via a simple form

. Searches titles using both exact and partial matching (whether D is entered or Dorian, refers the customer to the book The Picture of Dorian Grey)

. Shows all books that under cost £20

. Uses consistent, minimal EJS templates

. Is meant to run on the Goldsmiths VM with forever

extra note: MySQL couldn’t be installed on the VM due to server restrictions.
Everything database-related was implemented and tested locally; the full logic is in place even if the VM did not allow the SQL for installation.

Main Routes are:

/books/list

/books/addbook

/books/search

/books/search-result

/books/bargainbooks

To install and run:

npm install
node index.js
