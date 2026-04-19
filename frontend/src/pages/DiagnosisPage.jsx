// FILE PATH: frontend/src/pages/DiagnosisPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../context/DiagnosisContext';
import SymptomInput from '../components/Diagnosis/SymptomInput';
import DiagnosisResults from '../components/Diagnosis/DiagnosisResults';
import { ArrowLeft, Activity } from 'lucide-react';

// ── Doctor Analyzing Animation ───────────────────────────────────────────────
const STEPS = [
    'Reading symptom details',
    'Cross-referencing medical database',
    'Evaluating possible conditions',
    'Preparing treatment recommendations',
];

const DoctorAnimation = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const si = setInterval(() => setActiveStep(p => p < STEPS.length - 1 ? p + 1 : p), 1800);
        const pi = setInterval(() => setPulse(p => !p), 800);
        return () => { clearInterval(si); clearInterval(pi); };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25" style={{ animationDuration: '2s' }} />
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-blue-50 to-violet-50 border-4 border-blue-100 flex items-center justify-center shadow-xl">
                    <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none">
                        <ellipse cx="60" cy="85" rx="28" ry="22" fill="#E8F4FD" stroke="#93C5FD" strokeWidth="1.5" />
                        <path d="M35 80 Q38 65 60 63 Q82 65 85 80 L85 107 Q60 112 35 107 Z" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
                        <rect x="53" y="63" width="14" height="25" rx="2" fill="#DBEAFE" />
                        <circle cx="60" cy="42" r="18" fill="#FDE68A" stroke="#FCD34D" strokeWidth="1.5" />
                        <path d="M42 38 Q43 22 60 20 Q77 22 78 38" fill="#92400E" />
                        <circle cx="53" cy="40" r="2.5" fill="#1E293B" />
                        <circle cx="67" cy="40" r="2.5" fill="#1E293B" />
                        <path d="M53 48 Q60 54 67 48" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <path d="M50 65 Q46 72 48 80 Q50 88 58 88" stroke="#60A5FA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <circle cx="58" cy="90" r="4" fill="#3B82F6" />
                        <path d="M70 65 Q74 72 72 80 Q70 88 58 88" stroke="#60A5FA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <rect x="56" y="70" width="16" height="10" rx="2" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
                        <text x="64" y="78" textAnchor="middle" fontSize="5" fill="#3B82F6" fontWeight="bold">DR</text>
                    </svg>
                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg transition-transform duration-500 ${pulse ? 'scale-110' : 'scale-100'}`}>
                        <span className="text-white text-xs font-bold">AI</span>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Doctor is Analyzing...</h3>
            <p className="text-sm text-gray-500 mb-5">Reviewing your symptoms carefully</p>
            <div className="flex gap-1.5 mb-6">
                {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 200}ms`, animationDuration: '1s' }} />
                ))}
            </div>
            <div className="w-full max-w-xs bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                {STEPS.map((step, i) => (
                    <div key={step} className={`flex items-center gap-3 transition-all duration-500 ${i <= activeStep ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                            ${i < activeStep ? 'bg-emerald-500' : i === activeStep ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`}>
                            {i < activeStep
                                ? <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                : i === activeStep ? <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                : <div className="w-2 h-2 rounded-full bg-gray-300" />
                            }
                        </div>
                        <span className={`text-sm font-medium ${i <= activeStep ? 'text-gray-800' : 'text-gray-400'}`}>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── DiagnosisPage ────────────────────────────────────────────────────────────
const DiagnosisPage = () => {
    const navigate = useNavigate();
    const { diagnosisResult, isLoading, submitSymptoms, resetDiagnosis } = useDiagnosis();
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => { resetDiagnosis(); }, []);

    const handleSubmit = async (symptoms) => {
        setAnalyzing(true);
        await submitSymptoms(symptoms);
        setAnalyzing(false);
    };

    const handleRestart = () => { resetDiagnosis(); setAnalyzing(false); };
    const showResults = diagnosisResult?.diseases?.length > 0 && !analyzing;

    return (
        <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <div className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">AI Medical Diagnosis</p>
                            <p className="text-xs text-gray-400">Instant health assessment powered by Google Gemini AI</p>
                        </div>
                    </div>
                    <div className="w-24" />
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 py-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 lg:px-16 py-10">
                        {analyzing ? (
                            <DoctorAnimation />
                        ) : showResults ? (
                            // DiagnosisResults handles its own buttons + PDF/Email/SMS logic
                            <DiagnosisResults onRestart={handleRestart} />
                        ) : (
                            <SymptomInput onSubmit={handleSubmit} isLoading={isLoading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiagnosisPage;