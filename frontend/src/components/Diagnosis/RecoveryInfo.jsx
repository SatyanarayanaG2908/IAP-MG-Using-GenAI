// FILE PATH: frontend/src/components/Diagnosis/RecoveryInfo.jsx

import React from 'react';
import Card from '../Shared/Card';
import { Clock, TrendingUp } from 'lucide-react';

const RecoveryInfo = ({ recovery }) => {
    if (!recovery) {
        return null;
    }

    const { duration, timeline, followUp } = recovery;

    const getConfidenceColor = (conf) => {
        if (conf === 'High') return 'text-green-600 bg-green-100';
        if (conf === 'Medium') return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    ⏱️ Recovery Information
                </h3>
                <p className="text-gray-600 text-sm">
                    Expected timeline and follow-up guidance
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Expected Recovery Time */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">Expected Recovery</h4>
                            <p className="text-2xl font-bold text-blue-600">{duration}</p>
                        </div>
                    </div>
                    {/* FIXED: Smaller text size, structured layout */}
                    <p className="text-sm text-gray-600">
                        Most patients recover within this timeframe with proper care and rest.
                    </p>
                </div>

                {/* Recovery Confidence */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">Recovery Outlook</h4>
                            <p className={`text-2xl font-bold ${getConfidenceColor(recovery.confidence || 'High').split(' ')[0]}`}>
                                {recovery.confidence || 'High'} Confidence
                            </p>
                        </div>
                    </div>
                    {/* FIXED: Smaller text size, structured layout */}
                    <p className="text-sm text-gray-600">
                        {recovery.confidence === 'High' && 'Full recovery is expected with recommended treatment.'}
                        {recovery.confidence === 'Medium' && 'Good recovery expected with proper care and monitoring.'}
                        {recovery.confidence === 'Low' && 'Medical supervision may be needed for recovery.'}
                        {!recovery.confidence && 'Full recovery is expected with recommended treatment.'}
                    </p>
                </div>
            </div>

            {/* FIXED: Timeline section with structured layout instead of giant paragraph */}
            {timeline && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Recovery Timeline
                    </h4>
                    {/* FIXED: Normal text size (14px) instead of oversized */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {timeline}
                    </p>
                </div>
            )}

            {/* Follow-up Guidance */}
            {followUp && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Follow-up Recommendations
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {Array.isArray(followUp) ? (
                            followUp.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold mt-0.5">→</span>
                                    <span>{item}</span>
                                </li>
                            ))
                        ) : (
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold mt-0.5">→</span>
                                <span>{followUp}</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </Card>
    );
};

export default RecoveryInfo;