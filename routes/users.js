// Create a new router
 const express = require("express")
 const bcrypt = require('bcrypt')
 const router = express.Router()
 const saltRounds = 10  
 const { check, validationResult } = require('express-validator');

 // redirectLogin Middleware (for Lab 8a)
 const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {       // if user isn't logged in
        res.redirect('/users/login'); // send the user to login page
    } else {
        next();                      // else continue normally
    }
 };

 router.get('/register', function (req, res, next) {
    res.render('register.ejs')
 })

 router.post(
    '/registered',

    // server side validation: 
    // Check that the email looks like a real email
    // and the username should be between 5 and 20 characters.
    [
    check('email').isEmail().withMessage('Invalid email format'),

    check('username')
        .isLength({ min: 5, max: 20 })
        .withMessage('Username must be 5–20 characters'),

    // Check password length (minimum 8 characters)
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
 ],


    function (req, res, next) {

    // Validate user input Lab 8bc
    const errors = validationResult(req);

    // LAB 8bc --> Sanitise user input to prevent XSS attacks
    req.body.first = req.sanitize(req.body.first);


    // If validation fails, go back to register page again with an error message
    if (!errors.isEmpty()) {
        return res.send("Validation failed: " + JSON.stringify(errors.array()));
    }

    // If validation passes, continue hashing the password
    const plainPassword = req.body.password;

    // Hashing the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {

        if (err) {
            return res.send("Error hashing password");
        }
        // Store hashed password and other user data in the database
 let sql = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
 let values = [
    req.body.username,

    // sanitizing first name to prevent XSS
    req.sanitize(req.body.first),
    // now task 7: sanitizing the last name and email as well
    req.sanitize(req.body.last),
    req.sanitize(req.body.email),
    hashedPassword
 ];

 db.query(sql, values, function(err, data) {
    if (err) throw err;
 });

        // saving data in database
        // sanitizing first name to prevent XSS lab 8bs
        // task 7: sanitizing last name and email as well
        let result = 'Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) +
        ' you are now registered! We will send an email to you at ' + req.sanitize(req.body.email);

        result += ' Your password is: ' + req.body.password +
        ' and your hashed password is: ' + hashedPassword;

        res.send(result);
    });
 }); 
 // Route to list all registered users
 router.get('/list', redirectLogin, function (req, res, next)
 {
    let sql = "SELECT username, first, last, email FROM users";

    db.query(sql, function (err, rows) {
        if (err) {
            return next(err);
        }

        res.render('listusers.ejs', { users: rows });
    });
});

// Users/login route in users.js
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});
router.post('/loggedin', function (req, res, next) {

    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    // finding a user with this username
    const lookupUserQuery = "SELECT hashedPassword FROM users WHERE username = ?";

    db.query(lookupUserQuery, [enteredUsername], function (err, foundUsers) {

        if (err) throw err;

        // No user found 
        if (foundUsers.length === 0) {

            const logFailedAttempt = "INSERT INTO audit_log (username, success) VALUES (?, 0)";
            db.query(logFailedAttempt, [enteredUsername]);

            return res.send("Login failed: username not found");
        }

        const storedHashedPassword = foundUsers[0].hashedPassword;

        // Compare passwords
        bcrypt.compare(enteredPassword, storedHashedPassword, function (err, passwordsMatch) {

             if (err) throw err;

             if (passwordsMatch) {
                // Correct password, login successful
                const logSuccess = "INSERT INTO audit_log (username, success) VALUES (?, 1)";
                db.query(logSuccess, [enteredUsername]);

                req.session.userId = enteredUsername;   // store user in session (Lab 8a)
                return res.redirect('/usr/455/');           // go to homepage on login

             } 
             else {
                // Incorrect password → failed login
                const logFailedAttempt = "INSERT INTO audit_log (username, success) VALUES (?, 0)";
                db.query(logFailedAttempt, [enteredUsername]);

                return res.send("Login failed: incorrect password");
            }

        });

    });

});   // THIS BRACKET WAS MISSING which was breaking the entire route


 router.get('/audit', redirectLogin, function (req, res, next) {

    const auditQuery = "SELECT * FROM audit_log ORDER BY timestamp DESC";

    db.query(auditQuery, function (err, logs) {
        if (err) throw err;

        res.render('audit.ejs', { logs: logs });
    });

 });

 // Logout Route (Lab 8a)

 router.get('/logout', (req, res) => {
    req.session.destroy(err => {   // remove session
        if (err) {
            return res.redirect('/'); 
        }
        res.clearCookie('connect.sid');  // remove cookie
        res.redirect('/users/login');    // go to login page
    });
 });

 // Export the router object so index.js can access it
 module.exports = router
