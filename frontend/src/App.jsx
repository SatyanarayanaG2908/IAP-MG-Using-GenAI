// FILE PATH: frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DiagnosisProvider } from './context/DiagnosisContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import useToast from './hooks/useToast';
import { ToastContainer } from './components/Shared/Toast';

// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DiagnosisPage from './pages/DiagnosisPage';
import SessionResultsPage from './pages/ResultsPage';
import SessionsPage from './pages/SessionsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import EmergencyAlert from './components/Modals/EmergencyAlert';

function AppContent() {
    const { toasts, removeToast } = useToast();

    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/diagnosis"
                    element={
                        <ProtectedRoute>
                            <DiagnosisPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/diagnosis/results/:sessionId"
                    element={
                        <ProtectedRoute>
                            <SessionResultsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sessions"
                    element={
                        <ProtectedRoute>
                            <SessionsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Emergency Route */}
                <Route path="/emergency" element={<EmergencyAlert />} />

                {/* 404 Not Found */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <LanguageProvider>
                        <DiagnosisProvider>
                            <AppContent />
                        </DiagnosisProvider>
                    </LanguageProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;