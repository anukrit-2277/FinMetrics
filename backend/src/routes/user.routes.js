const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createUserValidator, updateUserValidator } = require('../validators/user.validator');

// All user routes require authentication + ADMIN role
router.use(isAuthenticated, authorize('ADMIN'));

// GET /api/users/roles — Get all roles
router.get('/roles', userController.getRoles);

// GET /api/users — List all users
router.get('/', userController.getAll);

// GET /api/users/:id — Get user by ID
router.get('/:id', userController.getById);

// POST /api/users — Create user
router.post('/', validate(createUserValidator), userController.create);

// PUT /api/users/:id — Update user
router.put('/:id', validate(updateUserValidator), userController.update);

// DELETE /api/users/:id — Deactivate user
router.delete('/:id', userController.deactivate);

module.exports = router;
