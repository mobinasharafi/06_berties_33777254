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


// Export the router object so index.js can access it
module.exports = router
