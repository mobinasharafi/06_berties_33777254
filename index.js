// dotenv for environment variables
require('dotenv').config();
// Import express, ejs, path, mysql
var express = require('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')
// Lab 8a task 1: Import express-session
var session = require('express-session') 
// Import express-sanitizer
const expressSanitizer = require('express-sanitizer');
// Create the express application object
const app = express()
const port = 8000
// Use express-sanitizer Middleware (for Lab 8bc)
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
//Lab 9a: Import and use the weather route
app.use('/', require('./routes/weather'));
// Connect to the database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
global.db = db

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Session Middleware (for Lab 8a)
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // fixing the req.session undefined
}));

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Define our application-specific data
app.locals.shopData = { shopName: "Bertie's Books" }

// Load the route handlers for /
const mainRoutes = require('./routes/main')
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

// Load the route handlers for /api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))