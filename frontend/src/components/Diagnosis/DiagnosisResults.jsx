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
            <div key={t.id} className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold border-2 ${t.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' : 'bg-white border-rose-200 text-rose-800'}`}>
                {t.type === 'success' ? <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-4 h-4 text-white" /></div> : <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0"><AlertCircle className="w-4 h-4 text-white" /></div>}
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
    return { toasts, removeToast: id => setToasts(p => p.filter(t => t.id !== id)), success: msg => add('success', msg), error: msg => add('error', msg) };
};

const DiagnosisResults = ({ onRestart }) => {
    const { currentSession, diagnosisResult, loading, error: diagnosisError, analyzeDiagnosis } = useDiagnosis();
    const { user } = useAuth();
    const { language, translate } = useLanguage();
    const navigate = useNavigate();
    const { sessionId: urlSessionId } = useParams();
    const toast = useToast();
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

    useEffect(() => { if (!diagnosisResult && activeSessionId) performAnalysis(); }, [diagnosisResult, activeSessionId]);

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
                {/* Results header */}
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
                            {diseases.map((disease, i) => <DiseaseCard key={i} disease={disease} rank={i + 1} isPrimary={i === 0} />)}
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

                {/* Action Buttons - redesigned */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {/* Download PDF */}
                    <button onClick={handleDownloadPDF} disabled={pdfLoading}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-blue-200">
                        {pdfLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7 group-hover:scale-110 transition-transform" />}
                        <span className="text-sm text-center leading-tight">{pdfLoading ? translate('generating') : translate('downloadPDF')}</span>
                    </button>

                    {/* Email Report */}
                    <button onClick={handleSendEmail} disabled={emailLoading}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-emerald-200">
                        {emailLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Mail className="w-7 h-7 group-hover:scale-110 transition-transform" />}
                        <span className="text-sm text-center leading-tight">{emailLoading ? translate('sending') : translate('emailReport')}</span>
                    </button>

                    {/* SMS Reminders */}
                    <button onClick={() => setShowSMSModal(true)}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-amber-200">
                        <Bell className="w-7 h-7 group-hover:scale-110 transition-transform group-hover:animate-bounce" />
                        <span className="text-sm text-center leading-tight">{translate('smsReminders')}</span>
                    </button>

                    {/* Start New */}
                    <button onClick={onRestart || (() => navigate('/diagnosis'))}
                        className="group flex flex-col items-center justify-center gap-2 py-6 px-4 bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-slate-300">
                        <RefreshCw className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-sm text-center leading-tight">{translate('startNewDiagnosis')}</span>
                    </button>
                </div>

                {showSMSModal && <SMSSetupModal isOpen={showSMSModal} onClose={() => setShowSMSModal(false)} sessionId={activeSessionId} topDisease={diseases?.[0]?.name} medicines={treatment?.medicines || []} />}
            </div>
        </>
    );
};
export default DiagnosisResults;
