const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All dashboard routes require authentication
router.use(isAuthenticated);

// GET /api/dashboard/summary — Total income/expense/balance (all roles)
router.get('/summary', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getSummary);

// GET /api/dashboard/recent — Recent transactions (all roles)
router.get('/recent', authorize('VIEWER', 'ANALYST', 'ADMIN'), dashboardController.getRecent);

// GET /api/dashboard/category-totals — Category breakdown (Analyst+ only)
router.get('/category-totals', authorize('ANALYST', 'ADMIN'), dashboardController.getCategoryTotals);

// GET /api/dashboard/trends — Monthly trends (Analyst+ only)
router.get('/trends', authorize('ANALYST', 'ADMIN'), dashboardController.getTrends);

module.exports = router;
