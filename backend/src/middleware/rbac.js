/**
 * Role-Based Access Control middleware
 * Checks if the authenticated user has one of the allowed roles
 *
 * Usage: authorize('ADMIN', 'ANALYST')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${userRole}.`,
      });
    }

    return next();
  };
};

module.exports = { authorize };
