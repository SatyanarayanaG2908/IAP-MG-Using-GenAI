// FILE PATH: frontend/src/components/Shared/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDiagnosis } from '../../context/DiagnosisContext';
import { Menu, X, LogOut, LayoutDashboard, Activity, Heart } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { resetDiagnosis } = useDiagnosis();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };
    const isActive = (path) => location.pathname === path;

    // Always reset diagnosis before navigating to /diagnosis
    // This ensures symptom input page always shows fresh
    const handleNewDiagnosis = () => {
        setMobileMenuOpen(false);
        resetDiagnosis();
        // Use replace if already on /diagnosis to force remount
        if (location.pathname === '/diagnosis') {
            navigate('/dashboard');
            setTimeout(() => navigate('/diagnosis'), 10);
        } else {
            navigate('/diagnosis');
        }
    };

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <div className="w-10 h-10 bg-white border-2 border-red-100 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        </div>
                        <span className="text-xl font-black text-[#0f172a] tracking-tight hidden sm:block">IAP-MG Using GenAI</span>
                    </Link>

                    {isAuthenticated && (
                        <div className="hidden md:flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1">
                            <Link to="/dashboard" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/dashboard') ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>
                                <LayoutDashboard className="w-4 h-4" />Dashboard
                            </Link>
                            <button
                                onClick={handleNewDiagnosis}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/diagnosis') ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <Activity className="w-4 h-4" />New Diagnosis
                            </button>
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right border-r border-slate-200 pr-4">
                                    <p className="text-sm font-extrabold text-[#0f172a] leading-none mb-1">{user?.fullName}</p>
                                    <p className="text-xs font-medium text-slate-400 leading-none">{user?.email}</p>
                                </div>
                                <button onClick={handleLogout} className="w-10 h-10 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center transition-all group" title="Logout">
                                    <LogOut className="w-5 h-5 group-hover:scale-110" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Login</Link>
                                <Link to="/register" className="px-6 py-2.5 bg-[#0f172a] text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Register</Link>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        {mobileMenuOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3">
                    {isAuthenticated ? (
                        <>
                            <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-4">
                                <p className="font-extrabold text-slate-900">{user?.fullName}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>
                            <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`} onClick={() => setMobileMenuOpen(false)}>
                                <LayoutDashboard className="w-5 h-5" />Dashboard
                            </Link>
                            <button onClick={handleNewDiagnosis} className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl font-bold ${isActive('/diagnosis') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}>
                                <Activity className="w-5 h-5" />New Diagnosis
                            </button>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-rose-600 bg-rose-50">
                                <LogOut className="w-5 h-5" />Logout
                            </button>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Link to="/login" className="block w-full px-4 py-3 text-center font-bold text-slate-600 bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="block w-full px-4 py-3 text-center font-bold text-white bg-[#0f172a] rounded-xl" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};
export default Navbar;