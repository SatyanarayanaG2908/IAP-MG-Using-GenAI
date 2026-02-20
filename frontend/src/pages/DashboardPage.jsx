// FILE PATH: frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDiagnosis } from '../context/DiagnosisContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Shared/Navbar';
import { Plus, CheckCircle, FileText, Clock, Trash2, AlertTriangle, X, Eye, Settings, Globe, Check, Heart } from 'lucide-react';
import api from '../services/api';

const DeleteConfirmModal = ({ session, onConfirm, onCancel, loading, translate }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center"><AlertTriangle className="w-8 h-8 text-rose-600" /></div>
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{translate('deleteConfirm')}</h3>
            <p className="text-slate-500 text-sm mb-6">{translate('areYouSureDelete')}</p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <p className="text-sm font-bold text-slate-800 truncate">{session?.finalDisease || 'Diagnosis Session'}</p>
            </div>
            <p className="text-rose-600 text-xs mb-8 font-bold flex items-start gap-2"><span>⚠️</span><span>{translate('permanentAction')}</span></p>
            <div className="flex gap-3">
                <button onClick={onCancel} disabled={loading} className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50">{translate('cancel')}</button>
                <button onClick={onConfirm} disabled={loading} className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Trash2 className="w-4 h-4" /> {translate('delete')}</>}
                </button>
            </div>
        </div>
    </div>
);

const SettingsModal = ({ isOpen, onClose, currentLang, onLanguageChange, translate, availableLanguages }) => {
    const [tempLang, setTempLang] = useState(currentLang);
    const [confirming, setConfirming] = useState(false);
    if (!isOpen) return null;

    const handleConfirm = () => { if (tempLang === currentLang) { onClose(); return; } setConfirming(true); };
    const finalChange = () => { onLanguageChange(tempLang); setConfirming(false); onClose(); };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {!confirming ? (
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 border border-slate-100 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center"><Globe className="w-6 h-6 text-blue-600" /></div>
                            <h3 className="text-xl font-black text-slate-900">{translate('settings')}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-500" /></button>
                    </div>
                    <div className="space-y-3 mb-8">
                        <p className="text-sm font-bold text-slate-700 ml-1">{translate('changeLanguage')}</p>
                        <div className="grid grid-cols-1 gap-2">
                            {availableLanguages.map(lang => {
                                const langName = typeof lang === 'object' ? lang.name : lang;
                                const nativeName = typeof lang === 'object' ? lang.nativeName : lang;
                                return (
                                    <button key={langName} onClick={() => setTempLang(langName)}
                                        className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${tempLang === langName ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                                        <div className="flex flex-col items-start">
                                            <span>{langName}</span>
                                            {nativeName !== langName && <span className="text-xs opacity-60">{nativeName}</span>}
                                        </div>
                                        {tempLang === langName && <Check className="w-5 h-5" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <button onClick={handleConfirm} className="w-full py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-black text-sm">{translate('confirm')}</button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6"><Globe className="w-10 h-10 text-amber-600" /></div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">{translate('confirmLanguageChange')}</h3>
                    <p className="text-slate-500 text-sm mb-8">{translate('languageChangeCheck')} <span className="text-blue-600 font-bold">{tempLang}</span>?</p>
                    <div className="flex gap-3">
                        <button onClick={() => setConfirming(false)} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm">{translate('cancel')}</button>
                        <button onClick={finalChange} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm">{translate('confirm')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status, translate }) => {
    const map = {
        completed: { cls: 'bg-emerald-100 text-emerald-700', icon: '✅', labelKey: 'completed' },
        emergency: { cls: 'bg-rose-100 text-rose-700', icon: '🚨', labelKey: 'emergency' },
        analyzing: { cls: 'bg-blue-100 text-blue-700', icon: '⏳', labelKey: 'analyzing' },
    };
    const s = map[status] || { cls: 'bg-slate-100 text-slate-600', icon: '🕐', labelKey: 'pending' };
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.cls}`}>{s.icon} {translate(s.labelKey)}</span>;
};

const SessionCard = ({ session, index, onDelete, onView, translate }) => {
    const isCompleted = session.status === 'completed';
    const isEmergency = session.status === 'emergency';
    return (
        <div className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all hover:shadow-xl cursor-pointer group ${isCompleted ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300' : isEmergency ? 'bg-rose-50/50 border-rose-100 hover:border-rose-300' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${isCompleted ? 'bg-emerald-600 text-white' : isEmergency ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>#{index + 1}</div>
            <div className="flex-1 min-w-0" onClick={() => onView(session)}>
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <p className="font-extrabold text-[#0f172a] text-base truncate pr-2">{session.finalDisease || session.diseases?.[0]?.name || translate('analysisPending')}</p>
                    <StatusBadge status={session.status} translate={translate} />
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 min-w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        {session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-xs font-medium text-slate-500 truncate italic border-l border-slate-200 pl-4">
                        {typeof session.symptoms === 'string' ? session.symptoms.slice(0, 50) + (session.symptoms.length > 50 ? '...' : '') : translate('noSymptomsRecorded')}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onView(session); }} className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Eye className="w-5 h-5" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(session); }} className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { user, updateProfile } = useAuth();
    const { language, translate, changeLanguage, availableLanguages } = useLanguage();
    const navigate = useNavigate();
    const { resetDiagnosis } = useDiagnosis();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3000); };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/diagnosis/sessions');
            if (res.data.success) {
                const unique = res.data.sessions.reduce((acc, cur) => {
                    if (!acc.find(i => i.sessionId === cur.sessionId)) return acc.concat([cur]);
                    return acc;
                }, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSessions(unique);
            }
        } catch (err) { console.error(err.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchSessions(); }, []);

    const handleView = (s) => navigate(`/diagnosis/results/${s.sessionId}`);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/diagnosis/sessions/${deleteTarget.sessionId}`);
            setSessions(p => p.filter(s => s.sessionId !== deleteTarget.sessionId));
            showToast('success', translate('sessionDeletedSuccessfully'));
        } catch { setSessions(p => p.filter(s => s.sessionId !== deleteTarget.sessionId)); showToast('success', translate('sessionRemoved')); }
        finally { setDeleteLoading(false); setDeleteTarget(null); }
    };

    const handleLanguageUpdate = async (newLang) => {
        try {
            const res = await updateProfile({ preferredLanguage: newLang });
            if (res.success) { changeLanguage(newLang); showToast('success', translate('languageUpdated', { lang: newLang })); }
            else showToast('error', translate('failedToUpdateLanguage'));
        } catch { showToast('error', translate('somethingWentWrong')); }
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff0f5 100%)' }}>
            <Navbar />
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[100] px-8 py-4 rounded-[2rem] shadow-2xl text-sm font-black flex items-center gap-3 ${toast.type === 'success' ? 'bg-[#0f172a] text-white' : 'bg-rose-600 text-white'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'}`}>{toast.type === 'success' ? '✓' : '!'}</div>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">{translate('welcomeBackUser', { name: user?.fullName?.split(' ')[0] })} 👋</h1>
                        <p className="text-slate-500 font-bold text-lg">{translate('readyToStart')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSettingsOpen(true)} className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all">
                            <Settings className="w-6 h-6 text-slate-600" />
                        </button>
                        <button onClick={() => { resetDiagnosis(); navigate('/diagnosis'); }} className="px-8 py-4 bg-[#0f172a] text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl active:scale-95">
                            <Plus className="w-5 h-5" />{translate('startNewDiagnosis')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <FileText className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', count: sessions.length, label: 'totalSessions' },
                        { icon: <CheckCircle className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50', count: sessions.filter(s => s.status === 'completed').length, label: 'completed' },
                        { icon: <Globe className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-50', count: null, label: 'language', text: language },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-white hover:shadow-xl transition-all">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 ${stat.bg} rounded-3xl flex items-center justify-center`}>{stat.icon}</div>
                                <div>
                                    <p className="text-3xl font-black text-[#0f172a]">{stat.count !== null ? stat.count : stat.text}</p>
                                    <p className="text-sm font-bold text-slate-400 capitalize">{translate(stat.label)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl border-2 border-white/50 p-8 lg:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-[#0f172a]">{translate('recentSessions')}</h2>
                            <p className="text-slate-400 font-bold">{translate('historyDesc')}</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-16 h-16 border-8 border-slate-100 border-t-[#0f172a] rounded-full animate-spin" />
                            <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">{translate('syncingHealthData')}</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8"><FileText className="w-12 h-12 text-slate-200" /></div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{translate('noSessions')}</h3>
                            <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">{translate('startFirst')}</p>
                            <button onClick={() => { resetDiagnosis(); navigate('/diagnosis'); }} className="px-10 py-4 bg-[#0f172a] text-white rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">{translate('startNewDiagnosis')}</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session, index) => (
                                <SessionCard key={session.sessionId || index} session={session} index={index} onView={handleView} onDelete={setDeleteTarget} translate={translate} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {deleteTarget && <DeleteConfirmModal session={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} translate={translate} />}
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} currentLang={language} onLanguageChange={handleLanguageUpdate} translate={translate} availableLanguages={availableLanguages} />
        </div>
    );
};

export default DashboardPage;