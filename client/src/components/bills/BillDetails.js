import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billsAPI, expensesAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import Input from '../common/Input';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bill, setBill] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'tv',
    amount: '',
    paymentBy: '',
  });
  const [expenseErrors, setExpenseErrors] = useState({});
  const [expenseLoading, setExpenseLoading] = useState(false);

  useEffect(() => {
    fetchBillDetails();
  }, [id]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const [billResponse, expensesResponse] = await Promise.all([
        billsAPI.getById(id),
        expensesAPI.getByBillId(id),
      ]);
      setBill(billResponse.data[0]); // API returns array
      setExpenses(expensesResponse.data);
    } catch (err) {
      console.error('Error fetching bill details:', err);
      setError('Failed to load bill details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
    if (expenseErrors[name]) {
      setExpenseErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setExpenseLoading(true);
    setExpenseErrors({});

    try {
      const expenseData = {
        ...newExpense,
        bill: id,
        amount: parseFloat(newExpense.amount),
      };
      
      const response = await expensesAPI.create(expenseData);
      setExpenses([...expenses, response.data]);
      setNewExpense({
        description: '',
        category: 'tv',
        amount: '',
        paymentBy: '',
      });
      setShowAddExpense(false);
    } catch (err) {
      console.error('Error adding expense:', err);
      
      if (err.response?.data?.errors) {
        const errorObj = {};
        err.response.data.errors.forEach(error => {
          errorObj[error.field] = error.message;
        });
        setExpenseErrors(errorObj);
      } else {
        setExpenseErrors({ general: err.response?.data?.message || 'Failed to add expense.' });
      }
    } finally {
      setExpenseLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expensesAPI.delete(expenseId);
      setExpenses(expenses.filter(expense => expense._id !== expenseId));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense. Please try again.');
    }
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return <LoadingSpinner text="Loading bill details..." />;
  }

  if (error && !bill) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate('/bills')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bills
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/bills')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bills
          </Button>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900">
              {bill?.title}
            </h2>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(bill?.createdAt).toLocaleDateString()}
              </div>
              {bill?.createdBy && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {bill.createdBy.username}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'data-entry') && (
          <Button onClick={() => setShowAddExpense(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Bill Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {bill?.description && (
            <p className="text-gray-700 mb-4">{bill.description}</p>
          )}
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-600">${totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{expenses.length} expenses</p>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddExpense && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              {expenseErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {expenseErrors.general}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Description"
                  name="description"
                  value={newExpense.description}
                  onChange={handleExpenseChange}
                  error={expenseErrors.description}
                  placeholder="What was this expense for?"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={newExpense.category}
                    onChange={handleExpenseChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="tv">TV/Entertainment</option>
                    <option value="stand">Food/Stand</option>
                    <option value="transport">Transport</option>
                  </select>
                  {expenseErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{expenseErrors.category}</p>
                  )}
                </div>
                
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={newExpense.amount}
                  onChange={handleExpenseChange}
                  error={expenseErrors.amount}
                  placeholder="0.00"
                />
                
                <Input
                  label="Paid By"
                  name="paymentBy"
                  required
                  value={newExpense.paymentBy}
                  onChange={handleExpenseChange}
                  error={expenseErrors.paymentBy}
                  placeholder="Who paid for this?"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddExpense(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={expenseLoading}
                >
                  Add Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses</h3>
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses added yet</p>
              {(user?.role === 'admin' || user?.role === 'data-entry') && (
                <Button
                  className="mt-4"
                  onClick={() => setShowAddExpense(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Expense
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {expense.description || 'No description'}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {expense.category}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Paid by {expense.paymentBy} • {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </span>
                      {user?.role === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
