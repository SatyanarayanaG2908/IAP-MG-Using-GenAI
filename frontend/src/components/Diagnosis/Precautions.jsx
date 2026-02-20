// FILE PATH: frontend/src/components/Diagnosis/Precautions.jsx
import React from 'react';
import Card from '../Shared/Card';
import { useLanguage } from '../../context/LanguageContext';

const Precautions = ({ precautions }) => {
    const { translate } = useLanguage();
    if (!precautions || precautions.length === 0) return null;
    const icons = ['🛡️', '💧', '🏥', '😷', '🌡️', '💤', '🚫', '🧼'];

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{translate('safetyPrecautions')}</h3>
                <p className="text-gray-600 text-sm">{translate('precautionsSubtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {precautions.map((p, i) => (
                    <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{icons[i % icons.length]}</div>
                        <p className="text-gray-800 font-medium text-sm">{p}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <p className="text-purple-800 font-semibold mb-2 text-sm">{translate('seekMedicalAttention')}</p>
                <ul className="text-sm text-purple-700 space-y-1 ml-4 list-disc">
                    <li>{translate('warnSymptomsWorsen')}</li>
                    <li>{translate('warnHighFever')}</li>
                    <li>{translate('warnBreathing')}</li>
                    <li>{translate('warnDehydration')}</li>
                    <li>{translate('warnSuddenChange')}</li>
                </ul>
            </div>
        </Card>
    );
};
export default Precautions;