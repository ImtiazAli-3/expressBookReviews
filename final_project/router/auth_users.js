const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return username && typeof username === 'string' && username.length > 0;
  }
  
  const authenticatedUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
  }
  
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({message: "Username and password required"});
    }
    
    if (authenticatedUser(username, password)) {
      let token = jwt.sign({username: username}, 'secret-key', {expiresIn: '1h'});
      req.session.authorization = {token};
      return res.status(200).json({token});
    }
    
    return res.status(401).json({message: "Invalid login. Check username and password"});
  });

  regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,accessToken
        }
        return res.status(200).json({message: "User successfully logged in", accessToken: accessToken});
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// In auth_users.js
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
    
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

// Task 10: Get all books (async)
const getAllBooks = async () => {
  try {
    const response = await axios.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 11: Get book by ISBN (async)
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 12: Get books by author (async)
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`/author/${author}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 13: Get books by title (async)
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`/title/${title}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
