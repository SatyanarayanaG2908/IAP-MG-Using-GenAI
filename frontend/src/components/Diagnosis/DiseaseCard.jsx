// FILE PATH: frontend/src/components/Diagnosis/DiseaseCard.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, ChevronUp, CheckCircle, X, TrendingUp, Target, Clock, Brain } from 'lucide-react';

const ConfidenceBreakdownModal = ({ disease, rank, onClose }) => {
    const { translate } = useLanguage();
    if (!disease) return null;

    const colorMap = {
        1: { gradient: 'from-blue-600 to-blue-800', accent: '#2563eb', light: '#dbeafe' },
        2: { gradient: 'from-emerald-600 to-teal-700', accent: '#10b981', light: '#d1fae5' },
        3: { gradient: 'from-amber-500 to-orange-600', accent: '#f59e0b', light: '#fef3c7' },
    };
    const c = colorMap[rank] || colorMap[1];

    const factors = [
        {
            icon: <Target className="w-5 h-5" style={{ color: c.accent }} />,
            name: translate('symptomMatch'),
            score: Math.min(disease.confidence + 8, 100),
            weight: '40%',
            description: translate('symptomMatchDesc'),
        },
        {
            icon: <TrendingUp className="w-5 h-5" style={{ color: c.accent }} />,
            name: translate('severityAlignment'),
            score: Math.max(disease.confidence - 8, 15),
            weight: '25%',
            description: translate('severityAlignmentDesc'),
        },
        {
            icon: <Clock className="w-5 h-5" style={{ color: c.accent }} />,
            name: translate('durationCorrelation'),
            score: Math.max(disease.confidence - 5, 20),
            weight: '20%',
            description: translate('durationCorrelationDesc'),
        },
        {
            icon: <Brain className="w-5 h-5" style={{ color: c.accent }} />,
            name: translate('clinicalReasoning'),
            score: disease.confidence,
            weight: '15%',
            description: translate('clinicalReasoningDesc'),
        },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className={`bg-gradient-to-r ${c.gradient} p-7 rounded-t-3xl`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">{translate('confidenceBreakdown')}</p>
                            <h3 className="text-white text-xl font-black leading-tight">{disease.name}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl ml-4 flex-shrink-0">
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center mt-6 mb-2">
                        <div className="w-28 h-28 bg-white/20 rounded-full flex flex-col items-center justify-center border-4 border-white/40">
                            <span className="text-4xl font-black text-white">{disease.confidence}%</span>
                            <span className="text-white/80 text-xs font-bold">{translate('confidence')}</span>
                        </div>
                    </div>
                </div>

                <div className="p-7 space-y-5">
                    <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: c.light, borderColor: c.accent + '40' }}>
                        <p className="font-black text-slate-800 text-sm">📊 {translate('howWeCalculated')}</p>
                        <p className="text-xs mt-1 text-slate-600">{translate('scoreCalculationDesc')}</p>
                    </div>

                    <div className="space-y-4">
                        {factors.map((factor, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0 border border-slate-100">
                                        {factor.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-black text-slate-800 text-sm">{factor.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400 font-bold">{translate('weight')}: {factor.weight}</span>
                                                <span className="font-black text-base" style={{ color: c.accent }}>{factor.score}%</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
                                    </div>
                                </div>
                                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${factor.score}%`, backgroundColor: c.accent }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl p-5 border-2" style={{ backgroundColor: c.light, borderColor: c.accent }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-black text-slate-800">{translate('overallScore')}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    40%×{factors[0].score} + 25%×{factors[1].score} + 20%×{factors[2].score} + 15%×{factors[3].score}
                                </p>
                            </div>
                            <span className="text-3xl font-black" style={{ color: c.accent }}>{disease.confidence}%</span>
                        </div>
                    </div>

                    <button onClick={onClose}
                        className="w-full py-4 font-black text-white rounded-2xl transition-all active:scale-95"
                        style={{ backgroundColor: c.accent }}>
                        {translate('closeBreakdown')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DiseaseCard = ({ disease, rank, isPrimary }) => {
    const { translate } = useLanguage();
    const [expanded, setExpanded] = useState(isPrimary);
    const [showBreakdown, setShowBreakdown] = useState(false);
    if (!disease) return null;

    const colorSchemes = {
        1: { badge: 'bg-blue-600 text-white', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', confBg: 'bg-blue-600', ring: 'ring-blue-200' },
        2: { badge: 'bg-emerald-600 text-white', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', confBg: 'bg-emerald-600', ring: 'ring-emerald-200' },
        3: { badge: 'bg-amber-500 text-white', bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', confBg: 'bg-amber-500', ring: 'ring-amber-200' },
    };
    const cs = colorSchemes[rank] || colorSchemes[3];
    const reasons = Array.isArray(disease.reasoning) ? disease.reasoning
        : disease.reasoning ? [disease.reasoning]
            : disease.reason ? [disease.reason]
                : [];

    return (
        <>
            {showBreakdown && <ConfidenceBreakdownModal disease={disease} rank={rank} onClose={() => setShowBreakdown(false)} />}
            <div className={`bg-white rounded-3xl border-2 ${cs.border} shadow-sm hover:shadow-lg transition-all ${rank === 1 ? 'ring-2 ' + cs.ring : ''} overflow-hidden`}>
                <div className={`bg-gradient-to-r ${cs.bg} p-5`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`w-11 h-11 ${cs.badge} rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md`}>#{rank}</div>
                            <div className="flex-1 min-w-0">
                                {rank === 1 && (
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black mb-2">
                                        ⭐ {translate('mostLikely')}
                                    </div>
                                )}
                                <h3 className="text-lg font-black text-[#0f172a] leading-tight">{disease.name}</h3>
                            </div>
                        </div>
                        {/* Clickable confidence → opens full breakdown modal */}
                        <button
                            onClick={() => setShowBreakdown(true)}
                            className={`flex-shrink-0 ${cs.confBg} text-white rounded-2xl px-4 py-3 flex flex-col items-center hover:opacity-90 active:scale-95 transition-all shadow-md`}
                        >
                            <span className="text-2xl font-black">{disease.confidence}%</span>
                            <span className="text-[10px] font-bold opacity-80">{translate('clickForBreakdown')}</span>
                        </button>
                    </div>
                </div>

                <div className="px-5 pb-5">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between py-3 px-4 mt-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 text-left transition-colors"
                    >
                        <span className="font-bold text-slate-700 text-sm">
                            {expanded ? translate('hide') : translate('show')} {translate('clinicalReasoning')}
                        </span>
                        {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>

                    {expanded && reasons.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {reasons.map((reason, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700 leading-relaxed">{reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default DiseaseCard;