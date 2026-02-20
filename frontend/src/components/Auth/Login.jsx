// FILE PATH: frontend/src/components/Auth/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import AuthLayout from '../Layout/AuthLayout';
import Input from '../Shared/Input';
import Button from '../Shared/Button';
import { validateLoginForm } from '../../utils/validators';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateLoginForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData);

            if (result.success) {
                success('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 500);
            } else {
                showError(result.message || 'Login failed');
            }
        } catch (err) {
            showError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to access your medical guidance dashboard"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email or Phone"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com or 9876543210"
                    error={errors.email}
                    required
                    icon={<Mail className="w-5 h-5" />}
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                    required
                    icon={<Lock className="w-5 h-5" />}
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-600">Remember me</span>
                    </label>

                    <Link
                        to="/forgot-password"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                >
                    Login
                </Button>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Register here
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;

