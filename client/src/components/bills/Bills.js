import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billsAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { Plus, Calendar, User, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await billsAPI.getAll();
      setBills(response.data);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(billId);
      await billsAPI.delete(billId);
      setBills(bills.filter(bill => bill._id !== billId));
    } catch (err) {
      console.error('Error deleting bill:', err);
      setError('Failed to delete bill. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading bills..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Bills
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your shared expense bills
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/bills/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Bill
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Bills List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {bills.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bills yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first bill.
            </p>
            <div className="mt-6">
              <Link to="/bills/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bill
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bills.map((bill) => (
              <li key={bill._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {bill.title}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </div>
                        {bill.createdBy && (
                          <div className="ml-6 flex items-center text-sm text-gray-500">
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {bill.createdBy.username}
                          </div>
                        )}
                      </div>
                      {bill.description && (
                        <p className="mt-1 text-sm text-gray-600">{bill.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/bills/${bill._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      {user?.role === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(bill._id)}
                          loading={deleteLoading === bill._id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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

export default Bills;
