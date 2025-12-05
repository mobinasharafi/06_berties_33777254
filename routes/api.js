const express = require('express');
const router = express.Router();

const db = global.db;

// Query database to get all the books (now with optional ?search= and price filters)
router.get('/books', function (req, res, next) {

    // read optional search + trim spaces
    const search = req.query.search ? req.query.search.trim() : "";

    // read optional price filters
    const minprice = req.query.minprice ? parseFloat(req.query.minprice) : null;
    const maxprice = req.query.maxprice ? parseFloat(req.query.maxprice) : null;

    // start base query
    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

    // if user adds ?search= return only matching books
    if (search && search.length > 0) {
        sqlquery += " AND name LIKE ?";
        params.push(`%${search}%`);
    }

    // if user adds ?minprice= return only books above this
    if (minprice !== null && !isNaN(minprice)) {
        sqlquery += " AND price >= ?";
        params.push(minprice);
    }

    // if user adds ?maxprice= return only books below this
    if (maxprice !== null && !isNaN(maxprice)) {
        sqlquery += " AND price <= ?";
        params.push(maxprice);
    }

    // sort results if the user asks for it
    // ?sort=name → sort alphabetically by book name
    if (req.query.sort === 'name') {
        sqlquery += " ORDER BY name ASC";
    }

    // ?sort=price → sort from lowest price to highest
    // CAST() makes sure the price is treated as a number, not text
    if (req.query.sort === 'price') {
        sqlquery += " ORDER BY CAST(price AS DECIMAL(10,2)) ASC";
    }

    // Execute the sql query
    db.query(sqlquery, params, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err);
            return next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
