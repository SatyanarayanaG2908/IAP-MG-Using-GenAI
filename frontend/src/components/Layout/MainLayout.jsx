// FILE PATH: frontend/src/components/Layout/MainLayout.jsx

import React from 'react';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Navbar />

            <main className="flex-1 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
