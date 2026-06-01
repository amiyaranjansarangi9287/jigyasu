import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  id: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, required, id, className = '', ...props }, ref) => {
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="mb-4">
        {label && (
          <label 
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${error ? errorId + ' ' : ''}${helperText ? helperId : ''}`}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'
          } ${className}`}
          {...props}
        />
        
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
