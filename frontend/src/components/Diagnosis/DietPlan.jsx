// FILE PATH: frontend/src/components/Diagnosis/DietPlan.jsx

import React from 'react';
import Card from '../Shared/Card';
import { Apple, Ban } from 'lucide-react';

const DietPlan = ({ diet }) => {
    if (!diet) {
        return null;
    }

    const recommended = diet.recommended || [];
    const avoid = diet.avoid || [];

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    🥗 Diet Recommendations
                </h3>
                <p className="text-gray-600 text-sm">
                    Foods that can help in recovery and those to avoid
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Foods to Eat */}
                <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <Apple className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-green-800">
                            Foods to Eat
                        </h4>
                    </div>

                    <ul className="space-y-2">
                        {recommended.map((food, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-600 font-bold mt-1">✓</span>
                                <span>{food}</span>
                            </li>
                        ))}
                    </ul>

                    {recommended.length === 0 && (
                        <p className="text-gray-500 italic">No specific recommendations</p>
                    )}
                </div>

                {/* Foods to Avoid */}
                <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <Ban className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-red-800">
                            Foods to Avoid
                        </h4>
                    </div>

                    <ul className="space-y-2">
                        {avoid.map((food, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-red-600 font-bold mt-1">✗</span>
                                <span>{food}</span>
                            </li>
                        ))}
                    </ul>

                    {avoid.length === 0 && (
                        <p className="text-gray-500 italic">No specific restrictions</p>
                    )}
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                    <strong>💡 Tip:</strong> Maintain a balanced diet with plenty of fluids.
                    Individual dietary needs may vary based on allergies and existing conditions.
                </p>
            </div>
        </Card>
    );
};

export default DietPlan;