import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { billsAPI } from '../../utils/api';
import Button from '../common/Button';
import Input from '../common/Input';
import { ArrowLeft } from 'lucide-react';

const CreateBill = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await billsAPI.create(formData);
      navigate(`/bills/${response.data._id}`);
    } catch (err) {
      console.error('Error creating bill:', err);
      
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorObj = {};
        err.response.data.errors.forEach(error => {
          errorObj[error.field] = error.message;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: err.response?.data?.message || 'Failed to create bill. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Create New Bill
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Start tracking a new shared expense
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Bill Title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="e.g., Weekend Trip, Dinner Out, Monthly Groceries"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Add any additional details about this bill..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/bills')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!formData.title}
              >
                Create Bill
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
