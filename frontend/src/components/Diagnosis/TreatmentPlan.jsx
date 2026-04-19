// FILE PATH: frontend/src/components/Diagnosis/TreatmentPlan.jsx

import React from 'react';
import Card from '../Shared/Card';
import { useLanguage } from '../../context/LanguageContext';

const PRICES = {
    'paracetamol': '₹10–30', 'acetaminophen': '₹15–40', 'ibuprofen': '₹20–50',
    'cetirizine': '₹15–35', 'dextromethorphan': '₹40–80', 'pseudoephedrine': '₹30–60',
    'omeprazole': '₹25–60', 'pantoprazole': '₹30–70', 'metronidazole': '₹20–50',
    'amoxicillin': '₹50–120', 'azithromycin': '₹60–150', 'domperidone': '₹20–45',
    'ondansetron': '₹30–70', 'loperamide': '₹20–40', 'ors': '₹5–15',
    'antacid': '₹15–35', 'menthol': '₹20–50', 'saline': '₹10–30',
    'loratadine': '₹20–45', 'fexofenadine': '₹25–60', 'betamethasone': '₹30–80',
    'hydrocortisone': '₹40–90', 'calamine': '₹50–100', 'metformin': '₹20–60',
    'cough': '₹30–70', 'lozenges': '₹20–50', 'throat': '₹20–50',
    'nasal': '₹30–80', 'vitamin': '₹30–100', 'bismuth': '₹40–80',
    'glipizide': '₹30–80', 'antihistamine': '₹20–55',
};

const getPrice = (name) => {
    if (!name) return '₹20–80';
    const lower = name.toLowerCase();
    for (const [key, price] of Object.entries(PRICES)) {
        if (lower.includes(key)) return price;
    }
    return '₹20–80';
};

const TreatmentPlan = ({ treatment }) => {
    const { translate } = useLanguage();
    if (!treatment || !treatment.medicines || treatment.medicines.length === 0) return null;

    return (
        <Card className="animate-fade-in">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    {translate('recommendedMedicines') || 'Recommended Medicines'}
                </h3>
                <p className="text-gray-600 text-sm">
                    {translate('medicinesSubtitle') || 'Over-the-counter medications for symptom relief (information purpose only)'}
                </p>
            </div>
            <div className="space-y-4">
                {treatment.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{medicine.name}</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600 mb-1">
                                            <strong className="text-gray-800">{translate('medicineDosage') || 'Dosage'}:</strong> {medicine.dosage}
                                        </p>
                                        <p className="text-gray-600 mb-1">
                                            <strong className="text-gray-800">{translate('medicineFrequency') || 'Frequency'}:</strong> {medicine.frequency}
                                        </p>
                                        <p className="text-gray-600 mb-1">
                                            <strong className="text-gray-800">{translate('medicineDuration') || 'Duration'}:</strong> {medicine.duration}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">
                                            <strong className="text-gray-800">{translate('medicineTiming') || 'Timing'}:</strong> {medicine.timing || medicine.foodInstruction || '-'}
                                        </p>
                                        {medicine.sideEffects && (
                                            <p className="text-gray-600">
                                                <strong className="text-gray-800">{translate('medicineSideEffects') || 'Side Effects'}:</strong> {medicine.sideEffects}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price badge — clean, no "approx" text, distinct orange color */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-500 rounded-xl px-3 py-2.5 min-w-[72px] shadow-sm">
                                <span className="text-white text-xs font-semibold leading-none mb-0.5">MRP</span>
                                <span className="text-white text-sm font-extrabold leading-tight">{getPrice(medicine.name)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    {translate('otcWarning') || '⚠️ Important: These are general OTC medication suggestions. Consult a pharmacist or doctor before taking any medication, especially if you have existing medical conditions or allergies.'}
                </p>
            </div>
        </Card>
    );
};

export default TreatmentPlan;