import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-900 text-smoke-white-50 hover:bg-primary-800 focus:ring-primary-700 border border-primary-900',
    secondary: 'bg-smoke-white-200 text-primary-900 hover:bg-smoke-white-300 focus:ring-primary-600 border border-app-border',
    danger: 'bg-red-700 text-smoke-white-50 hover:bg-red-800 focus:ring-red-600 border border-red-700',
    outline: 'border border-primary-900 bg-white text-primary-900 hover:bg-smoke-white-100 focus:ring-primary-700',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
