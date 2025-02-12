
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching all books');
  }
}

// Task 11
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching book by ISBN');
  }
}

// Task 12
async function getBookByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching books by author');
  }
}

// Task 13
async function getBookByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching books by title');
  }
}

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({message: "Username and password required"});
    }
    
    if (users.find(user => user.username === username)) {
      return res.status(409).json({message: "Username already exists"});
    }
    
    users.push({ username, password });
    return res.status(200).json({message: "User successfully registered"});
  });

public_users.get('/', function (req, res) {
    res.json(books);
  });

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksForAuthor = Object.values(books).filter(book => book.author === author);
    if (booksForAuthor.length > 0) {
      res.json(booksForAuthor);
    } else {
      res.status(404).json({message: "No books found for this author"});
    }
  });

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const titleBooks = bookKeys
    .filter(isbn => books[isbn].title === title)
    .map(isbn => books[isbn]);
  
  return res.status(200).json(titleBooks);
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
      res.json(books[isbn].reviews);
    } else {
      res.status(404).json({message: "No reviews found for this book"});
    }
  })

module.exports.general = public_users;
