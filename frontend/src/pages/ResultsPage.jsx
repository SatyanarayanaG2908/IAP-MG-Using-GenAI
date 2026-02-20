// FILE PATH: frontend/src/pages/ResultsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Shared/Navbar';
import Loader from '../components/Shared/Loader';
import ConfidenceChart from '../components/Diagnosis/ConfidenceChart';
import DiseaseCard from '../components/Diagnosis/DiseaseCard';
import TreatmentPlan from '../components/Diagnosis/TreatmentPlan';
import DietPlan from '../components/Diagnosis/DietPlan';
import Precautions from '../components/Diagnosis/Precautions';
import RecoveryInfo from '../components/Diagnosis/RecoveryInfo';
import SMSSetupModal from '../components/Modals/SMSSetupModal';
import { Download, Mail, Bell, RefreshCw, ArrowLeft, Shield, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const Toast = ({ toasts, removeToast }) => (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-sm w-full">
        {toasts.map(t => (
            <div key={t.id} className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold border-2 ${t.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-rose-200 text-rose-800'}`}>
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

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const add = useCallback((type, message) => {
        const id = Date.now();
        setToasts(p => [...p, { id, type, message }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
    }, []);
    return {
        toasts,
        removeToast: id => setToasts(p => p.filter(t => t.id !== id)),
        success: msg => add('success', msg),
        error: msg => add('error', msg)
    };
};

const ResultsPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language, translate } = useLanguage();
    const toast = useToast();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [showSMSModal, setShowSMSModal] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/diagnosis/sessions/${sessionId}`);
                if (res.data.success && res.data.session) {
                    setSession(res.data.session);
                } else {
                    setError('Session not found');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load session');
            } finally {
                setLoading(false);
            }
        };
        if (sessionId) fetchSession();
    }, [sessionId]);

    const handleDownloadPDF = async () => {
        setPdfLoading(true);
        try {
            const response = await api.post('/pdf/generate', {
                sessionId,
                language: language || 'English'
            }, { responseType: 'blob', timeout: 60000 });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Medical_Report_${sessionId}.pdf`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
            toast.success(translate('downloadedSuccessfully'));
        } catch (err) {
            const msg = err.response?.data?.message || err.message || translate('somethingWentWrong');
            toast.error('PDF Error: ' + msg);
        } finally {
            setPdfLoading(false);
        }
    };

    const handleSendEmail = async () => {
        setEmailLoading(true);
        try {
            const response = await api.post('/email/send-report', {
                sessionId,
                language: language || 'English'
            });
            if (response.data?.success) {
                toast.success(translate('reportSentTo', { email: user?.email }));
            } else {
                toast.error(response.data?.message || translate('somethingWentWrong'));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || translate('somethingWentWrong'));
        } finally {
            setEmailLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
            <Navbar />
            <Loader fullScreen text="Loading diagnosis results..." />
        </div>
    );

    if (error || !session) return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
            <Navbar />
            <div className="max-w-lg mx-auto px-4 py-20 text-center">
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
                    <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 mb-3">{translate('sessionNotFound')}</h2>
                    <p className="text-slate-500 mb-8">{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-3 mx-auto">
                        <ArrowLeft className="w-5 h-5" />{translate('backToDashboard')}
                    </button>
                </div>
            </div>
        </div>
    );

    // Build diagnosisResult from session data — same format as DiagnosisResults component
    const diagnosisResult = {
        diseases: session.diseases || [],
        treatment: session.treatment,
        diet: session.diet,
        precautions: session.precautions,
        recovery: session.recovery,
    };

    const { diseases, treatment, diet, precautions, recovery } = diagnosisResult;

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
            <Navbar />
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

            <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
                {/* Back button + header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-3 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-300 shadow-sm transition-all flex-shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#0f172a]">{translate('diagnosisResults')}</h1>
                        <p className="text-slate-400 font-medium text-sm">
                            {session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                        </p>
                    </div>
                </div>

                {/* Results header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{translate('analysisPoweredBy')}</p>
                    </div>
                    <h2 className="text-3xl font-black text-[#0f172a]">{translate('yourAiDiagnosisResults')}</h2>
                    {session.finalDisease && (
                        <p className="text-slate-500 font-semibold">Primary: <span className="text-blue-600 font-black">{session.finalDisease}</span></p>
                    )}
                </div>

                {/* Confidence Chart */}
                {diseases?.length > 0 && <ConfidenceChart diseases={diseases} />}

                {/* Disease Cards — same as DiagnosisResults */}
                {diseases?.length > 0 && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            <h3 className="text-xl font-black text-[#0f172a]">{translate('possibleConditions')}</h3>
                        </div>
                        <div className="space-y-4">
                            {diseases.map((disease, i) => (
                                <DiseaseCard key={i} disease={disease} rank={i + 1} isPrimary={i === 0} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Treatment, Diet, Precautions, Recovery */}
                {treatment && <TreatmentPlan treatment={treatment} />}
                {diet && <DietPlan diet={diet} />}
                {precautions && <Precautions precautions={precautions} />}
                {recovery && <RecoveryInfo recovery={recovery} />}

                {/* Disclaimer */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-7 flex items-start gap-5">
                    <Shield className="w-7 h-7 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-blue-700 font-black uppercase tracking-widest text-[10px] mb-1">{translate('medicalDisclaimer')}</p>
                        <p className="text-blue-800 text-sm leading-relaxed font-medium">{translate('disclaimerText')}</p>
                    </div>
                </div>

                {/* Action Buttons — same design as DiagnosisResults */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
                    <button onClick={handleDownloadPDF} disabled={pdfLoading}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-blue-200">
                        {pdfLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7 group-hover:scale-110 transition-transform" />}
                        <span className="text-sm text-center leading-tight">{pdfLoading ? translate('generating') : translate('downloadPDF')}</span>
                    </button>

                    <button onClick={handleSendEmail} disabled={emailLoading}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-emerald-200">
                        {emailLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Mail className="w-7 h-7 group-hover:scale-110 transition-transform" />}
                        <span className="text-sm text-center leading-tight">{emailLoading ? translate('sending') : translate('emailReport')}</span>
                    </button>

                    <button onClick={() => setShowSMSModal(true)}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-amber-200">
                        <Bell className="w-7 h-7 group-hover:scale-110 transition-transform group-hover:animate-bounce" />
                        <span className="text-sm text-center leading-tight">{translate('smsReminders')}</span>
                    </button>

                    <button onClick={() => navigate('/diagnosis')}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-slate-300">
                        <RefreshCw className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-sm text-center leading-tight">{translate('startNewDiagnosis')}</span>
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