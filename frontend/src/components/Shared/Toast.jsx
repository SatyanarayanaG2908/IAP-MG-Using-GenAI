// FILE PATH: frontend/src/components/Shared/Toast.jsx

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({
    message,
    type = 'info',
    onClose,
    duration = 5000,
    position = 'top-right'
}) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const types = {
        success: {
            bg: 'bg-green-50 border-green-500',
            text: 'text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        },
        error: {
            bg: 'bg-red-50 border-red-500',
            text: 'text-red-800',
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        },
        warning: {
            bg: 'bg-yellow-50 border-yellow-500',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        },
        info: {
            bg: 'bg-blue-50 border-blue-500',
            text: 'text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-500" />,
        },
    };

    const positions = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    };

    const config = types[type] || types.info;

    return (
        <div
            className={`
        fixed ${positions[position]} z-50
        ${config.bg} ${config.text}
        border-l-4 rounded-lg shadow-lg
        p-4 min-w-[300px] max-w-md
        flex items-start gap-3
        animate-fade-in
      `}
        >
            {config.icon}

            <div className="flex-1">
                <p className="font-medium">{message}</p>
            </div>

            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                    position={toast.position}
                />
            ))}
        </>
    );
};

export default Toast;
