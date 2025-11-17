const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and/or password not provided"});
  }
  
  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Add new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop using Promise callbacks or async-await with Axios
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    // Using async-await with Promise (Axios-style pattern)
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        // Simulate async operation similar to axios.get()
        setTimeout(() => {
          resolve({ data: books });
        }, 0);
      });
    };
    
    // Using async-await pattern (similar to axios.get().then())
    const response = await getBooks();
    const booksData = response.data;
    
    res.type('json');
    return res.status(200).send(JSON.stringify(booksData, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    // Using async-await with Promise (Axios-style pattern)
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        // Simulate async operation similar to axios.get()
        setTimeout(() => {
          if (books[isbn]) {
            resolve({ data: books[isbn] });
          } else {
            reject({ status: 404, message: "Book not found" });
          }
        }, 0);
      });
    };
    
    // Using async-await pattern (similar to axios.get().then())
    const response = await getBookByISBN(isbn);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({message: error.message});
    }
    return res.status(500).json({message: "Error fetching book", error: error.message});
  }
 });
  
// Get book details based on author using Promise callbacks or async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    
    // Using async-await with Promise (Axios-style pattern)
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        // Simulate async operation similar to axios.get()
        setTimeout(() => {
          const matchingBooks = {};
          const keys = Object.keys(books);
          
          for (let i = 0; i < keys.length; i++) {
            const isbn = keys[i];
            if (books[isbn].author === author) {
              matchingBooks[isbn] = books[isbn];
            }
          }
          
          if (Object.keys(matchingBooks).length > 0) {
            resolve({ data: matchingBooks });
          } else {
            reject({ status: 404, message: "No books found for this author" });
          }
        }, 0);
      });
    };
    
    // Using async-await pattern (similar to axios.get().then())
    const response = await getBooksByAuthor(author);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({message: error.message});
    }
    return res.status(500).json({message: "Error fetching books by author", error: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = {};
  const keys = Object.keys(books);
  
  for (let i = 0; i < keys.length; i++) {
    const isbn = keys[i];
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
