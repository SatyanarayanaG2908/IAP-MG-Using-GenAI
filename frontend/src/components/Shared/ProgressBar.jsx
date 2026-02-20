// FILE PATH: frontend/src/components/Shared/ProgressBar.jsx

import React from 'react';

const ProgressBar = ({
    current,
    total,
    showSteps = true,
    className = ''
}) => {
    const percentage = (current / total) * 100;

    return (
        <div className={`w-full ${className}`}>
            {showSteps && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Step {current} of {total}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
