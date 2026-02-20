// FILE PATH: frontend/src/components/Modals/EmergencyAlert.jsx

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, Heart, Clock, Shield } from 'lucide-react';

const EmergencyAlert = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emergencyData = location.state?.emergencyData || {};

    useEffect(() => {
        // Prevent back navigation
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Parse detected symptoms from the emergency data
    const detectedSymptoms = emergencyData.symptoms || [];
    const triggeredKeywords = emergencyData.keywords || [];

    // Symptom explanation database
    const symptomExplanations = {
        // ── Cardiac/Breathing ──
        'chest pain': {
            simple: 'Severe chest pain or pressure can indicate a heart attack or other cardiac emergency.',
            medical: 'Myocardial infarction (heart attack) occurs when blood flow to the heart is blocked. Immediate intervention is critical to prevent permanent heart damage.',
            severity: 'CRITICAL',
        },
        'difficulty breathing': {
            simple: 'Severe breathing problems or shortness of breath may indicate respiratory failure or heart issues.',
            medical: 'Dyspnea (difficulty breathing) can result from pulmonary embolism, heart failure, severe asthma, or pneumothorax requiring urgent medical assessment.',
            severity: 'CRITICAL',
        },
        'shortness of breath': {
            simple: 'Inability to breathe normally may signal heart or lung problems.',
            medical: 'Acute respiratory distress may indicate cardiac arrest, pulmonary edema, or severe respiratory infection requiring immediate oxygen therapy.',
            severity: 'CRITICAL',
        },

        // ── Neurological ──
        'severe headache': {
            simple: 'Sudden, severe headache (especially "worst headache ever") may indicate bleeding in the brain.',
            medical: 'Subarachnoid hemorrhage or intracranial bleeding presents with sudden onset severe headache. Immediate CT scan and neurological assessment required.',
            severity: 'CRITICAL',
        },
        'unconscious': {
            simple: 'Loss of consciousness indicates the brain is not getting enough oxygen or blood.',
            medical: 'Altered level of consciousness may indicate stroke, severe hypoglycemia, cardiac arrest, or traumatic brain injury requiring immediate stabilization.',
            severity: 'CRITICAL',
        },
        'confusion': {
            simple: 'Sudden confusion or disorientation can indicate stroke, infection, or low blood sugar.',
            medical: 'Acute altered mental status may indicate cerebrovascular accident (stroke), sepsis, or metabolic derangement requiring urgent evaluation.',
            severity: 'HIGH',
        },
        'slurred speech': {
            simple: 'Difficulty speaking or slurred speech is a key sign of stroke.',
            medical: 'Dysarthria or aphasia indicates potential ischemic or hemorrhagic stroke affecting speech centers. Time-critical treatment with thrombolytics may be indicated.',
            severity: 'CRITICAL',
        },

        // ── Bleeding/Trauma ──
        'bleeding': {
            simple: 'Uncontrolled bleeding, especially from major wounds or internally, requires immediate medical care.',
            medical: 'Hemorrhage from major vessels or internal bleeding can lead to hypovolemic shock. Immediate hemostasis and fluid resuscitation required.',
            severity: 'CRITICAL',
        },
        'bleeding gums': {
            simple: 'Spontaneous bleeding from gums along with other symptoms may indicate low platelet count or blood disorder.',
            medical: 'Thrombocytopenia (low platelets) in dengue hemorrhagic fever or other bleeding disorders requires immediate platelet monitoring and supportive care.',
            severity: 'HIGH',
        },
        'vomiting blood': {
            simple: 'Vomiting blood indicates serious internal bleeding in the digestive system.',
            medical: 'Hematemesis suggests upper gastrointestinal bleeding from ulcers, varices, or Mallory-Weiss tears requiring urgent endoscopy.',
            severity: 'CRITICAL',
        },

        // ── Severe Pain ──
        'severe abdominal pain': {
            simple: 'Intense abdominal pain may indicate appendicitis, internal bleeding, or organ rupture.',
            medical: 'Acute abdomen may indicate appendicitis, perforated ulcer, ectopic pregnancy, or abdominal aortic aneurysm requiring surgical evaluation.',
            severity: 'HIGH',
        },

        // ── Neurological Motor ──
        'paralysis': {
            simple: 'Sudden inability to move body parts indicates stroke or spinal injury.',
            medical: 'Acute motor deficit suggests stroke (CVA), spinal cord injury, or Guillain-Barré syndrome requiring immediate neurological intervention.',
            severity: 'CRITICAL',
        },
        'weakness': {
            simple: 'Sudden weakness on one side of the body is a classic stroke symptom.',
            medical: 'Unilateral weakness (hemiparesis) indicates cerebrovascular accident requiring immediate CT/MRI and potential thrombolytic therapy within golden hour.',
            severity: 'CRITICAL',
        },

        // ── Other Critical ──
        'seizure': {
            simple: 'Seizures involve uncontrolled electrical activity in the brain and require immediate medical attention.',
            medical: 'Seizures may indicate epilepsy, stroke, brain tumor, or metabolic disturbance. Status epilepticus requires immediate anticonvulsant therapy.',
            severity: 'HIGH',
        },
        'high fever': {
            simple: 'Very high fever (above 103°F/39.4°C) especially with other symptoms can indicate serious infection.',
            medical: 'Hyperpyrexia may indicate sepsis, meningitis, or severe systemic infection requiring immediate antibiotics and supportive care.',
            severity: 'HIGH',
        },
    };

    // Match detected symptoms to explanations
    const matchedSymptoms = [];
    const symptomsText = (emergencyData.symptomsText || '').toLowerCase();

    triggeredKeywords.forEach((keyword) => {
        const kw = keyword.toLowerCase();
        if (symptomExplanations[kw]) {
            matchedSymptoms.push({
                keyword: keyword,
                ...symptomExplanations[kw],
            });
        }
    });

    // If no specific matches, use generic explanations
    if (matchedSymptoms.length === 0 && symptomsText) {
        // Try to match any keywords from the text
        Object.keys(symptomExplanations).forEach((key) => {
            if (symptomsText.includes(key)) {
                matchedSymptoms.push({
                    keyword: key.charAt(0).toUpperCase() + key.slice(1),
                    ...symptomExplanations[key],
                });
            }
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">

                {/* Alert Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-pulse-slow">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <AlertTriangle className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            ⚠️ MEDICAL EMERGENCY DETECTED
                        </h1>
                        <p className="text-red-100 text-lg">
                            Immediate Medical Attention Required
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">

                        {/* Critical Symptoms Identified */}
                        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Critical Symptoms Identified:
                            </h3>
                            {matchedSymptoms.length > 0 ? (
                                <ul className="space-y-3">
                                    {matchedSymptoms.map((symptom, index) => (
                                        <li key={index} className="text-sm">
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${symptom.severity === 'CRITICAL'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-orange-600 text-white'
                                                    }`}>
                                                    {symptom.severity}
                                                </span>
                                                <span className="font-bold text-red-800">
                                                    {symptom.keyword}
                                                </span>
                                            </div>

                                            <div className="ml-4 space-y-2">
                                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                                        🔍 Simple Explanation:
                                                    </p>
                                                    <p className="text-sm text-gray-800">{symptom.simple}</p>
                                                </div>

                                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                    <p className="text-xs font-semibold text-blue-600 mb-1">
                                                        🏥 Medical Reasoning:
                                                    </p>
                                                    <p className="text-sm text-blue-900">{symptom.medical}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-red-700 font-semibold">
                                        ⚠️ Severe chest pain or pressure
                                    </p>
                                    <p className="text-red-700 font-semibold">
                                        ⚠️ Difficulty breathing or shortness of breath
                                    </p>
                                    <p className="text-red-700 font-semibold">
                                        ⚠️ Sudden severe symptoms
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Immediate Actions */}
                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                Immediate Actions to Take:
                            </h3>
                            <ol className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-600 flex-shrink-0">1.</span>
                                    <span>Call emergency services immediately (numbers below)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-600 flex-shrink-0">2.</span>
                                    <span>Do NOT drive yourself - wait for ambulance or get someone to drive you</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-600 flex-shrink-0">3.</span>
                                    <span>If alone, inform a neighbor or friend immediately</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-600 flex-shrink-0">4.</span>
                                    <span>Keep calm and try to stay still</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-600 flex-shrink-0">5.</span>
                                    <span>Have your ID and any medical records ready</span>
                                </li>
                            </ol>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Emergency Contact Numbers
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { number: '108', label: 'Ambulance (India)' },
                                    { number: '102', label: 'Medical Emergency' },
                                    { number: '1066', label: 'COVID Helpline' },
                                ].map((contact) => (
                                    <a
                                        key={contact.number}
                                        href={`tel:${contact.number}`}
                                        className="flex flex-col items-center justify-center p-4 bg-white hover:bg-blue-100 border-2 border-blue-400 rounded-xl transition-colors group"
                                    >
                                        <Phone className="w-6 h-6 text-blue-600 mb-2 group-hover:animate-bounce" />
                                        <span className="text-2xl font-bold text-blue-600">
                                            {contact.number}
                                        </span>
                                        <span className="text-xs text-gray-600">{contact.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-start gap-3">
                            <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-800">
                                <p className="font-bold mb-1">⚠️ THIS IS A MEDICAL EMERGENCY</p>
                                <p>
                                    Do not wait for symptoms to improve. Do not delay seeking medical care.
                                    Immediate professional medical intervention is required to prevent serious
                                    complications or death.
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Heart className="w-5 h-5" />
                            I Understand - Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyAlert;