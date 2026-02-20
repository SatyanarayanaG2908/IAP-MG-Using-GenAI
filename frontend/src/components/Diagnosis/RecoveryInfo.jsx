// FILE PATH: frontend/src/components/Diagnosis/RecoveryInfo.jsx
import React from 'react';
import Card from '../Shared/Card';
import { Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const RecoveryInfo = ({ recovery }) => {
    const { translate } = useLanguage();
    if (!recovery) return null;
    const { duration, timeline, followUp, confidence } = recovery;

    const getConfidenceText = () => {
        const c = String(confidence || '').toLowerCase();
        if (c.includes('high')) return translate('confidenceHigh');
        if (c.includes('medium') || c.includes('moderate')) return translate('confidenceMedium');
        if (c.includes('low')) return translate('confidenceLow');
        // If Gemini already translated it (non-English), show as-is
        return confidence ? String(confidence) : translate('confidenceHigh');
    };

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{translate('recoveryInformation')}</h3>
                <p className="text-gray-600 text-sm">{translate('recoverySubtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{translate('expectedRecovery')}</h4>
                            <p className="text-2xl font-bold text-blue-600">{duration}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{translate('mostPatientsRecover')}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{translate('recoveryOutlook')}</h4>
                            <p className="text-xl font-bold text-green-600">{confidence || 'High'}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{getConfidenceText()}</p>
                </div>
            </div>
            {timeline && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">{translate('recoveryTimeline')}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{timeline}</p>
                </div>
            )}
            {followUp && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">{translate('followUpRecommendations')}</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {Array.isArray(followUp)
                            ? followUp.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold mt-0.5">→</span><span>{item}</span>
                                </li>
                            ))
                            : <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold mt-0.5">→</span><span>{followUp}</span>
                            </li>
                        }
                    </ul>
                </div>
            )}
        </Card>
    );
};
export default RecoveryInfo;