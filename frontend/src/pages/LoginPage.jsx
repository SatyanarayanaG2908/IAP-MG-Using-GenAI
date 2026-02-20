import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, ShieldCheck, Activity } from 'lucide-react';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData.emailOrPhone, formData.password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('System error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc]">
            {/* Left Side - Visual Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>

                <div className="relative z-10">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
                        IAP-MG Using GenAI
                    </h1>
                    <p className="text-xl text-slate-400 max-w-md font-medium">
                        Secure access to your personal health records powered by advanced Generative AI.
                    </p>
                </div>

                <div className="relative z-10 flex gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Real-time</p>
                            <p className="text-slate-500 text-xs">Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Secure</p>
                            <p className="text-slate-500 text-xs">Encryption</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                            <p className="text-rose-600 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Email / Phone
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="emailOrPhone"
                                    value={formData.emailOrPhone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email or phone"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-white px-1"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98] mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors decoration-2 underline-offset-4 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;