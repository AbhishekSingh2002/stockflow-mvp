const prisma = require("../utils/prismaClient");

/**
 * GET /api/dashboard
 * Get financial dashboard summary data
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);

    // Get all financial data for calculations
    const [
      totalIncome,
      totalExpenses,
      currentMonthIncome,
      currentMonthExpenses,
      lastMonthIncome,
      lastMonthExpenses,
      categoryTotals,
      recentTransactions,
      monthlyTrends
    ] = await Promise.all([
      // Total income and expenses
      prisma.financialRecord.aggregate({
        where: {
          organizationId,
          type: "INCOME"
        },
        _sum: { amount: true }
      }),
      prisma.financialRecord.aggregate({
        where: {
          organizationId,
          type: "EXPENSE"
        },
        _sum: { amount: true }
      }),

      // Current month income and expenses
      prisma.financialRecord.aggregate({
        where: {
          organizationId,
          type: "INCOME",
          date: { gte: currentMonthStart }
        },
        _sum: { amount: true }
      }),
      prisma.financialRecord.aggregate({
        where: {
          organizationId,
          type: "EXPENSE",
          date: { gte: currentMonthStart }
        },
        _sum: { amount: true }
      }),

      // Last month income and expenses
      prisma.financialRecord.aggregate({
        where: {
          organizationId,
          type: "INCOME",
          date: {
            gte: lastMonthStart,
            lt: currentMonthStart
          }
        },
        _sum: { amount: true }
      }),
      prisma.financialRecord.aggregate({
        where: {
          organizationId,
          type: "EXPENSE",
          date: {
            gte: lastMonthStart,
            lt: currentMonthStart
          }
        },
        _sum: { amount: true }
      }),

      // Category-wise totals
      prisma.financialRecord.groupBy({
        by: ["category", "type"],
        where: { organizationId },
        _sum: { amount: true }
      }),

      // Recent transactions
      prisma.financialRecord.findMany({
        where: { organizationId },
        orderBy: { date: "desc" },
        take: 10,
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          date: true,
          description: true
        }
      }),

      // Monthly trends for current year
      prisma.$queryRaw`
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          type,
          SUM(amount) as total
        FROM "FinancialRecord"
        WHERE "organizationId" = ${organizationId}
          AND date >= ${currentYearStart}
        GROUP BY EXTRACT(MONTH FROM date), type
        ORDER BY month, type
      `
    ]);

    // Calculate net balance and percentages
    const totalIncomeAmount = totalIncome._sum.amount || 0;
    const totalExpensesAmount = totalExpenses._sum.amount || 0;
    const netBalance = totalIncomeAmount - totalExpensesAmount;

    const currentMonthIncomeAmount = currentMonthIncome._sum.amount || 0;
    const currentMonthExpensesAmount = currentMonthExpenses._sum.amount || 0;
    const lastMonthIncomeAmount = lastMonthIncome._sum.amount || 0;
    const lastMonthExpensesAmount = lastMonthExpenses._sum.amount || 0;

    // Calculate month-over-month changes
    const incomeChange = lastMonthIncomeAmount > 0 
      ? ((currentMonthIncomeAmount - lastMonthIncomeAmount) / lastMonthIncomeAmount) * 100 
      : 0;
    const expenseChange = lastMonthExpensesAmount > 0 
      ? ((currentMonthExpensesAmount - lastMonthExpensesAmount) / lastMonthExpensesAmount) * 100 
      : 0;

    // Process category totals
    const categoryBreakdown = categoryTotals.reduce((acc, item) => {
      const key = `${item.type.toLowerCase()}_${item.category.toLowerCase()}`;
      acc[key] = item._sum.amount || 0;
      return acc;
    }, {});

    // Process monthly trends
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthTrend = monthlyTrends.filter(t => parseInt(t.month) === monthNum);
      
      return {
        month: monthNum,
        income: monthTrend.find(t => t.type === 'INCOME')?.total || 0,
        expenses: monthTrend.find(t => t.type === 'EXPENSE')?.total || 0
      };
    });

    return res.json({
      summary: {
        totalIncome: totalIncomeAmount,
        totalExpenses: totalExpensesAmount,
        netBalance,
        currentMonth: {
          income: currentMonthIncomeAmount,
          expenses: currentMonthExpensesAmount,
          net: currentMonthIncomeAmount - currentMonthExpensesAmount
        },
        monthlyChanges: {
          income: Math.round(incomeChange * 100) / 100,
          expenses: Math.round(expenseChange * 100) / 100
        }
      },
      categoryBreakdown,
      recentTransactions,
      monthlyTrends: monthlyData.slice(0, currentDate.getMonth() + 1)
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/dashboard/analytics
 * Get detailed analytics for analysts and admins
 */
exports.getAnalytics = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const { period = "monthly", category } = req.query;

    let dateFilter;
    const currentDate = new Date();
    
    switch (period) {
      case "weekly":
        dateFilter = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        dateFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        break;
      case "quarterly":
        const quarterStart = Math.floor(currentDate.getMonth() / 3) * 3;
        dateFilter = new Date(currentDate.getFullYear(), quarterStart, 1);
        break;
      case "yearly":
        dateFilter = new Date(currentDate.getFullYear(), 0, 1);
        break;
      default:
        dateFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    }

    const whereClause = {
      organizationId,
      date: { gte: dateFilter }
    };

    if (category) {
      whereClause.category = category.toUpperCase();
    }

    const [
      averageTransaction,
      largestExpense,
      largestIncome,
      transactionCount,
      dailyAverages
    ] = await Promise.all([
      // Average transaction amount
      prisma.financialRecord.aggregate({
        where: whereClause,
        _avg: { amount: true },
        _count: { id: true }
      }),
      
      // Largest expense
      prisma.financialRecord.findFirst({
        where: {
          ...whereClause,
          type: "EXPENSE"
        },
        orderBy: { amount: "desc" },
        select: {
          amount: true,
          category: true,
          description: true,
          date: true
        }
      }),

      // Largest income
      prisma.financialRecord.findFirst({
        where: {
          ...whereClause,
          type: "INCOME"
        },
        orderBy: { amount: "desc" },
        select: {
          amount: true,
          category: true,
          description: true,
          date: true
        }
      }),

      // Transaction count by type
      prisma.financialRecord.groupBy({
        by: ["type"],
        where: whereClause,
        _count: { id: true }
      }),

      // Daily averages
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', date) as day,
          type,
          SUM(amount) as total,
          COUNT(*) as count
        FROM "FinancialRecord"
        WHERE "organizationId" = ${organizationId}
          AND date >= ${dateFilter}
        GROUP BY DATE_TRUNC('day', date), type
        ORDER BY day DESC
        LIMIT 30
      `
    ]);

    return res.json({
      period,
      analytics: {
        averageTransaction: averageTransaction._avg.amount || 0,
        totalTransactions: averageTransaction._count.id || 0,
        largestExpense,
        largestIncome,
        transactionBreakdown: transactionCount.reduce((acc, item) => {
          acc[item.type.toLowerCase()] = item._count.id;
          return acc;
        }, {})
      },
      dailyAverages
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
