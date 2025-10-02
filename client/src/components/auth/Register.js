import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { DollarSign } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'data-entry',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

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

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);
    
    if (!result.success) {
      if (typeof result.error === 'string') {
        setErrors({ general: result.error });
      } else if (Array.isArray(result.error)) {
        // Handle validation errors from express-validator
        const errorObj = {};
        result.error.forEach(err => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-900 rounded-lg flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-smoke-white-50" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-text">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-text">
            Join us to start tracking expenses
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Choose a username"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a password (min 8 characters)"
            />
            
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />
            
            <div>
              <label className="block text-sm font-medium text-primary-text">
                Role <span className="text-red-600 ml-1">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-app-border rounded-md shadow-sm focus:outline-none focus:ring-primary-900 focus:border-primary-900 sm:text-sm text-primary-text bg-white"
              >
                <option value="data-entry">Data Entry</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-700">{errors.role}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!formData.username || !formData.email || !formData.password || !formData.confirmPassword}
            >
              Create Account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-secondary-text">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-900 hover:text-primary-800">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
