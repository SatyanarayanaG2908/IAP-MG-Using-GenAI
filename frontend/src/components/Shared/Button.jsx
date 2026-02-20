// FILE PATH: frontend/src/components/Shared/Button.jsx

import React from 'react';
import Loader from './Loader';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    isLoading = false,
    icon = null,
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={buttonClasses}
        >
            {isLoading ? (
                <>
                    <Loader size="small" color="white" />
                    <span className="ml-2">Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;