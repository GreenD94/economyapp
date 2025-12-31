import type { HelpContent, HelpContext } from '../types/help.types';
import { formatCurrency } from '@/features/core/utils';
import type { SpendingAnalytics } from '../../analytics/types/analytics.types';
import type { CategoryBreakdown } from '../../analytics/types/analytics.types';

interface HelpData {
  analytics?: SpendingAnalytics;
  categoryBreakdown?: CategoryBreakdown[];
  currentValue?: number;
  categoryName?: string;
  limit?: number;
  budget?: number;
  spending?: number;
}

export function generateHelpContent(
  context: HelpContext,
  data: HelpData = {}
): HelpContent {
  switch (context) {
    case 'summary-card-total-spending':
      return {
        title: 'Total Spending',
        whatIsThis:
          'This shows the total amount you have spent across all categories since you started tracking. It includes all expenses regardless of when they occurred.',
        currentStatus: data.analytics
          ? `You have spent a total of ${formatCurrency(data.analytics.totalSpending)}. ${
              data.analytics.totalSpending > data.analytics.totalEarnings
                ? 'This is more than your total earnings, which means you are spending more than you earn. Consider reviewing your expenses.'
                : 'This is less than your total earnings, which is good for your financial health.'
            }`
          : 'Loading spending data...',
      };

    case 'summary-card-total-earnings':
      return {
        title: 'Total Earnings',
        whatIsThis:
          'This shows the total amount you have earned from all income sources since you started tracking. This includes salary, freelance work, and any other income.',
        currentStatus: data.analytics
          ? `You have earned a total of ${formatCurrency(data.analytics.totalEarnings)}. ${
              data.analytics.totalEarnings > data.analytics.totalSpending
                ? 'You are earning more than you spend, which is excellent for building savings.'
                : 'Your earnings are less than your spending. Consider finding ways to increase income or reduce expenses.'
            }`
          : 'Loading earnings data...',
      };

    case 'summary-card-balance':
      return {
        title: 'Total Balance',
        whatIsThis:
          'This is your net financial position, calculated as total earnings minus total spending. A positive balance means you have saved money, while a negative balance indicates you have spent more than you earned.',
        currentStatus: data.analytics
          ? `Your current balance is ${formatCurrency(data.analytics.balance)}. ${
              data.analytics.balance > 0
                ? 'This is positive, meaning you have saved money overall. Great job!'
                : data.analytics.balance < 0
                  ? 'This is negative, meaning you have spent more than you earned. Consider reviewing your spending habits.'
                  : 'Your balance is zero, meaning your earnings exactly match your spending.'
            }`
          : 'Loading balance data...',
        formula: 'Balance = Total Earnings - Total Spending',
      };

    case 'summary-card-monthly-spending':
      return {
        title: 'Monthly Spending',
        whatIsThis:
          'This shows how much you have spent in the current month. It helps you track your spending patterns and stay within your monthly budget.',
        currentStatus: data.analytics
          ? `You have spent ${formatCurrency(data.analytics.monthlySpending)} this month. ${
              data.analytics.monthlySpending > data.analytics.monthlyEarnings
                ? 'This exceeds your monthly earnings, which is concerning. Try to reduce expenses.'
                : data.analytics.monthlySpending > data.analytics.monthlyEarnings * 0.8
                  ? 'This is close to your monthly earnings. Consider being more careful with spending.'
                  : 'This is well within your earnings, which is good for your financial health.'
            }`
          : 'Loading monthly spending data...',
      };

    case 'summary-card-monthly-earnings':
      return {
        title: 'Monthly Earnings',
        whatIsThis:
          'This shows how much you have earned in the current month. This includes all income sources for the current month.',
        currentStatus: data.analytics
          ? `You have earned ${formatCurrency(data.analytics.monthlyEarnings)} this month. ${
              data.analytics.monthlyEarnings === 0
                ? 'No earnings recorded this month yet. Make sure to add your income transactions.'
                : 'This is your income for the current month.'
            }`
          : 'Loading monthly earnings data...',
      };

    case 'summary-card-monthly-balance':
      return {
        title: 'Monthly Balance',
        whatIsThis:
          'This is your net position for the current month, calculated as monthly earnings minus monthly spending. It shows whether you are saving or spending more than you earn this month.',
        currentStatus: data.analytics
          ? `Your monthly balance is ${formatCurrency(data.analytics.monthlyBalance)}. ${
              data.analytics.monthlyBalance > 0
                ? 'You are saving money this month. Excellent!'
                : data.analytics.monthlyBalance < 0
                  ? 'You are spending more than you earn this month. Consider reducing expenses.'
                  : 'Your earnings exactly match your spending this month.'
            }`
          : 'Loading monthly balance data...',
        formula: 'Monthly Balance = Monthly Earnings - Monthly Spending',
      };

    case 'spending-chart':
      return {
        title: 'Spending & Earnings Trend',
        whatIsThis:
          'This chart shows your spending and earnings over the last 6 months. It helps you identify trends and patterns in your financial behavior over time.',
        currentStatus: data.analytics
          ? `The chart displays your monthly spending and earnings trends. ${
              data.analytics.monthlySpending > data.analytics.monthlyEarnings
                ? 'Your current month shows spending exceeding earnings, which is a concern.'
                : 'Your spending is within your earnings, which is positive.'
            }`
          : 'Loading chart data...',
        examples: [
          'Look for months where spending is higher than earnings',
          'Identify trends - is spending increasing or decreasing?',
          'Compare spending patterns across different months',
        ],
      };

    case 'earnings-chart':
      return {
        title: 'Earnings & Spending Over Time',
        whatIsThis:
          'This line chart shows how your earnings and spending have changed over the last 6 months. It helps you see if your financial situation is improving or declining.',
        currentStatus: data.analytics
          ? `The chart shows your earnings and spending trends. ${
              data.analytics.monthlyBalance > 0
                ? 'You are currently saving money each month.'
                : 'You are currently spending more than you earn.'
            }`
          : 'Loading chart data...',
        examples: [
          'An upward trend in earnings is positive',
          'A downward trend in spending is positive',
          'The gap between earnings and spending shows your savings rate',
        ],
      };

    case 'category-pie-chart':
      return {
        title: 'Spending by Category',
        whatIsThis:
          'This pie chart shows how your spending is distributed across different categories. It helps you identify which categories consume the most of your budget.',
        currentStatus: data.categoryBreakdown
          ? `Your spending is distributed across ${data.categoryBreakdown.length} categories. ${
              data.categoryBreakdown.length > 0
                ? `The largest category is ${data.categoryBreakdown[0]?.category || 'unknown'} with ${formatCurrency(data.categoryBreakdown[0]?.amount || 0)}.`
                : 'No spending data available yet.'
            }`
          : 'Loading category data...',
        examples: [
          'Larger slices indicate categories where you spend more',
          'Compare category sizes to identify spending priorities',
          'Use this to set category budgets',
        ],
      };

    case 'category-badge':
      return {
        title: `Category: ${data.categoryName || 'Category'}`,
        whatIsThis:
          'This represents a spending category. Categories help you organize and track your expenses by type, making it easier to understand where your money goes.',
        currentStatus: data.currentValue
          ? `You have spent ${formatCurrency(data.currentValue)} in this category. ${
              data.budget && data.spending
                ? data.spending > data.budget
                  ? `This exceeds your budget of ${formatCurrency(data.budget)}.`
                  : `This is within your budget of ${formatCurrency(data.budget)}.`
                : 'No budget set for this category yet.'
            }`
          : 'No spending in this category yet.',
      };

    case 'budget-progress':
      return {
        title: 'Budget Progress',
        whatIsThis:
          'This shows how much of your category budget you have spent. It helps you stay within your planned spending limits and avoid overspending.',
        currentStatus: data.budget && data.spending !== undefined
          ? `You have spent ${formatCurrency(data.spending)} of your ${formatCurrency(data.budget)} budget (${((data.spending / data.budget) * 100).toFixed(1)}%). ${
              data.spending > data.budget
                ? 'You have exceeded your budget. Consider reducing spending in this category.'
                : data.spending > data.budget * 0.9
                  ? 'You are close to your budget limit. Be careful with additional spending.'
                  : 'You are within your budget. Good job!'
            }`
          : 'No budget data available.',
        formula: 'Progress % = (Current Spending / Budget) × 100',
      };

    case 'health-score':
      return {
        title: 'Financial Health Score',
        whatIsThis:
          'This is a comprehensive score (0-100) that evaluates your overall financial health based on spending ratio, savings rate, budget adherence, and trends.',
        currentStatus: data.currentValue
          ? `Your financial health score is ${data.currentValue.toFixed(0)}/100. ${
              data.currentValue >= 80
                ? 'Excellent! You are managing your finances very well.'
                : data.currentValue >= 60
                  ? 'Good! Your finances are in decent shape, but there is room for improvement.'
                  : data.currentValue >= 40
                    ? 'Fair. Consider reducing spending and increasing savings.'
                    : 'Needs improvement. Focus on reducing expenses and building savings.'
            }`
          : 'Calculating health score...',
        formula:
          'Health Score = (Spending Ratio Score + Savings Rate Score + Budget Adherence Score + Trend Score) / 4',
      };

    case 'limit-progress':
      return {
        title: 'Spending Limit Progress',
        whatIsThis:
          'This shows how much of your monthly spending limit you have used. It helps you avoid overspending and stay within your financial boundaries.',
        currentStatus: data.limit && data.currentValue !== undefined
          ? `You have spent ${formatCurrency(data.currentValue)} of your ${formatCurrency(data.limit)} limit (${((data.currentValue / data.limit) * 100).toFixed(1)}%). ${
              data.currentValue > data.limit
                ? 'You have exceeded your limit. Stop spending immediately.'
                : data.currentValue > data.limit * 0.9
                  ? 'You are very close to your limit. Be very careful with additional spending.'
                  : data.currentValue > data.limit * 0.75
                    ? 'You are approaching your limit. Consider reducing spending.'
                    : 'You are within your limit. Good job!'
            }`
          : 'No limit data available.',
        formula: 'Progress % = (Current Spending / Monthly Limit) × 100',
      };

    case 'savings-goal':
      return {
        title: 'Savings Goal',
        whatIsThis:
          'This represents a financial goal you are saving towards, such as an emergency fund, vacation, or major purchase. It tracks your progress toward reaching your target amount.',
        currentStatus: data.currentValue && data.budget
          ? `You have saved ${formatCurrency(data.currentValue)} of your ${formatCurrency(data.budget)} goal (${((data.currentValue / data.budget) * 100).toFixed(1)}%). ${
              data.currentValue >= data.budget
                ? 'Congratulations! You have reached your goal!'
                : `You need ${formatCurrency(data.budget - data.currentValue)} more to reach your goal.`
            }`
          : 'No goal data available.',
        formula: 'Progress % = (Current Amount / Target Amount) × 100',
      };

    default:
      return {
        title: 'Help',
        whatIsThis: 'Information about this feature.',
        currentStatus: 'No additional information available.',
      };
  }
}
