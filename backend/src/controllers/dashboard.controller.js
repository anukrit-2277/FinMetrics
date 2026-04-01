const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryTotals(req, res, next) {
    try {
      const totals = await dashboardService.getCategoryTotals();
      return res.status(200).json({
        success: true,
        data: totals,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrends(req, res, next) {
    try {
      const trends = await dashboardService.getTrends();
      return res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecent(req, res, next) {
    try {
      const recent = await dashboardService.getRecent();
      return res.status(200).json({
        success: true,
        data: recent,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
