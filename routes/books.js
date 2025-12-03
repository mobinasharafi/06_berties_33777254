// Create a new router
const express = require("express")
const router = express.Router()
// add book to the database route
router.get('/addbook', function (req, res, next) {
  res.render('addbook.ejs')
})
// This route shows the "Add Book" form when visiting /books/add that didn't before
router.get('/add', function (req, res, next) {
  res.render('addbook.ejs');
});
// const db tp show the database
const db = global.db;

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

// Search for books by their titles
router.get('/search-result', function (req, res, next) {
    // Get the word typed by the user
  let typedWord = req.query.keyword;

  // look for books with similar titles that may contain the user's typed words
  let questionForDatabase = "SELECT * FROM books WHERE name LIKE ?";

  // this makes it match titles that contain the word typed by the user
      let wordInsideTitle = "%" + typedWord + "%";
  db.query(questionForDatabase, [wordInsideTitle], (err, matchingBooks) => {
    if (err) {
      next(err);
    } else {
      // show the results on the results page
      res.render("search-results.ejs", {
        booksFound: matchingBooks,
        keyword: typedWord
      });
    }
  });
});


// Route to show the books from the database, sends back the rows
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render("list.ejs", { availableBooks: result })
        }
    })
})
// Show books that cost less than £20
router.get('/bargainbooks', function (req, res, next) {

    // finding the books that cost under £20
    let findCostsUnder20 = "SELECT * FROM books WHERE price < 20"

    db.query(findCostsUnder20, (error, booksUnder20) => {
        if (error) {
            next(error)
        } else {
            // Render the bargainbooks page with our new list
            res.render("bargainbooks.ejs", { booksUnder20 })
        }
    })
})


// Export the router object so index.js can access it
module.exports = router
