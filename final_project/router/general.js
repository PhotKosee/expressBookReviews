const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    resolve(res.send(JSON.stringify(books, null, 4)));
});

// Get the book list available in the shop using promise
public_users.get('/promise',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });
    get_books.then(function() {
        console.log("Promise is resolved");
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    resolve(res.send(JSON.stringify(books[isbn])));
});

// Get book details based on ISBN using promise
public_users.get('/promise/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(res.send(JSON.stringify(books[isbn])));
        }
        reject(res.send("This isbn does not exist "))
    });
    get_books_isbn.then(function() {
        console.log("Promise is resolved");
    }).catch(function () { 
        console.log("This isbn does not exist");
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filteredBooks = [];
    for (var book in books) {
        if (books[book].author == author) {
            filteredBooks.push(books[book]);
        }
    }
    res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get book details based on author using promise
public_users.get('/promise/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
        let booksByAuthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
                booksByAuthor.push({"isbn":isbn,
                                    "title":books[isbn]["title"],
                                    "reviews":books[isbn]["reviews"]});
            }
        });
        if (booksByAuthor.length > 0) {
            resolve(res.send(JSON.stringify({booksByAuthor}, null, 4)));
        }
        reject(res.send("This author does not exist"));
    });
    
    get_books_author.then(function() {
        console.log("Promise is resolved");
    }).catch(function () { 
        console.log("This author does not exist");
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filteredBooks = [];
    for (var book in books) {
        if (books[book].title == title) {
            filteredBooks.push(books[book]);
        }
    }
    res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title using promise
public_users.get('/promise/title/:title',function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
        let booksByTitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
                booksByTitle.push({"isbn":isbn,
                                    "author":books[isbn]["author"],
                                    "reviews":books[isbn]["reviews"]});
            }
        });
        if (booksByTitle.length > 0) {
            resolve(res.send(JSON.stringify({booksByTitle}, null, 4)));
        }
        reject(res.send("This title does not exist"));
    });
    
    get_books_title.then(function() {
        console.log("Promise is resolved");
    }).catch(function () { 
        console.log("This title does not exist");
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
