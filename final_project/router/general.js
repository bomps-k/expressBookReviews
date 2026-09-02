const express = require('express');

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