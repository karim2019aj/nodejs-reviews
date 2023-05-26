const express = require('express');
const mysql = require('mysql');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'feedbackdb',
});


const app = express();

// All reviews endpoint
app.get('/reviews', (req, res) => {
    // Acquire a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database: ', err);
            return res.status(500).json({ error: 'Database connection error' });
        }

        // Query to fetch all reviews
        const query = 'SELECT * FROM reviews';

        // Execute the query
        connection.query(query, (err, results) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error executing the query: ', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            // Modify the format of the reviews
            const modifiedReviews = results.map((review) => {
                return {
                    id: review.id,
                    appID: review.appID,
                    appStoreName: review.appStoreName,
                    reviewDate: review.reviewDate,
                    rating: review.rating,
                    version: review.version,
                    countryName: review.countryName,
                    reviewHeading: review.reviewHeading,
                    reviewText: review.reviewText,
                    reviewUserName: review.reviewUserName,
                };
            });

            // Send the reviews as a JSON response
            res.json(modifiedReviews);
        });
    });
});

// Search endpoint
app.get('/reviews/search', (req, res) => {
    const searchQuery = req.query.query;

    // Acquire a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database: ', err);
            return res.status(500).json({ error: 'Database connection error' });
        }

        // Query to search for reviews
        const searchQuery = req.query.query;
        const searchSql = `SELECT * FROM reviews WHERE reviewHeading LIKE '%${searchQuery}%' OR reviewText LIKE '%${searchQuery}%'`;

        // Execute the search query
        connection.query(searchSql, (err, results) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error executing the search query: ', err);
                return res.status(500).json({ error: 'Database query error' });
            }

            // Send the search results as a JSON response
            res.json(results);
        });
    });
});

//  Filter endpoint
app.get('/reviews/filter', (req, res) => {
    const { appID, appStoreName, rating, countryName } = req.query;

    // Build the filter query dynamically based on the provided criteria
    let filterQuery = 'SELECT * FROM reviews WHERE 1=1';
    let filterParams = [];

    if (appID) {
        filterQuery += ' AND appID = ?';
        filterParams.push(appID);
    }

    if (appStoreName) {
        filterQuery += ' AND appStoreName = ?';
        filterParams.push(appStoreName);
    }

    if (rating) {
        filterQuery += ' AND rating = ?';
        filterParams.push(rating);
    }

    if (countryName) {
        filterQuery += ' AND countryName = ?';
        filterParams.push(countryName);
    }

    // Acquire a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database: ', err);
            return res.status(500).json({ error: 'Database connection error' });
        }

        // Execute the filter query
        connection.query(filterQuery, filterParams, (err, results) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error executing the filter query: ', err);
                return res.status(500).json({ error: 'Database query error' });
            }

            // Send the filtered results as a JSON response
            res.json(results);
        });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});