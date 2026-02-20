// FILE PATH: frontend/src/components/Shared/Loader.jsx
// FIXED: Improved loading animations with multiple styles

import React from 'react';

const Loader = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false,
    color = 'blue',
    type = 'spinner' // 'spinner', 'dots', 'pulse'
}) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
    };

    const colors = {
        blue: 'border-blue-600',
        purple: 'border-purple-600',
        green: 'border-green-600',
    };

    const bgColors = {
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        green: 'bg-green-600',
    };

    const spinnerLoader = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`
                    ${sizes[size]} 
                    border-4 border-gray-200 
                    ${colors[color]}
                    border-t-transparent
                    rounded-full 
                    animate-spin
                `}
            />
            {text && (
                <p className="text-gray-600 font-medium animate-pulse">{text}</p>
            )}
        </div>
    );

    const dotsLoader = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex space-x-2">
                <div className={`w-3 h-3 ${bgColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                <div className={`w-3 h-3 ${bgColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                <div className={`w-3 h-3 ${bgColors[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
            </div>
            {text && (
                <p className="text-gray-600 font-medium">{text}</p>
            )}
        </div>
    );

    const pulseLoader = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center">
                <div className={`${sizes[size]} ${bgColors[color]} rounded-full animate-ping absolute opacity-75`}></div>
                <div className={`${sizes[size]} ${bgColors[color]} rounded-full relative`}></div>
            </div>
            {text && (
                <p className="text-gray-600 font-medium animate-pulse">{text}</p>
            )}
        </div>
    );

    let loader;
    switch (type) {
        case 'dots':
            loader = dotsLoader;
            break;
        case 'pulse':
            loader = pulseLoader;
            break;
        default:
            loader = spinnerLoader;
    }

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
                {loader}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {loader}
        </div>
    );
};

export default Loader;