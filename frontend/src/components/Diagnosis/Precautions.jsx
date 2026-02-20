// FILE PATH: frontend/src/components/Diagnosis/Precautions.jsx

import React from 'react';
import Card from '../Shared/Card';
import { Shield } from 'lucide-react';

const Precautions = ({ precautions }) => {
    if (!precautions || precautions.length === 0) {
        return null;
    }

    const icons = ['🛡️', '💧', '🏥', '😷', '🌡️', '💤', '🚫', '🧼'];

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    🛡️ Safety Precautions
                </h3>
                <p className="text-gray-600 text-sm">
                    Important measures to follow for faster recovery
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {precautions.map((precaution, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3"
                    >
                        <div className="text-3xl flex-shrink-0">
                            {icons[index % icons.length]}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-800 font-medium text-sm">{precaution}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <p className="text-purple-800 font-semibold mb-2 text-sm">
                    ⚠️ When to Seek Immediate Medical Attention:
                </p>
                <ul className="text-sm text-purple-700 space-y-1 ml-4 list-disc">
                    <li>Symptoms worsen significantly</li>
                    <li>High fever persists for more than 3 days</li>
                    <li>Difficulty breathing or chest pain develops</li>
                    <li>Severe dehydration or inability to keep fluids down</li>
                    <li>Any sudden or concerning changes in condition</li>
                </ul>
            </div>
        </Card>
    );
};

export default Precautions;