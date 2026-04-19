// FILE PATH: frontend/src/components/Diagnosis/SymptomInput.jsx

import React, { useState } from 'react';
import { Activity, Sparkles, AlertTriangle, Lightbulb, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const COMMON_SYMPTOMS = [
    'Fever', 'Headache', 'Cough', 'Sore throat', 'Body pain',
    'Fatigue', 'Nausea', 'Vomiting', 'Diarrhea', 'Stomach pain',
    'Chest pain', 'Shortness of breath', 'Runny nose', 'Dizziness',
    'Back pain', 'Skin rash', 'Loss of appetite', 'Chills',
    'Joint pain', 'Muscle weakness',
];

const SymptomInput = ({ onSubmit, isLoading }) => {
    const { translate } = useLanguage();
    const [symptoms, setSymptoms] = useState('');
    const [selectedBubbles, setSelectedBubbles] = useState([]);
    const [error, setError] = useState('');

    const toggleBubble = (symptom) => {
        const isSelected = selectedBubbles.includes(symptom);
        const newSelected = isSelected
            ? selectedBubbles.filter(s => s !== symptom)
            : [...selectedBubbles, symptom];

        setSelectedBubbles(newSelected);

        // Merge bubble selections with any manually typed text
        const manualParts = symptoms
            .split(',')
            .map(s => s.trim())
            .filter(s => s && !COMMON_SYMPTOMS.map(c => c.toLowerCase()).includes(s.toLowerCase()));

        const combined = [...manualParts, ...newSelected].filter(Boolean).join(', ');
        setSymptoms(combined);
        setError('');
    };

    const handleChange = (e) => {
        setSymptoms(e.target.value);
        setError('');
        // Sync bubble state with textarea
        const typed = e.target.value.split(',').map(s => s.trim().toLowerCase());
        setSelectedBubbles(
            COMMON_SYMPTOMS.filter(s => typed.includes(s.toLowerCase()))
        );
    };

    const handleSubmit = () => {
        const trimmed = symptoms.trim();
        if (!trimmed || trimmed.length < 3) {
            setError(translate('symptomsRequired') || 'Please describe your symptoms or select from below.');
            return;
        }
        onSubmit(trimmed);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">

            {/* Icon + Title */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 text-center">Tell Us What You're Feeling</h2>
                <p className="text-gray-500 mt-2 text-sm text-center max-w-md">
                    Describe your symptoms in detail. Our AI will analyze and provide instant medical guidance.
                </p>
            </div>

            {/* Symptoms Textarea */}
            <div className="mb-5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                    <Activity className="w-3.5 h-3.5" />
                    {translate('describeSymptoms') || 'Describe Your Symptoms'} *
                </label>
                <textarea
                    value={symptoms}
                    onChange={handleChange}
                    placeholder="Example: I have been experiencing a persistent headache for 3 days, along with mild fever and body aches..."
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-2xl resize-none text-gray-800 text-sm leading-relaxed
                        focus:outline-none focus:ring-0 transition-all placeholder-gray-300 font-medium
                        ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-400'}`}
                />
                {error && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        <p className="text-xs text-red-500 font-medium">{error}</p>
                    </div>
                )}
            </div>

            {/* 20 Symptom Bubbles */}
            <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    ⚡ Quick Select — Common Symptoms
                </p>
                <div className="flex flex-wrap gap-2">
                    {COMMON_SYMPTOMS.map(symptom => {
                        const isActive = selectedBubbles.includes(symptom);
                        return (
                            <button
                                key={symptom}
                                type="button"
                                onClick={() => toggleBubble(symptom)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                                    ${isActive
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                {isActive && <X className="w-3 h-3" />}
                                {symptom}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    <span className="font-bold">TIP FOR BETTER RESULTS: </span>
                    Be as specific as possible. Mention when symptoms started, any triggers, patterns, or related symptoms. More details = more accurate AI diagnosis.
                </p>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base
                    bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700
                    text-white shadow-lg shadow-blue-200 transition-all active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {translate('analyzingSymptoms') || 'Analyzing your symptoms...'}
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        {translate('getAIDiagnosis') || 'Get AI Diagnosis'}
                    </>
                )}
            </button>
        </div>
    );
};

export default SymptomInput;