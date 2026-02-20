// FILE PATH: frontend/src/components/Auth/ResetPassword.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import useToast from '../../hooks/useToast';
import AuthLayout from '../Layout/AuthLayout';
import Input from '../Shared/Input';
import Button from '../Shared/Button';
import { Lock, Shield } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, error: showError } = useToast();

    const email = location.state?.email || '';

    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            showError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await authService.resetPassword({
                email,
                otp: formData.otp,
                newPassword: formData.newPassword,
            });

            if (result.success) {
                success('Password reset successful! Please login.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                showError(result.message || 'Password reset failed');
            }
        } catch (err) {
            showError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter the OTP sent to your email"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="OTP (6 digits)"
                    name="otp"
                    type="text"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="123456"
                    required
                    icon={<Shield className="w-5 h-5" />}
                    inputClassName="text-center text-2xl tracking-widest font-bold"
                />

                <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    required
                    icon={<Lock className="w-5 h-5" />}
                />

                <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    icon={<Lock className="w-5 h-5" />}
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                >
                    Reset Password
                </Button>

                <Link
                    to="/login"
                    className="block text-center text-sm text-gray-600 hover:text-gray-800"
                >
                    Back to Login
                </Link>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;