// FILE PATH: frontend/src/components/Shared/Footer.jsx

import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 text-sm">
                            &copy; {new Date().getFullYear()} IAP-MG Using GenAI. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            AI-Powered Healthcare Guidance Platform
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span>for better healthcare accessibility</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                        <strong>Disclaimer:</strong> This is an AI-powered medical guidance system for educational purposes only.
                        Not a replacement for professional medical advice. Always consult a qualified healthcare provider.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;