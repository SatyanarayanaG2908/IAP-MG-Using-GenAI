// FILE PATH: frontend/src/components/Auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, Phone } from 'lucide-react';

const ForgotPassword = () => {
    const [resetType, setResetType] = useState('email'); // 'email' or 'phone'
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailOrPhone) {
            setError(`Please enter your ${resetType === 'email' ? 'email address' : 'phone number'}`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // TODO: Replace with actual API call
            // const response = await api.post('/auth/forgot-password', { 
            //     emailOrPhone, 
            //     type: resetType 
            // });

            setSuccess(true);
        } catch (err) {
            setError('Failed to send reset instructions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f0f4f8' }}>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

                {/* ✅ BACK TO HOME BUTTON */}
                <Link to="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 text-sm font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
                    <p className="text-gray-500 text-sm">
                        {success
                            ? 'Check your inbox for reset instructions'
                            : 'Enter your email or phone to reset your password'
                        }
                    </p>
                </div>

                {/* Success Message */}
                {success ? (
                    <div className="space-y-5 animate-fade-in">
                        <div className="p-4 bg-green-50 border border-green-300 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-green-800 font-semibold text-sm mb-1">
                                    Reset instructions sent!
                                </p>
                                <p className="text-green-700 text-xs leading-relaxed">
                                    {resetType === 'email'
                                        ? `We've sent password reset instructions to ${emailOrPhone}. Please check your inbox and spam folder.`
                                        : `We've sent a verification code to ${emailOrPhone}. Please check your messages.`
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-blue-800 text-sm mb-2 font-medium">📧 Didn't receive it?</p>
                            <ul className="text-blue-700 text-xs space-y-1 ml-4 list-disc">
                                <li>Check your spam/junk folder</li>
                                <li>Make sure the {resetType} is correct</li>
                                <li>Wait a few minutes and check again</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmailOrPhone('');
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                            Try Different {resetType === 'email' ? 'Email' : 'Phone'}
                        </button>

                        <Link to="/login"
                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Error Message */}
                        {error && (
                            <div className="mb-5 p-3 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2 animate-fade-in">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* ✅ RESET TYPE TOGGLE - EMAIL OR PHONE */}
                        <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-lg">
                            <button type="button"
                                onClick={() => {
                                    setResetType('email');
                                    setEmailOrPhone('');
                                    setError('');
                                }}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${resetType === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                    }`}>
                                <Mail className="w-4 h-4" />
                                Email
                            </button>
                            <button type="button"
                                onClick={() => {
                                    setResetType('phone');
                                    setEmailOrPhone('');
                                    setError('');
                                }}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${resetType === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                    }`}>
                                <Phone className="w-4 h-4" />
                                Phone
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email or Phone Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {resetType === 'email' ? 'Email Address' : 'Phone Number'}
                                </label>
                                <div className="relative">
                                    {resetType === 'email' ? (
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    )}
                                    <input
                                        type={resetType === 'email' ? 'email' : 'tel'}
                                        value={emailOrPhone}
                                        onChange={(e) => {
                                            setEmailOrPhone(e.target.value);
                                            setError('');
                                        }}
                                        disabled={loading}
                                        placeholder={resetType === 'email' ? 'john@example.com' : '+91 9876543210'}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {resetType === 'email'
                                        ? 'We\'ll send password reset instructions to this email'
                                        : 'We\'ll send a verification code to this phone number'
                                    }
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>Send Reset Instructions</>
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="text-center pt-4">
                            <Link to="/login"
                                className="text-sm text-gray-600 hover:text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}

                {/* Security Note */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center">
                        🔒 This is a secure password reset process
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;