// FILE PATH: frontend/src/components/Diagnosis/DiagnosisResults.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiagnosis } from '../../context/DiagnosisContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Loader from '../Shared/Loader';
import ConfidenceChart from './ConfidenceChart';
import DiseaseCard from './DiseaseCard';
import TreatmentPlan from './TreatmentPlan';
import DietPlan from './DietPlan';
import Precautions from './Precautions';
import RecoveryInfo from './RecoveryInfo';
import SMSSetupModal from '../Modals/SMSSetupModal';
import { Download, RefreshCw, Bell, Mail, CheckCircle, AlertCircle, X, Shield, Loader2, Sparkles } from 'lucide-react';
import api from '../../services/api';

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

const useToastLocal = () => {
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
        error: msg => add('error', msg),
    };
};

const DiagnosisResults = ({ onRestart }) => {
    const { currentSession, diagnosisResult, loading, error: diagnosisError, analyzeDiagnosis } = useDiagnosis();
    const { user } = useAuth();
    const { language, translate } = useLanguage();
    const navigate = useNavigate();
    const { sessionId: urlSessionId } = useParams();
    const toast = useToastLocal();
    const [analyzing, setAnalyzing] = useState(false);
    const [showSMSModal, setShowSMSModal] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const activeSessionId = currentSession || urlSessionId;

    const performAnalysis = useCallback(async () => {
        setAnalyzing(true);
        const result = await analyzeDiagnosis(language);
        if (!result.success) toast.error(result.message || translate('somethingWentWrong'));
        setAnalyzing(false);
    }, [analyzeDiagnosis, language, translate]);

    useEffect(() => {
        if (!diagnosisResult && activeSessionId) performAnalysis();
    }, [diagnosisResult, activeSessionId]);

    const handleDownloadPDF = async () => {
        if (!activeSessionId) { toast.error(translate('sessionNotFound')); return; }
        setPdfLoading(true);
        try {
            const response = await api.post('/pdf/generate', { sessionId: activeSessionId, language: language || 'English' }, { responseType: 'blob', timeout: 60000 });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = `Medical_Report_${activeSessionId}.pdf`;
            document.body.appendChild(link); link.click();
            setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
            toast.success(translate('downloadedSuccessfully'));
        } catch (err) { toast.error(err.response?.data?.message || translate('somethingWentWrong')); }
        finally { setPdfLoading(false); }
    };

    const handleSendEmail = async () => {
        if (!activeSessionId) { toast.error(translate('sessionNotFound')); return; }
        setEmailLoading(true);
        try {
            const response = await api.post('/email/send-report', { sessionId: activeSessionId, language: language || 'English' });
            if (response.data?.success || response.status === 200) toast.success(translate('reportSentTo', { email: user?.email }));
            else toast.error(response.data?.message || translate('somethingWentWrong'));
        } catch (err) { toast.error(err.response?.data?.message || translate('somethingWentWrong')); }
        finally { setEmailLoading(false); }
    };

    if (analyzing || loading) return <Loader fullScreen text={translate('aiAnalyzingSymptoms')} />;

    if (diagnosisError) return (
        <div className="max-w-lg mx-auto py-12 text-center">
            <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-12">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-rose-900 mb-3">{translate('analysisFailed')}</h3>
                <p className="text-rose-500 mb-8 text-sm">{diagnosisError}</p>
                <button onClick={performAnalysis} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black flex items-center gap-3 mx-auto hover:bg-rose-700 transition-all">
                    <RefreshCw className="w-5 h-5" />{translate('tryAgain')}
                </button>
            </div>
        </div>
    );

    if (!diagnosisResult?.diseases) return (
        <div className="max-w-lg mx-auto py-12 text-center">
            <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-12">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-3">{translate('noDiagnosisAvailable')}</h3>
                <button onClick={onRestart || (() => navigate('/diagnosis'))} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 mx-auto hover:bg-blue-700 transition-all">
                    <RefreshCw className="w-5 h-5" />{translate('startOver')}
                </button>
            </div>
        </div>
    );

    const { diseases, treatment, diet, precautions, recovery } = diagnosisResult;

    return (
        <>
            <Toast toasts={toast.toasts} removeToast={toast.removeToast} />

            <div className="max-w-4xl mx-auto space-y-10 pb-10">

                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{translate('analysisPoweredBy')}</p>
                    </div>
                    <h2 className="text-3xl font-black text-[#0f172a]">{translate('yourAiDiagnosisResults')}</h2>
                </div>

                {diseases?.length > 0 && <ConfidenceChart diseases={diseases} />}

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

                {/* ── 4 Action Buttons — decent colors + animations ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Download PDF — Blue */}
                    <button onClick={handleDownloadPDF} disabled={pdfLoading}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                        <div className="w-10 h-10 bg-blue-600 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            {pdfLoading
                                ? <Loader2 className="w-5 h-5 text-white group-hover:text-blue-600 animate-spin transition-colors duration-300" />
                                : <Download className="w-5 h-5 text-white group-hover:text-blue-600 transition-colors duration-300 group-hover:-translate-y-0.5 group-hover:transition-transform" />
                            }
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-blue-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">
                                {pdfLoading ? 'Generating...' : (translate('downloadPDF') || 'Download PDF')}
                            </p>
                            <p className="text-blue-400 group-hover:text-blue-100 text-xs mt-0.5 transition-colors duration-300">Save full report</p>
                        </div>
                    </button>

                    {/* Email Report — Emerald */}
                    <button onClick={handleSendEmail} disabled={emailLoading}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                        <div className="w-10 h-10 bg-emerald-500 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            {emailLoading
                                ? <Loader2 className="w-5 h-5 text-white group-hover:text-emerald-600 animate-spin transition-colors duration-300" />
                                : <Mail className="w-5 h-5 text-white group-hover:text-emerald-600 transition-colors duration-300" />
                            }
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-emerald-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">
                                {emailLoading ? 'Sending...' : (translate('emailReport') || 'Email Report')}
                            </p>
                            <p className="text-emerald-400 group-hover:text-emerald-100 text-xs mt-0.5 transition-colors duration-300">Send to your inbox</p>
                        </div>
                    </button>

                    {/* SMS Reminders — Amber */}
                    <button onClick={() => setShowSMSModal(true)}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-amber-100 bg-amber-50 hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 active:scale-95 shadow-sm">
                        <div className="w-10 h-10 bg-amber-500 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            <Bell className="w-5 h-5 text-white group-hover:text-amber-500 transition-colors duration-300 group-hover:animate-bounce" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-amber-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">
                                {translate('smsReminders') || 'SMS Reminders'}
                            </p>
                            <p className="text-amber-400 group-hover:text-amber-100 text-xs mt-0.5 transition-colors duration-300">Medicine alerts</p>
                        </div>
                    </button>

                    {/* New Diagnosis — Slate */}
                    <button onClick={onRestart || (() => navigate('/diagnosis'))}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-800 hover:border-slate-800 transition-all duration-300 active:scale-95 shadow-sm">
                        <div className="w-10 h-10 bg-slate-700 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300">
                            <RefreshCw className="w-5 h-5 text-white group-hover:text-slate-700 transition-colors duration-300 group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="font-bold text-slate-700 group-hover:text-white text-sm leading-tight transition-colors duration-300">
                                {translate('startNewDiagnosis') || 'New Diagnosis'}
                            </p>
                            <p className="text-slate-400 group-hover:text-slate-300 text-xs mt-0.5 transition-colors duration-300">Start fresh</p>
                        </div>
                    </button>

                </div>

                {showSMSModal && (
                    <SMSSetupModal
                        isOpen={showSMSModal}
                        onClose={() => setShowSMSModal(false)}
                        sessionId={activeSessionId}
                        topDisease={diseases?.[0]?.name}
                        medicines={treatment?.medicines || []}
                    />
                )}
            </div>
        </>
    );
};

export default DiagnosisResults;