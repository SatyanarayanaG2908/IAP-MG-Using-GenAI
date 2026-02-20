// FILE PATH: frontend/src/components/Layout/AuthLayout.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                            <span className="text-4xl">🩺</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-4">
                        Smart Medical Diagnosis
                    </h1>
                    <p className="text-blue-100 mt-2">
                        AI-Powered Healthcare Guidance
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                    {title && (
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                            {subtitle && (
                                <p className="text-gray-600 mt-2">{subtitle}</p>
                            )}
                        </div>
                    )}

                    {children}
                </div>

                {/* Disclaimer */}
                <div className="mt-6 text-center">
                    <p className="text-white text-sm opacity-90">
                        🔒 Your health data is encrypted and secure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
