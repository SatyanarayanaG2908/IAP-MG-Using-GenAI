// FILE PATH: frontend/src/components/Diagnosis/DietPlan.jsx
import React from 'react';
import Card from '../Shared/Card';
import { Apple, Ban } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DietPlan = ({ diet }) => {
    const { translate } = useLanguage();
    if (!diet) return null;
    const recommended = diet.recommended || [];
    const avoid = diet.avoid || [];

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{translate('dietRecommendations')}</h3>
                <p className="text-gray-600 text-sm">{translate('dietSubtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"><Apple className="w-6 h-6 text-white" /></div>
                        <h4 className="text-lg font-bold text-green-800">{translate('foodsToEat')}</h4>
                    </div>
                    <ul className="space-y-2">
                        {recommended.map((food, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-600 font-bold mt-1">✓</span><span>{food}</span>
                            </li>
                        ))}
                        {recommended.length === 0 && <p className="text-gray-500 italic">{translate('noSpecificRecommendations')}</p>}
                    </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center"><Ban className="w-6 h-6 text-white" /></div>
                        <h4 className="text-lg font-bold text-red-800">{translate('foodsToAvoid')}</h4>
                    </div>
                    <ul className="space-y-2">
                        {avoid.map((food, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-red-600 font-bold mt-1">✗</span><span>{food}</span>
                            </li>
                        ))}
                        {avoid.length === 0 && <p className="text-gray-500 italic">{translate('noSpecificRestrictions')}</p>}
                    </ul>
                </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">{translate('dietTip')}</p>
            </div>
        </Card>
    );
};
export default DietPlan;