import React, { useState, useEffect } from 'react';
import { expensesAPI, billsAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { Calendar, User, Trash2, Receipt } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filter, setFilter] = useState({
    category: '',
    paymentBy: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const [expensesResponse, billsResponse] = await Promise.all([
        expensesAPI.getAll(),
        billsAPI.getAll(),
      ]);
      
      setExpenses(expensesResponse.data);
      
      // Create bills lookup object
      const billsLookup = {};
      billsResponse.data.forEach(bill => {
        billsLookup[bill._id] = bill;
      });
      setBills(billsLookup);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      setDeleteLoading(expenseId);
      await expensesAPI.delete(expenseId);
      setExpenses(expenses.filter(expense => expense._id !== expenseId));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter expenses based on current filters
  const filteredExpenses = expenses.filter(expense => {
    if (filter.category && expense.category !== filter.category) {
      return false;
    }
    if (filter.paymentBy && !expense.paymentBy.toLowerCase().includes(filter.paymentBy.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Get unique values for filters
  const categories = [...new Set(expenses.map(expense => expense.category))];
  const paymentByOptions = [...new Set(expenses.map(expense => expense.paymentBy))];

  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return <LoadingSpinner text="Loading expenses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            All Expenses
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all expenses across bills
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="text-center">
              <span className="text-lg font-medium text-gray-900">Total: </span>
              <span className="text-2xl font-bold text-primary-600">${totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 text-center mt-1">
              {filteredExpenses.length} expenses
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Paid By</label>
              <select
                name="paymentBy"
                value={filter.paymentBy}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All People</option>
                {paymentByOptions.map(person => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilter({ category: '', paymentBy: '' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Receipt className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {expenses.length === 0 ? 'No expenses yet' : 'No expenses match your filters'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {expenses.length === 0 
                ? 'Expenses will appear here once you start adding them to bills.'
                : 'Try adjusting your filters to see more expenses.'
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <li key={expense._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {expense.description || 'No description'}
                        </p>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {expense.category}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Paid by {expense.paymentBy}
                        </div>
                        {bills[expense.bill] && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Receipt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {bills[expense.bill].title}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </span>
                      {user?.role === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(expense._id)}
                          loading={deleteLoading === expense._id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Expenses;
