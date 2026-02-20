// FILE PATH: frontend/src/pages/DiagnosisPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../context/DiagnosisContext';
import { useLanguage } from '../context/LanguageContext';
import SymptomInput from '../components/Diagnosis/SymptomInput';
import DiagnosisResults from '../components/Diagnosis/DiagnosisResults';
import { ArrowLeft, Activity } from 'lucide-react';

const DiagnosisPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const { diagnosisResult, resetDiagnosis } = useDiagnosis();
    const { translate } = useLanguage();
    const navigate = useNavigate();

    // KEY FIX: When this page mounts (any navigation to /diagnosis),
    // ALWAYS reset previous diagnosis so symptom input shows fresh
    useEffect(() => {
        resetDiagnosis();
        setCurrentStep(1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Only move to step 2 AFTER user submits symptoms (not on mount)
    useEffect(() => {
        if (diagnosisResult?.diseases?.length > 0) {
            setCurrentStep(2);
        }
    }, [diagnosisResult]);

    const handleSymptomsSubmit = () => setCurrentStep(2);
    const handleRestart = () => {
        resetDiagnosis();
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10 relative">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-300 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-[#0f172a]">{translate('aiMedicalDiagnosis')}</h1>
                    <p className="text-slate-500 font-semibold mt-1">{translate('instantHealthAssessment')}</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[
                        { num: 1, label: translate('symptoms') },
                        { num: 2, label: translate('aiAnalysis') },
                    ].map((step, i, arr) => (
                        <React.Fragment key={step.num}>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md transition-all ${currentStep >= step.num ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                                    {step.num}
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${currentStep >= step.num ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < arr.length - 1 && (
                                <div className={`h-1 w-24 rounded-full mb-5 transition-all ${currentStep >= step.num + 1 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-slate-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 lg:p-12">
                    {currentStep === 1 ? (
                        <SymptomInput onComplete={handleSymptomsSubmit} />
                    ) : (
                        <DiagnosisResults onRestart={handleRestart} />
                    )}
                </div>
            </div>
        </div>
    );
};
export default DiagnosisPage;