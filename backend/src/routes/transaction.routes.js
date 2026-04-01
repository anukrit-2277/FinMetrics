const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { isAuthenticated } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createTransactionValidator, updateTransactionValidator } = require('../validators/transaction.validator');

// All transaction routes require authentication
router.use(isAuthenticated);

// GET /api/transactions/categories — Get distinct categories
router.get('/categories', authorize('VIEWER', 'ANALYST', 'ADMIN'), transactionController.getCategories);

// GET /api/transactions — List with filters + pagination
router.get('/', authorize('VIEWER', 'ANALYST', 'ADMIN'), transactionController.getAll);

// GET /api/transactions/:id — Get by ID
router.get('/:id', authorize('VIEWER', 'ANALYST', 'ADMIN'), transactionController.getById);

// POST /api/transactions — Create (Admin only)
router.post('/', authorize('ADMIN'), validate(createTransactionValidator), transactionController.create);

// PUT /api/transactions/:id — Update (Admin only)
router.put('/:id', authorize('ADMIN'), validate(updateTransactionValidator), transactionController.update);

// DELETE /api/transactions/:id — Soft delete (Admin only)
router.delete('/:id', authorize('ADMIN'), transactionController.delete);

module.exports = router;
