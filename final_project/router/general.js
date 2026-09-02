const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;

let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn]));
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = {};

    const keys = Object.keys(books);

    for (let i = 0; i < keys.length; i++) {
        const isbn = keys[i];

        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    }

    res.send(JSON.stringify(result));
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = {};

    const keys = Object.keys(books);

    for (let i = 0; i < keys.length; i++) {
        const isbn = keys[i];

        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    }

    res.send(JSON.stringify(result));
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews));
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


module.exports.general = public_users;


// ---------------------------------------------------------------------
// Tasks 10–13: same functionality as Tasks 1–4 above, but implemented
// using Promise callbacks / async-await with Axios instead of
// synchronous direct lookups on the `books` object.
// Base URL assumes the server from index.js is running on port 5000.
// ---------------------------------------------------------------------

const BASE_URL = "http://localhost:5000";


// Task 10: Get the list of books available in the shop – using async/await
async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("All books:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching all books:", error.message);
    }
}


// Task 11: Get book details based on ISBN – using Promise callbacks (.then/.catch)
function getBookByISBN(isbn) {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            console.log("Book by ISBN:", response.data);
            return response.data;
        })
        .catch((error) => {
            console.log("Error fetching book by ISBN:", error.message);
        });
}


// Task 12: Get book details based on Author – using async/await
async function getBookByAuthor(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        console.log("Books by author:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching books by author:", error.message);
    }
}


// Task 13: Get book details based on Title – using Promise callbacks (.then/.catch)
function getBookByTitle(title) {
    return axios.get(`${BASE_URL}/title/${title}`)
        .then((response) => {
            console.log("Books by title:", response.data);
            return response.data;
        })
        .catch((error) => {
            console.log("Error fetching books by title:", error.message);
        });
}


module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;