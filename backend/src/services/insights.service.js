const prisma = require('../config/db');

class InsightsService {
  /**
   * Generate rule-based financial insights from transaction data
   */
  async getInsights() {
    const insights = [];

    // Fetch all active transactions
    const transactions = await prisma.transaction.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'desc' },
    });

    if (transactions.length === 0) {
      return [{ type: 'info', icon: '📭', title: 'No Data', text: 'No transactions found. Add some data to see insights.' }];
    }

    // ─── Summary Stats ──────────────────────────────
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + parseFloat(t.amount), 0);
    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

    // Insight: Savings rate
    if (savingsRate >= 50) {
      insights.push({ type: 'success', icon: '🏆', title: 'Excellent Savings Rate', text: `Your savings rate is ${savingsRate}% — well above the recommended 20%. You're in a strong financial position.` });
    } else if (savingsRate >= 20) {
      insights.push({ type: 'success', icon: '✅', title: 'Healthy Savings Rate', text: `Your savings rate is ${savingsRate}%, meeting the recommended threshold of 20%.` });
    } else if (savingsRate >= 0) {
      insights.push({ type: 'warning', icon: '⚠️', title: 'Low Savings Rate', text: `Your savings rate is only ${savingsRate}%. Consider reducing expenses — the recommended rate is at least 20%.` });
    } else {
      insights.push({ type: 'danger', icon: '🚨', title: 'Negative Balance', text: `Expenses exceed income by ₹${Math.abs(netBalance).toLocaleString()}. Immediate action is needed to reduce spending.` });
    }

    // ─── Category Analysis ──────────────────────────
    const categoryMap = {};
    transactions.forEach(t => {
      if (!categoryMap[t.category]) categoryMap[t.category] = { income: 0, expense: 0, count: 0 };
      const amt = parseFloat(t.amount);
      if (t.type === 'INCOME') categoryMap[t.category].income += amt;
      else categoryMap[t.category].expense += amt;
      categoryMap[t.category].count++;
    });

    // Top expense category
    const expenseCategories = Object.entries(categoryMap)
      .filter(([, v]) => v.expense > 0)
      .sort((a, b) => b[1].expense - a[1].expense);

    if (expenseCategories.length > 0) {
      const [topCat, topData] = expenseCategories[0];
      const pct = totalExpense > 0 ? ((topData.expense / totalExpense) * 100).toFixed(1) : 0;
      insights.push({
        type: pct > 40 ? 'warning' : 'info',
        icon: '📊',
        title: 'Top Expense Category',
        text: `"${topCat}" accounts for ${pct}% of total expenses (₹${topData.expense.toLocaleString()}). ${pct > 40 ? 'This is quite concentrated — consider diversifying.' : ''}`,
      });
    }

    // Top income source
    const incomeCategories = Object.entries(categoryMap)
      .filter(([, v]) => v.income > 0)
      .sort((a, b) => b[1].income - a[1].income);

    if (incomeCategories.length > 0) {
      const [topCat, topData] = incomeCategories[0];
      const pct = totalIncome > 0 ? ((topData.income / totalIncome) * 100).toFixed(1) : 0;
      insights.push({
        type: 'info',
        icon: '💰',
        title: 'Primary Income Source',
        text: `"${topCat}" contributes ${pct}% of total income (₹${topData.income.toLocaleString()}).${pct > 80 ? ' High dependency on a single source — consider diversifying.' : ''}`,
      });
    }

    // ─── Trend Analysis ─────────────────────────────
    const monthMap = {};
    transactions.forEach(t => {
      const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
      const amt = parseFloat(t.amount);
      if (t.type === 'INCOME') monthMap[key].income += amt;
      else monthMap[key].expense += amt;
    });

    const months = Object.keys(monthMap).sort();
    if (months.length >= 2) {
      const latest = monthMap[months[months.length - 1]];
      const prev = monthMap[months[months.length - 2]];

      // Expense trend
      if (prev.expense > 0) {
        const expChange = ((latest.expense - prev.expense) / prev.expense * 100).toFixed(1);
        if (expChange > 20) {
          insights.push({ type: 'danger', icon: '📈', title: 'Expense Spike', text: `Expenses increased by ${expChange}% compared to the previous month. Review recent transactions for unusual spending.` });
        } else if (expChange < -20) {
          insights.push({ type: 'success', icon: '📉', title: 'Expenses Reduced', text: `Expenses decreased by ${Math.abs(expChange)}% compared to the previous month. Great cost management!` });
        }
      }

      // Income trend
      if (prev.income > 0) {
        const incChange = ((latest.income - prev.income) / prev.income * 100).toFixed(1);
        if (incChange > 15) {
          insights.push({ type: 'success', icon: '🚀', title: 'Income Growth', text: `Income grew by ${incChange}% compared to the previous month. Strong upward trajectory!` });
        } else if (incChange < -15) {
          insights.push({ type: 'warning', icon: '📉', title: 'Income Decline', text: `Income dropped by ${Math.abs(incChange)}% compared to the previous month. Monitor the situation closely.` });
        }
      }
    }

    // ─── Transaction Patterns ───────────────────────
    const avgTransaction = (totalIncome + totalExpense) / transactions.length;
    insights.push({
      type: 'info',
      icon: '📋',
      title: 'Transaction Overview',
      text: `${transactions.length} total transactions with an average value of ₹${avgTransaction.toFixed(0).toLocaleString()}. Income: ₹${totalIncome.toLocaleString()} | Expenses: ₹${totalExpense.toLocaleString()}.`,
    });

    // Category diversity
    const uniqueCategories = Object.keys(categoryMap).length;
    if (uniqueCategories <= 3) {
      insights.push({ type: 'info', icon: '🏷️', title: 'Low Category Diversity', text: `Only ${uniqueCategories} categories used. Consider adding more categories for better financial tracking and analysis.` });
    } else {
      insights.push({ type: 'success', icon: '🏷️', title: 'Good Category Coverage', text: `${uniqueCategories} categories in use, providing detailed financial breakdowns across spending areas.` });
    }

    // Large transactions
    const largeThreshold = avgTransaction * 3;
    const largeTransactions = transactions.filter(t => parseFloat(t.amount) > largeThreshold);
    if (largeTransactions.length > 0) {
      insights.push({
        type: 'warning',
        icon: '💎',
        title: 'Large Transactions Detected',
        text: `${largeTransactions.length} transaction(s) exceed 3x the average amount (>₹${largeThreshold.toFixed(0)}). These may warrant review.`,
      });
    }

    return insights;
  }
}

module.exports = new InsightsService();
