// FILE PATH: frontend/src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, Shield, Globe } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#9FA4D4' }}>
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />

                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    {/* Logo & Title */}
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🏥</span>
                        </div>
                        {/* ✅ UPDATED TITLE */}
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            IAP-MG Using GenAI
                        </h1>
                        <p className="text-xl text-gray-600 mb-3">
                            AI-Powered Healthcare Guidance Platform
                        </p>
                        <p className="text-lg text-gray-500">
                            Get instant medical insights based on your symptoms
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
                            <ArrowRight className="w-5 h-5" />
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl transition-all shadow-lg border-2 border-gray-200 text-lg">
                            Login
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { number: '10+', label: 'Languages Supported', bg: 'from-blue-500 to-blue-600' },
                            { number: 'AI', label: 'Powered Analysis', bg: 'from-purple-500 to-purple-600' },
                            { number: '24/7', label: 'Available Anytime', bg: 'from-pink-500 to-pink-600' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100">
                                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.bg} text-transparent bg-clip-text mb-2`}>
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <Sparkles className="w-8 h-8 text-blue-600" />,
                                title: 'AI-Powered Analysis',
                                desc: 'Advanced Google Gemini AI analyzes your symptoms instantly',
                                bg: 'bg-blue-50',
                            },
                            {
                                icon: <Activity className="w-8 h-8 text-green-600" />,
                                title: 'Accurate Diagnosis',
                                desc: 'Get top 3 possible conditions with confidence scores',
                                bg: 'bg-green-50',
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-purple-600" />,
                                title: 'Safe & Secure',
                                desc: 'Your health data is encrypted and completely private',
                                bg: 'bg-purple-50',
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-orange-600" />,
                                title: 'Multi-Language',
                                desc: 'Available in 10+ Indian languages for accessibility',
                                bg: 'bg-orange-50',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className={`w-16 h-16 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-16 pt-8 border-t border-gray-200">
                        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                            <span className="text-red-500">❤️</span>
                            Made for better healthcare accessibility
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            🔒 Your health data is encrypted and secure
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;