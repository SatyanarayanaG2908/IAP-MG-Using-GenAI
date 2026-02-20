import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    User, Mail, Lock, Calendar, Users, Droplet, AlertCircle,
    CheckCircle, Loader2, Eye, EyeOff, ArrowLeft, Globe, Phone, Plus, X
} from 'lucide-react';

const RegisterPage = () => {
    const { register } = useAuth();
    const { changeLanguage } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        existingConditions: [],
        preferredLanguage: 'English',
    });

    const [currentCondition, setCurrentCondition] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const languages = [
        'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi'
    ];

    // Sync Age and DOB
    useEffect(() => {
        if (formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({ ...prev, age: age >= 0 ? age : '' }));
        }
    }, [formData.dateOfBirth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        if (name === 'preferredLanguage') {
            changeLanguage(value);
        }
    };

    const addCondition = () => {
        if (currentCondition.trim()) {
            setFormData(prev => ({
                ...prev,
                existingConditions: [...new Set([...prev.existingConditions, currentCondition.trim()])]
            }));
            setCurrentCondition('');
        }
    };

    const removeCondition = (condition) => {
        setFormData(prev => ({
            ...prev,
            existingConditions: prev.existingConditions.filter(c => c !== condition)
        }));
    };

    const validateForm = () => {
        if (!/^[a-zA-Z ]{2,}$/.test(formData.fullName)) return "Invalid Full Name (Min 2 chars, alphabets only)";
        if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) return "Age must be between 1 and 120";
        if (new Date(formData.dateOfBirth) > new Date()) return "Date of Birth cannot be in the future";
        if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) return "Phone must be exactly 10 digits";
        if (formData.password.length < 6) return "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                ...formData,
                email: formData.email.toLowerCase(),
                phone: formData.phone.replace(/\D/g, '')
            });

            if (result.success) {
                setSuccess('Account created! Auto-logging in...');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('System error. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-12 font-sans">
            <div className="bg-white rounded-[2rem] shadow-2xl flex flex-col lg:flex-row w-full max-w-6xl overflow-hidden ring-1 ring-slate-200">
                {/* Visual Panel */}
                <div className="lg:w-1/3 bg-[#0f172a] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl font-extrabold mb-4">IAP-MG Using GenAI</h1>
                        <p className="text-slate-400 text-lg font-medium">Create Your Account</p>
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="p-6 bg-slate-800/40 rounded-2xl ring-1 ring-white/10 backdrop-blur-sm">
                            <p className="text-sm italic text-slate-300">"Your health is your most valuable asset. Protect it with AI-powered precision."</p>
                        </div>
                        <p className="text-xs text-slate-500">© 2026 IAP-MG Secure Systems</p>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="lg:w-2/3 p-8 lg:p-16 overflow-y-auto max-h-[90vh]">
                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-semibold text-sm">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 animate-in fade-in slide-in-from-top-4">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-semibold text-sm">{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                                        placeholder="Your Name" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                        placeholder="email@example.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                                </div>
                            </div>

                            {/* DOB */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Date of Birth *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                                </div>
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Age *</label>
                                <input type="number" name="age" value={formData.age} readOnly
                                    className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-bold" />
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Gender *</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select name="gender" value={formData.gender} onChange={handleChange} required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Phone Number *</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                        placeholder="10-digit number" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                                </div>
                            </div>

                            {/* Language */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Preferred Language *</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
                                        {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Blood Group */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Blood Group</label>
                                <div className="relative">
                                    <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
                                        <option value="">Optional</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                                        placeholder="Min 6 characters" className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                                        placeholder="Match password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
                                </div>
                            </div>
                        </div>

                        {/* Medical Conditions Tags */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Existing Medical Conditions</label>
                            <div className="flex gap-2">
                                <input type="text" value={currentCondition} onChange={(e) => setCurrentCondition(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                                    placeholder="e.g. Diabetes, Asthma" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 transition-all font-medium" />
                                <button type="button" onClick={addCondition} className="px-6 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                {formData.existingConditions.length === 0 && <p className="text-slate-400 text-xs italic p-1">No conditions added yet (Optional)</p>}
                                {formData.existingConditions.map(condition => (
                                    <span key={condition} className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 animate-in zoom-in duration-200 shadow-lg shadow-blue-500/20">
                                        {condition}
                                        <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" onClick={() => removeCondition(condition)} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-slate-500 text-sm font-medium">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-2">Login</Link></p>
                            <button type="submit" disabled={loading}
                                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</div> : "Register"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
