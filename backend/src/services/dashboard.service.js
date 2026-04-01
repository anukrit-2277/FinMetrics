const prisma = require('../config/db');

class DashboardService {
  /**
   * Summary: total income, total expenses, net balance, transaction count
   */
  async getSummary() {
    const [incomeResult, expenseResult, count] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: 'INCOME', isDeleted: false },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: 'EXPENSE', isDeleted: false },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where: { isDeleted: false } }),
    ]);

    const totalIncome = parseFloat(incomeResult._sum.amount || 0);
    const totalExpenses = parseFloat(expenseResult._sum.amount || 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactionCount: count,
    };
  }

  /**
   * Category-wise totals (grouped by category and type)
   */
  async getCategoryTotals() {
    const results = await prisma.transaction.groupBy({
      by: ['category', 'type'],
      where: { isDeleted: false },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    return results.map((r) => ({
      category: r.category,
      type: r.type,
      total: parseFloat(r._sum.amount),
      count: r._count.id,
    }));
  }

  /**
   * Monthly trends for the last 12 months
   */
  async getTrends() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const transactions = await prisma.transaction.findMany({
      where: {
        isDeleted: false,
        date: { gte: twelveMonthsAgo },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
      orderBy: { date: 'asc' },
    });

    // Group by month
    const monthlyData = {};
    transactions.forEach((tx) => {
      const monthKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }
      const amount = parseFloat(tx.amount);
      if (tx.type === 'INCOME') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expense += amount;
      }
    });

    // Sort by month and return
    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        income: Math.round(m.income * 100) / 100,
        expense: Math.round(m.expense * 100) / 100,
        net: Math.round((m.income - m.expense) * 100) / 100,
      }));
  }

  /**
   * Recent transactions (last 10)
   */
  async getRecent() {
    return prisma.transaction.findMany({
      where: { isDeleted: false },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { date: 'desc' },
      take: 10,
    });
  }
}

module.exports = new DashboardService();
