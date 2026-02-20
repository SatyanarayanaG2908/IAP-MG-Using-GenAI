// FILE PATH: frontend/src/components/Shared/Card.jsx

import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    hover = false,
}) => {
    return (
        <div
            className={`
        bg-white rounded-xl shadow-md overflow-hidden
        ${hover ? 'card-shadow-hover' : ''}
        ${className}
      `}
        >
            {(title || subtitle) && (
                <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
                    {title && <h3 className="text-xl font-bold text-gray-800">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
            )}

            <div className={`p-6 ${bodyClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default Card;
