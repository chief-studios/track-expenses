import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billsAPI, expensesAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Receipt, CreditCard, Plus, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalExpenses: 0,
    recentBills: [],
    recentExpenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [billsResponse, expensesResponse] = await Promise.all([
        billsAPI.getAll(),
        expensesAPI.getAll(),
      ]);

      const bills = billsResponse.data;
      const expenses = expensesResponse.data;

      setStats({
        totalBills: bills.length,
        totalExpenses: expenses.length,
        recentBills: bills.slice(-5).reverse(), // Get 5 most recent bills
        recentExpenses: expenses.slice(-5).reverse(), // Get 5 most recent expenses
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-primary-text sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-secondary-text">
            Overview of your expenses and bills
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/bills/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Bill
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Bills</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalBills}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalExpenses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Activity</dt>
                  <dd className="text-lg font-medium text-gray-900">Active</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bills */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Bills</h3>
            {stats.recentBills.length === 0 ? (
              <p className="text-gray-500 text-sm">No bills yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentBills.map((bill) => (
                  <div key={bill._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bill.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/bills/${bill._id}`}
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/bills"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all bills →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Expenses</h3>
            {stats.recentExpenses.length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentExpenses.map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {expense.description || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {expense.category} • ${expense.amount}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${expense.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/expenses"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all expenses →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
