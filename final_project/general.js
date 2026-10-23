const axios = require('axios');

const BASE_URL = process.env.BOOK_API_URL || 'http://localhost:5000';

// Retrieve the complete book catalogue.
async function getAllBooks() {
  const response = await axios.get(BASE_URL);
  return response.data;
}

// Retrieve a book by ISBN (the supplied starter data uses numeric keys 1-10).
async function getBooksByISBN(isbn) {
  const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
}

// Retrieve books whose author matches all or part of the supplied name.
async function getBooksByAuthor(author) {
  const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
  return response.data;
}

// Retrieve books whose title matches all or part of the supplied title.
async function getBooksByTitle(title) {
  const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
  return response.data;
}

// Retrieve all reviews for a book.
async function getBookReview(isbn) {
  const response = await axios.get(`${BASE_URL}/review/${encodeURIComponent(isbn)}`);
  return response.data;
}

// Optional command-line usage:
// node general.js all
// node general.js isbn 1
// node general.js author "Jane Austen"
// node general.js title "Pride and Prejudice"
// node general.js review 1
async function main() {
  const [command, ...args] = process.argv.slice(2);
  let result;

  switch (command) {
    case 'all':
      result = await getAllBooks();
      break;
    case 'isbn':
      result = await getBooksByISBN(args[0]);
      break;
    case 'author':
      result = await getBooksByAuthor(args.join(' '));
      break;
    case 'title':
      result = await getBooksByTitle(args.join(' '));
      break;
    case 'review':
      result = await getBookReview(args[0]);
      break;
    default:
      console.log('Usage: node general.js all | isbn <isbn> | author <name> | title <title> | review <isbn>');
      process.exitCode = 1;
      return;
  }

  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    if (error.response) {
      console.error(`HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(error.message);
    }
    process.exitCode = 1;
  });
}

module.exports = {
  getAllBooks,
  getBooksByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReview
};
