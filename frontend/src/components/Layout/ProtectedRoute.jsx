// FILE PATH: frontend/src/components/Layout/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Shared/Loader';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader fullScreen text="Verifying authentication..." />;
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
