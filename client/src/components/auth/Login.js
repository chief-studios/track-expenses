import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { DollarSign } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

    const result = await login(formData);
    
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-text">
            Track and manage your shared expenses
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
              placeholder="Enter your username"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!formData.username || !formData.password}
            >
              Sign in
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-secondary-text">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-900 hover:text-primary-800">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
