// FILE PATH: frontend/src/components/Shared/Select.jsx

import React from 'react';

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error = '',
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`
          w-full px-4 py-3 border-2 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
