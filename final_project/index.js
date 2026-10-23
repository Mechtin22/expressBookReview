const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use('/customer', session({
  secret: 'fingerprint_customer',
  resave: false,
  saveUninitialized: false
}));

// Protect review-management routes with a signed JWT.
app.use('/customer/auth/*', (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Provide a Bearer token.' });
  }

  try {
    req.user = jwt.verify(token, 'fingerprint_customer');
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

const PORT = process.env.PORT || 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
