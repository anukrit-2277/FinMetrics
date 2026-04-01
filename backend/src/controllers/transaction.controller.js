const transactionService = require('../services/transaction.service');

class TransactionController {
  async getAll(req, res, next) {
    try {
      const result = await transactionService.getAll(req.query);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const transaction = await transactionService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const transaction = await transactionService.create(req.body, req.session.user.id);
      return res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const transaction = await transactionService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await transactionService.softDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await transactionService.getCategories();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();
