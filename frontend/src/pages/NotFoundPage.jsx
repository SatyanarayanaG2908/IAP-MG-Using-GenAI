// FILE PATH: frontend/src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Shared/Button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
            <div className="text-center animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/">
                        <Button
                            variant="primary"
                            size="lg"
                            icon={<Home className="w-5 h-5" />}
                        >
                            Go to Homepage
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
