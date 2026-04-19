// FILE PATH: frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useDiagnosis } from '../context/DiagnosisContext';
import diagnosisService from '../services/diagnosisService';
import {
    Activity, Plus, Settings, Eye, Trash2, AlertCircle,
    CheckCircle, Globe, FileText, LogOut, User, Mail,
    Phone, Calendar, Droplet, X, ChevronDown
} from 'lucide-react';

const LANGUAGES = [
    'English', 'Telugu', 'Hindi', 'Tamil', 'Kannada',
    'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi'
];

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const { changeLanguage } = useLanguage();
    const { resetDiagnosis } = useDiagnosis();
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, sessionId: null });
    const [toasts, setToasts] = useState([]);
    const [selectedLang, setSelectedLang] = useState('English');
    const profileRef = useRef(null);

    const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'User';
    const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
    const language = user?.language || user?.preferredLanguage || 'English';

    useEffect(() => { setSelectedLang(language); }, [language]);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target))
                setShowProfileDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => { fetchSessions(); }, []);

    const fetchSessions = async () => {
        try {
            const result = await diagnosisService.getDiagnosisSessions();
            if (result.success) {
                const unique = Array.from(
                    new Map((result.data || []).map(s => [s.sessionId, s])).values()
                ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSessions(unique);
            }
        } catch { addToast('Failed to load sessions', 'error'); }
        finally { setLoading(false); }
    };

    const addToast = (msg, type = 'info') => {
        const id = Date.now();
        setToasts(p => [...p, { id, message: msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };

    const handleNewDiagnosis = () => { resetDiagnosis(); navigate('/diagnosis', { replace: true }); };
    const handleSessionClick = (sid) => navigate(`/diagnosis/results/${sid}`);
    const handleLanguageSave = () => { changeLanguage(selectedLang); addToast(`Language: ${selectedLang}`, 'success'); setShowSettings(false); };
    const handleDelete = () => { setSessions(p => p.filter(s => s.sessionId !== deleteModal.sessionId)); addToast('Deleted', 'success'); setDeleteModal({ show: false, sessionId: null }); };

    const completedCount = sessions.filter(s => s.status === 'completed').length;
    const statusCls = (s) => s === 'completed' ? 'bg-emerald-100 text-emerald-700' : s === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
    const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>

            {/* Toasts */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in ${t.type === 'success' ? 'bg-emerald-500 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}`}>
                        {t.message}
                    </div>
                ))}
            </div>

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
                    {/* Logo → homepage */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">❤</span>
                        </div>
                        <span className="font-bold text-gray-900 text-base">IAP-MG Using GenAI</span>
                    </Link>

                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">
                            <FileText className="w-4 h-4" />Dashboard
                        </button>
                        <button onClick={handleNewDiagnosis} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Activity className="w-4 h-4" />New Diagnosis
                        </button>
                    </div>

                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                {firstName[0]?.toUpperCase()}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{firstName}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[140px]">{user?.email}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                                <div className="bg-gradient-to-r from-blue-500 to-violet-600 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-lg font-bold">
                                            {firstName[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{fullName}</p>
                                            <p className="text-blue-100 text-xs truncate max-w-[150px]">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowProfileDropdown(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-3 space-y-1">
                                    {[
                                        { icon: <User className="w-3.5 h-3.5 text-blue-500" />, label: 'Full Name', value: fullName },
                                        { icon: <Mail className="w-3.5 h-3.5 text-violet-500" />, label: 'Email', value: user?.email },
                                        { icon: <Phone className="w-3.5 h-3.5 text-green-500" />, label: 'Phone', value: user?.phone || 'N/A' },
                                        { icon: <Calendar className="w-3.5 h-3.5 text-orange-500" />, label: 'Age', value: user?.age ? `${user.age} years` : 'N/A' },
                                        { icon: <Droplet className="w-3.5 h-3.5 text-red-500" />, label: 'Blood Group', value: user?.bloodGroup || 'N/A' },
                                        { icon: <Globe className="w-3.5 h-3.5 text-teal-500" />, label: 'Language', value: language },
                                    ].map(({ icon, label, value }) => (
                                        <div key={label} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50">
                                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
                                            <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">{value}</p></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-3 pb-3">
                                    <button onClick={() => { setShowProfileDropdown(false); logout(); }}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold text-sm transition-all">
                                        <LogOut className="w-4 h-4" />Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{firstName}</span> 👋
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">Ready to start a new health assessment today?</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowSettings(true)}
                            className="w-10 h-10 bg-white border border-gray-200 hover:border-blue-300 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm" title="Change Language">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={handleNewDiagnosis}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200/60 transition-all active:scale-95 text-sm">
                            <Plus className="w-5 h-5" />Start New Diagnosis
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: <FileText className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50', value: sessions.length, label: 'Total Sessions' },
                        { icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50', value: completedCount, label: 'Completed' },
                        { icon: <Globe className="w-6 h-6 text-violet-500" />, bg: 'bg-violet-50', value: language, label: 'Language' },
                    ].map(({ icon, bg, value, label }) => (
                        <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
                            <div><p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p><p className="text-sm text-gray-500 mt-0.5">{label}</p></div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900 text-lg">Recent Diagnosis Sessions</h2>
                        <p className="text-sm text-gray-400">Your health assessment history</p>
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-sm text-gray-400">Loading sessions...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center"><FileText className="w-8 h-8 text-gray-300" /></div>
                            <div className="text-center"><p className="font-semibold text-gray-700">No diagnosis sessions yet</p><p className="text-sm text-gray-400 mt-1">Start your first AI-powered health assessment</p></div>
                            <button onClick={handleNewDiagnosis} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all">Start First Diagnosis</button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {sessions.map(session => (
                                <div key={session.sessionId} onClick={() => handleSessionClick(session.sessionId)}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${session.status === 'completed' ? 'bg-emerald-100' : session.status === 'emergency' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                            <Activity className={`w-5 h-5 ${session.status === 'completed' ? 'text-emerald-600' : session.status === 'emergency' ? 'text-red-600' : 'text-blue-600'}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{session.finalDisease || 'Diagnosis Incomplete'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{session.symptoms?.substring(0, 60)}{session.symptoms?.length > 60 ? '...' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-xs text-gray-400 hidden sm:block">{fmtDate(session.createdAt)}</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCls(session.status)}`}>{session.status}</span>
                                        <div className="flex items-center gap-1">
                                            <button onClick={(e) => { e.stopPropagation(); navigate(`/diagnosis/results/${session.sessionId}`); }} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4 text-blue-500" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ show: true, sessionId: session.sessionId }); }} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Settings/Language Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" />Preferred Language</h3>
                            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-5">
                            {LANGUAGES.map(lang => (
                                <button key={lang} onClick={() => setSelectedLang(lang)}
                                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${selectedLang === lang ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}>
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSettings(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
                            <button onClick={handleLanguageSave} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6 text-red-500" /></div>
                        <h3 className="text-lg font-bold text-gray-900 text-center">Delete Session?</h3>
                        <p className="text-sm text-gray-500 text-center mt-2">⚠️ This action cannot be undone.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setDeleteModal({ show: false, sessionId: null })} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;