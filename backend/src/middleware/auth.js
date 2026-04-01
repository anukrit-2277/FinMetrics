/**
 * Authentication middleware
 * Ensures the user is logged in via session
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in.',
  });
};

module.exports = { isAuthenticated };
