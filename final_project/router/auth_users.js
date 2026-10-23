const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();
const users = [];

// Returns true when the username has already been registered.
const isValid = (username) => users.some((user) => user.username === username);

const authenticatedUser = (username, password) =>
  users.some((user) => user.username === username && user.password === password);

// Only registered users can log in.
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });
  return res.status(200).json({
    message: 'User successfully logged in.',
    token
  });
});

// Add or update a review for a book. The index.js middleware verifies the JWT first.
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body || {};
  const username = req.user && req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  if (typeof review !== 'string' || review.trim() === '') {
    return res.status(400).json({ message: 'A non-empty review is required.' });
  }

  books[isbn].reviews[username] = review.trim();
  return res.status(200).json({
    message: 'Review added/updated successfully.',
    reviews: books[isbn].reviews
  });
});

// Delete the signed-in user's review for a book.
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user && req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
    return res.status(404).json({ message: 'No review found for this user and book.' });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: 'Review deleted successfully.',
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
