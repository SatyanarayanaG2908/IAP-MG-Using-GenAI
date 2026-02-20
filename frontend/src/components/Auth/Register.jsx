// FILE PATH: frontend/src/components/Auth/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import useToast from '../../hooks/useToast';
import AuthLayout from '../Layout/AuthLayout';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Button from '../Shared/Button';
import { validateRegistrationForm } from '../../utils/validators';
import { GENDER_OPTIONS, BLOOD_GROUPS, COMMON_CONDITIONS } from '../../utils/constants';
import { User, Mail, Phone, Calendar, Lock } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const { availableLanguages } = useLanguage();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        dateOfBirth: '',
        gender: '',
        language: 'English',
        bloodGroup: '',
        medicalConditions: [],
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleMedicalConditionsChange = (e) => {
        const value = e.target.value;
        if (value === 'None') {
            setFormData(prev => ({ ...prev, medicalConditions: ['None'] }));
        } else {
            const conditions = formData.medicalConditions.filter(c => c !== 'None');
            if (conditions.includes(value)) {
                setFormData(prev => ({
                    ...prev,
                    medicalConditions: conditions.filter(c => c !== value),
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    medicalConditions: [...conditions, value],
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateRegistrationForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            showError('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData);

            if (result.success) {
                success('Account created successfully! Welcome aboard!');
                navigate('/dashboard');
            } else {
                showError(result.message || 'Registration failed');
            }
        } catch (err) {
            showError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Your Account"
            subtitle="Join our AI-powered healthcare guidance platform"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        error={errors.firstName}
                        required
                        icon={<User className="w-5 h-5" />}
                    />

                    <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        error={errors.lastName}
                        required
                        icon={<User className="w-5 h-5" />}
                    />
                </div>

                {/* Email */}
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    error={errors.email}
                    required
                    icon={<Mail className="w-5 h-5" />}
                />

                {/* Phone */}
                <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    error={errors.phone}
                    required
                    icon={<Phone className="w-5 h-5" />}
                />

                {/* Age and DOB */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="25"
                        error={errors.age}
                        required
                    />

                    <Input
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={errors.dateOfBirth}
                        required
                        icon={<Calendar className="w-5 h-5" />}
                    />
                </div>

                {/* Gender */}
                <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={GENDER_OPTIONS}
                    error={errors.gender}
                    required
                />

                {/* Preferred Language */}
                <Select
                    label="Preferred Language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    options={availableLanguages.map(lang => ({
                        value: lang.name,
                        label: `${lang.nativeName} (${lang.name})`,
                    }))}
                    error={errors.language}
                    required
                />

                {/* Blood Group */}
                <Select
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    options={BLOOD_GROUPS}
                    placeholder="Select blood group (optional)"
                />

                {/* Medical Conditions */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Existing Medical Conditions
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {COMMON_CONDITIONS.map(condition => (
                            <label
                                key={condition}
                                className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    value={condition}
                                    checked={formData.medicalConditions.includes(condition)}
                                    onChange={handleMedicalConditionsChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{condition}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Password */}
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    error={errors.password}
                    required
                    icon={<Lock className="w-5 h-5" />}
                />

                {/* Confirm Password */}
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    error={errors.confirmPassword}
                    required
                    icon={<Lock className="w-5 h-5" />}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                    className="mt-6"
                >
                    Create Account
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;
