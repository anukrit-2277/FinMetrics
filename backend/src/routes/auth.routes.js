const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { loginValidator, changePasswordValidator } = require('../validators/auth.validator');

// POST /api/auth/login
router.post('/login', validate(loginValidator), authController.login);

// POST /api/auth/logout
router.post('/logout', isAuthenticated, authController.logout);

// GET /api/auth/me
router.get('/me', isAuthenticated, authController.me);

// PUT /api/auth/change-password
router.put('/change-password', isAuthenticated, validate(changePasswordValidator), authController.changePassword);

module.exports = router;
