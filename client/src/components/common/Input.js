import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  const inputClasses = `
    mt-1 block w-full px-3 py-2 border border-app-border rounded-md shadow-sm 
    placeholder-muted-text focus:outline-none focus:ring-primary-900 focus:border-primary-900 
    sm:text-sm text-primary-text bg-white ${error ? 'border-red-400 focus:ring-red-600 focus:border-red-600' : ''}
    ${className}
  `;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-primary-text">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
};

export default Input;
