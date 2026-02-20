// FILE PATH: frontend/src/context/DiagnosisContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import diagnosisService from '../services/diagnosisService';
import { storage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

const DiagnosisContext = createContext();

export const useDiagnosis = () => {
    const context = useContext(DiagnosisContext);
    if (!context) throw new Error('useDiagnosis must be used within DiagnosisProvider');
    return context;
};

export const DiagnosisProvider = ({ children }) => {
    const navigate = useNavigate();
    const [currentSession, setCurrentSession] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [isEmergency, setIsEmergency] = useState(false);
    const [emergencyData, setEmergencyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedSessionId = storage.get(STORAGE_KEYS.DIAGNOSIS_SESSION);
        if (savedSessionId) setCurrentSession(savedSessionId);
    }, []);

    // Get current language from localStorage — always fresh
    const getCurrentLanguage = () => {
        return localStorage.getItem(STORAGE_KEYS?.LANGUAGE || 'language') || 'English';
    };

    const submitSymptoms = async (symptomsText) => {
        try {
            setLoading(true);
            setError(null);
            // Always read language fresh from storage at time of submission
            const language = getCurrentLanguage();
            console.log(`📤 Submitting symptoms in language: ${language}`);

            const result = await diagnosisService.submitAndAnalyze(symptomsText, language);

            if (result.success) {
                const { sessionId, isEmergency: emergency, emergencyData: emergData, diagnosis } = result.data;
                setCurrentSession(sessionId);
                setSymptoms(symptomsText);
                storage.set(STORAGE_KEYS.DIAGNOSIS_SESSION, sessionId);
                if (emergency) {
                    setIsEmergency(true);
                    setEmergencyData(emergData);
                    navigate('/emergency');
                    return { success: true, isEmergency: true };
                }
                setDiagnosisResult(diagnosis);
                return { success: true, isEmergency: false, sessionId, diagnosis };
            } else {
                setError(result.message);
                return { success: false, message: result.message };
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to submit symptoms';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const analyzeDiagnosis = async (language) => {
        try {
            setLoading(true);
            setError(null);
            if (!currentSession) throw new Error('No active session');
            // Use provided language or fallback to storage
            const lang = language || getCurrentLanguage();
            console.log(`🔍 Analyzing diagnosis in language: ${lang}`);
            const result = await diagnosisService.analyzeDiagnosis(currentSession, lang);
            if (result.success) {
                setDiagnosisResult(result.data.diagnosis);
                return { success: true, diagnosis: result.data.diagnosis };
            } else {
                setError(result.message);
                return { success: false, message: result.message };
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to analyze symptoms';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const resetDiagnosis = () => {
        setCurrentSession(null);
        setSymptoms('');
        setDiagnosisResult(null);
        setIsEmergency(false);
        setEmergencyData(null);
        setError(null);
        storage.remove(STORAGE_KEYS.DIAGNOSIS_SESSION);
    };

    const value = {
        currentSession, symptoms, diagnosisResult, isEmergency, emergencyData,
        loading, error, submitSymptoms, analyzeDiagnosis, resetDiagnosis, setError
    };

    return <DiagnosisContext.Provider value={value}>{children}</DiagnosisContext.Provider>;
};