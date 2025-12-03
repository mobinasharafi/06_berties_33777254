// Create a new router
const express = require("express")
const bcrypt = require('bcrypt')
const router = express.Router()
const saltRounds = 10  

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {

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
    req.body.first,
    req.body.last,
    req.body.email,
    hashedPassword
];

db.query(sql, values, function(err, data) {
    if (err) throw err;
});

        // saving data in database

        let result = 'Hello ' + req.body.first + ' ' + req.body.last +
        ' you are now registered! We will send an email to you at ' + req.body.email;

        result += ' Your password is: ' + req.body.password +
        ' and your hashed password is: ' + hashedPassword;

        res.send(result);
    });
}); 
// Route to list all registered users
router.get('/list', function (req, res, next) {
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

                return res.send("Login successful!");
            } 
            else {
                // Incorrect password → failed login
                const logFailedAttempt = "INSERT INTO audit_log (username, success) VALUES (?, 0)";
                db.query(logFailedAttempt, [enteredUsername]);

                return res.send("Login failed: incorrect password");
            }

        });

    });

});
router.get('/audit', function (req, res, next) {

    const auditQuery = "SELECT * FROM audit_log ORDER BY timestamp DESC";

    db.query(auditQuery, function (err, logs) {
        if (err) throw err;

        res.render('audit.ejs', { logs: logs });
    });

});



// Export the router object so index.js can access it
module.exports = router
