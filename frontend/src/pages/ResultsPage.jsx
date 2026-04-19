// FILE PATH: frontend/src/pages/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import diagnosisService from '../services/diagnosisService';
import api from '../services/api';
import ConfidenceChart from '../components/Diagnosis/ConfidenceChart';
import DiseaseCard from '../components/Diagnosis/DiseaseCard';
import TreatmentPlan from '../components/Diagnosis/TreatmentPlan';
import DietPlan from '../components/Diagnosis/DietPlan';
import Precautions from '../components/Diagnosis/Precautions';
import RecoveryInfo from '../components/Diagnosis/RecoveryInfo';
import SMSSetupModal from '../components/Modals/SMSSetupModal';
import { ArrowLeft, Download, Mail, Bell, RefreshCw, AlertCircle, Shield, Loader2, CheckCircle, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-sm w-full">
        {toasts.map(t => (
            <div key={t.id} className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold border-2
                ${t.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-rose-200 text-rose-800'}`}>
                {t.type === 'success'
                    ? <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-4 h-4 text-white" /></div>
                    : <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0"><AlertCircle className="w-4 h-4 text-white" /></div>
                }
                <p className="flex-1">{t.message}</p>
                <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
        ))}
    </div>
);

const ResultsPage = () => {
    const { sessionId } = useParams();
    const { user } = useAuth();
    const { translate } = useLanguage();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [showSMSModal, setShowSMSModal] = useState(false);
    const [toasts, setToasts] = useState([]);

    const language = user?.language || user?.preferredLanguage || 'English';

    useEffect(() => { fetchSession(); }, [sessionId]);

    const fetchSession = async () => {
        try {
            const result = await diagnosisService.getSession(sessionId);
            if (result.success && result.data) setSession(result.data);
            else setError('Session not found');
        } catch { setError('Failed to load session'); }
        finally { setLoading(false); }
    };

    const addToast = (msg, type = 'info') => {
        const id = Date.now();
        setToasts(p => [...p, { id, message: msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
    };
    const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    const handleDownloadPDF = async () => {
        setPdfLoading(true);
        try {
            const response = await api.post('/pdf/generate', { sessionId, language }, { responseType: 'blob', timeout: 60000 });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = `Medical_Report_${sessionId}.pdf`;
            document.body.appendChild(link); link.click();
            setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
            addToast('PDF downloaded successfully!', 'success');
        } catch (err) { addToast(err.response?.data?.message || 'PDF failed', 'error'); }
        finally { setPdfLoading(false); }
    };

    const handleEmailReport = async () => {
        setEmailLoading(true);
        try {
            const response = await api.post('/email/send-report', { sessionId, language });
            if (response.data?.success || response.status === 200) addToast('Report sent to your email!', 'success');
            else addToast(response.data?.message || 'Failed to send email', 'error');
        } catch (err) { addToast(err.response?.data?.message || 'Email failed', 'error'); }
        finally { setEmailLoading(false); }
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading results...</p>
            </div>
        </div>
    );

    if (error || !session) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">Session Not Found</h2>
                <button onClick={() => navigate('/dashboard')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all mt-4">Back to Dashboard</button>
            </div>
        </div>
    );

    const diseases = session.diseases || [];
    const treatment = { medicines: session.treatment?.medicines || [] };
    const diet = session.diet || {};
    const precautions = session.precautions || [];
    const recovery = session.recovery || {};

    return (
        <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
            <Toast toasts={toasts} removeToast={removeToast} />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <div className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></div>
                        <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                    </button>
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">Diagnosis Results</p>
                        {session.createdAt && <p className="text-xs text-gray-400">{fmtDate(session.createdAt)}</p>}
                    </div>
                    <div className="w-24" />
                </div>
            </nav>

            {/* Content — max-w-4xl with white card wrappers (same as DiagnosisResults) */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

                {/* Chart — white card */}
                {diseases.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <ConfidenceChart diseases={diseases} />
                    </div>
                )}

                {/* Disease Cards — white card */}
                {diseases.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            <h3 className="text-xl font-black text-gray-900">Possible Conditions</h3>
                        </div>
                        <div className="space-y-4">
                            {diseases.map((disease, i) => (
                                <DiseaseCard key={i} disease={disease} rank={i + 1} isPrimary={i === 0} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Treatment — white card */}
                {treatment.medicines.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <TreatmentPlan treatment={treatment} />
                    </div>
                )}

                {/* Diet — white card */}
                {(diet?.recommended?.length > 0 || diet?.avoid?.length > 0) && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <DietPlan diet={diet} />
                    </div>
                )}

                {/* Precautions — white card */}
                {precautions.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <Precautions precautions={precautions} />
                    </div>
                )}

                {/* Recovery — white card */}
                {Object.keys(recovery).length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <RecoveryInfo recovery={recovery} />
                    </div>
                )}

                {/* Disclaimer */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-7 flex items-start gap-5">
                    <Shield className="w-7 h-7 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-blue-700 font-black uppercase tracking-widest text-[10px] mb-1">Medical Disclaimer</p>
                        <p className="text-blue-800 text-sm leading-relaxed font-medium">
                            This is an AI-powered guidance system for educational purposes only. Not a replacement for professional medical advice. Always consult a qualified healthcare provider. In emergencies, call 108 immediately.
                        </p>
                    </div>
                </div>

                {/* 4 Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-6">
                    <button onClick={handleDownloadPDF} disabled={pdfLoading}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95 disabled:opacity-60 shadow-sm">
                        <div className="w-10 h-10 bg-blue-600 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            {pdfLoading ? <Loader2 className="w-5 h-5 text-white group-hover:text-blue-600 animate-spin transition-colors duration-300" /> : <Download className="w-5 h-5 text-white group-hover:text-blue-600 transition-colors duration-300" />}
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-blue-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">{pdfLoading ? 'Generating...' : 'Download PDF'}</p>
                            <p className="text-blue-400 group-hover:text-blue-100 text-xs mt-0.5 transition-colors duration-300">Save full report</p>
                        </div>
                    </button>

                    <button onClick={handleEmailReport} disabled={emailLoading}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 active:scale-95 disabled:opacity-60 shadow-sm">
                        <div className="w-10 h-10 bg-emerald-500 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            {emailLoading ? <Loader2 className="w-5 h-5 text-white group-hover:text-emerald-600 animate-spin transition-colors duration-300" /> : <Mail className="w-5 h-5 text-white group-hover:text-emerald-600 transition-colors duration-300" />}
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-emerald-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">{emailLoading ? 'Sending...' : 'Email Report'}</p>
                            <p className="text-emerald-400 group-hover:text-emerald-100 text-xs mt-0.5 transition-colors duration-300">Send to your inbox</p>
                        </div>
                    </button>

                    <button onClick={() => setShowSMSModal(true)}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-amber-100 bg-amber-50 hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 active:scale-95 shadow-sm">
                        <div className="w-10 h-10 bg-amber-500 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            <Bell className="w-5 h-5 text-white group-hover:text-amber-500 transition-colors duration-300 group-hover:animate-bounce" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-amber-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">SMS Reminders</p>
                            <p className="text-amber-400 group-hover:text-amber-100 text-xs mt-0.5 transition-colors duration-300">Medicine alerts</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/diagnosis')}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-800 hover:border-slate-800 transition-all duration-300 active:scale-95 shadow-sm">
                        <div className="w-10 h-10 bg-slate-700 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            <RefreshCw className="w-5 h-5 text-white group-hover:text-slate-700 transition-colors duration-300 group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-slate-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">New Diagnosis</p>
                            <p className="text-slate-400 group-hover:text-slate-300 text-xs mt-0.5 transition-colors duration-300">Start fresh</p>
                        </div>
                    </button>
                </div>
            </div>

            {showSMSModal && (
                <SMSSetupModal
                    isOpen={showSMSModal}
                    onClose={() => setShowSMSModal(false)}
                    sessionId={sessionId}
                    topDisease={diseases?.[0]?.name}
                    medicines={treatment?.medicines || []}
                />
            )}
        </div>
    );
};

export default ResultsPage;