const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// Register a new user.
public_users.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || username.trim() === '' ||
      typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  users.push({ username: username.trim(), password });
  return res.status(201).json({ message: 'User successfully registered.' });
});

// Get all available books.
public_users.get('/', (req, res) => res.status(200).json(books));

// Find a book by its ISBN/key.
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  return res.status(200).json({ [req.params.isbn]: book });
});

// Find books by author (case-insensitive partial match).
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) => book.author.toLowerCase().includes(author))
  );
  if (Object.keys(matches).length === 0) {
    return res.status(404).json({ message: 'No books found for that author.' });
  }
  return res.status(200).json(matches);
});

// Find books by title (case-insensitive partial match).
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) => book.title.toLowerCase().includes(title))
  );
  if (Object.keys(matches).length === 0) {
    return res.status(404).json({ message: 'No books found for that title.' });
  }
  return res.status(200).json(matches);
});

// Retrieve all reviews for a book.
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
