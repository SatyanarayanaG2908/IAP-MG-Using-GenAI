// FILE PATH: frontend/src/components/Diagnosis/TreatmentPlan.jsx
import React from 'react';
import Card from '../Shared/Card';
import { useLanguage } from '../../context/LanguageContext';

const TreatmentPlan = ({ treatment }) => {
    const { translate } = useLanguage();
    if (!treatment || !treatment.medicines || treatment.medicines.length === 0) return null;

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">{translate('recommendedMedicines')}</h3>
                <p className="text-gray-600 text-sm">{translate('medicinesSubtitle')}</p>
            </div>
            <div className="space-y-4">
                {treatment.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{medicine.name}</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600 mb-1"><strong className="text-gray-800">{translate('medicineDosage')}:</strong> {medicine.dosage}</p>
                                        <p className="text-gray-600 mb-1"><strong className="text-gray-800">{translate('medicineFrequency')}:</strong> {medicine.frequency}</p>
                                        <p className="text-gray-600 mb-1"><strong className="text-gray-800">{translate('medicineDuration')}:</strong> {medicine.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1"><strong className="text-gray-800">{translate('medicineTiming')}:</strong> {medicine.timing || medicine.foodInstruction || '-'}</p>
                                        {medicine.sideEffects && <p className="text-gray-600"><strong className="text-gray-800">{translate('medicineSideEffects')}:</strong> {medicine.sideEffects}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center min-w-[60px] shadow-sm">
                                <p className="text-2xl font-bold text-green-600">{index + 1}</p>
                                <p className="text-xs text-gray-500">{translate('medicineNo')}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{translate('otcWarning')}</p>
            </div>
        </Card>
    );
};
export default TreatmentPlan;