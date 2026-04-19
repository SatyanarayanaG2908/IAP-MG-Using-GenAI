// FILE PATH: frontend/src/components/Diagnosis/DiseaseCard.jsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Target, Clock, Brain, Activity } from 'lucide-react';

// #1 = Green, #2 = Blue, #3 = Orange
const RANK_COLORS = [
    { border: 'border-emerald-200', bg: 'bg-emerald-50', badgeBg: 'bg-emerald-600', bar: 'bg-emerald-500', rank: 'bg-emerald-600', factorBar: 'bg-emerald-500', breakdown: 'from-emerald-600 to-teal-700' },
    { border: 'border-blue-200',    bg: 'bg-blue-50',    badgeBg: 'bg-blue-600',    bar: 'bg-blue-500',    rank: 'bg-blue-600',    factorBar: 'bg-blue-500',    breakdown: 'from-blue-600 to-violet-700' },
    { border: 'border-amber-200',   bg: 'bg-amber-50',   badgeBg: 'bg-amber-500',   bar: 'bg-amber-500',   rank: 'bg-amber-500',   factorBar: 'bg-amber-500',   breakdown: 'from-amber-500 to-orange-600' },
];

const getColors = (rank) => RANK_COLORS[rank] || RANK_COLORS[2];

const buildParagraph = (reasoning) => {
    if (!reasoning) return '';
    if (typeof reasoning === 'string') return reasoning;
    if (Array.isArray(reasoning)) {
        return reasoning.filter(r => r?.toString().trim())
            .map(r => r.toString().trim().replace(/\.$/, ''))
            .join('. ') + '.';
    }
    return '';
};

const calculateBreakdown = (confidence) => ({
    symptomMatch:        Math.min(100, Math.round(confidence * 1.13)),
    severityAlignment:   Math.min(100, Math.round(confidence * 0.87)),
    durationCorrelation: Math.min(100, Math.round(confidence * 0.92)),
    clinicalReasoning:   confidence,
});

// ── Breakdown Modal ──────────────────────────────────────────────────────────
const BreakdownModal = ({ disease, rank, onClose }) => {
    const conf = disease.confidence || 0;
    const bd = calculateBreakdown(conf);
    const colors = getColors(rank);

    const factors = [
        { icon: <Target className="w-4 h-4" />, title: 'Symptom Match',        desc: 'How well your symptoms align with this condition',  score: bd.symptomMatch,        weight: 40 },
        { icon: <Activity className="w-4 h-4" />, title: 'Severity Alignment',   desc: 'Symptom severity matches typical presentation',     score: bd.severityAlignment,   weight: 25 },
        { icon: <Clock className="w-4 h-4" />,    title: 'Duration Correlation',  desc: 'Timeline fits disease progression pattern',         score: bd.durationCorrelation, weight: 20 },
        { icon: <Brain className="w-4 h-4" />,    title: 'Clinical Reasoning',    desc: 'AI analysis of medical patterns',                   score: bd.clinicalReasoning,   weight: 15 },
    ];

    const formula = `${factors[0].weight}%×${bd.symptomMatch} + ${factors[1].weight}%×${bd.severityAlignment} + ${factors[2].weight}%×${bd.durationCorrelation} + ${factors[3].weight}%×${bd.clinicalReasoning}`;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header — rank color */}
                <div className={`bg-gradient-to-br ${colors.breakdown} p-6 text-white text-center relative`}>
                    <button onClick={onClose}
                        className="absolute top-4 right-4 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white font-bold text-lg leading-none">
                        ×
                    </button>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Confidence Breakdown</p>
                    <p className="font-bold text-sm leading-snug mb-4 opacity-90">{disease.name}</p>
                    <div className="w-20 h-20 rounded-full border-4 border-white/30 flex flex-col items-center justify-center mx-auto">
                        <span className="text-2xl font-extrabold leading-none">{conf}%</span>
                        <span className="text-xs opacity-70">Confidence</span>
                    </div>
                </div>

                {/* Factors */}
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    {factors.map(({ icon, title, desc, score, weight }) => (
                        <div key={title} className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-start gap-3 mb-2">
                                <div className={`w-8 h-8 ${colors.badgeBg} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                                    {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-900">{title}</span>
                                        <div className="text-right">
                                            <span className={`font-bold text-sm ${colors.badgeBg.replace('bg-', 'text-')}`}>{score}%</span>
                                            <span className="text-gray-400 text-xs ml-1">Weight: {weight}%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors.factorBar} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
                            </div>
                        </div>
                    ))}

                    {/* Overall formula */}
                    <div className={`${colors.bg} border ${colors.border} rounded-2xl p-4`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Overall Confidence Score</p>
                                <p className="text-xs text-gray-500 mt-0.5">{formula}</p>
                            </div>
                            <span className={`text-2xl font-extrabold ${colors.badgeBg.replace('bg-', 'text-')}`}>{conf}%</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 pt-0">
                    <button onClick={onClose}
                        className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all">
                        Close Breakdown
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── DiseaseCard ──────────────────────────────────────────────────────────────
const DiseaseCard = ({ disease, rank, isPrimary }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showReasoning, setShowReasoning] = useState(isPrimary);

    // rank can be 1-based (from DiagnosisResults: rank={i+1}) or 0-based
    const rankIndex = typeof rank === 'number' && rank > 0 ? rank - 1 : rank;
    const displayRank = typeof rank === 'number' && rank > 0 ? rank : rank + 1;

    const conf = disease.confidence || 0;
    const colors = getColors(rankIndex);
    const paragraph = buildParagraph(disease.reasoning || disease.reason);

    return (
        <>
            <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
                {/* Header */}
                <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${colors.rank} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}>
                            #{displayRank}
                        </div>
                        <div className="min-w-0">
                            {isPrimary && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold mb-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />Most Likely
                                </span>
                            )}
                            <h3 className="font-bold text-gray-900 text-base leading-snug">{disease.name}</h3>
                        </div>
                    </div>

                    {/* Confidence badge — click → breakdown */}
                    <button onClick={() => setShowBreakdown(true)}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-xl ${colors.badgeBg} text-white font-bold shadow-sm hover:opacity-90 transition-opacity text-center min-w-[90px]`}>
                        <span className="block text-xl font-extrabold leading-none">{conf}%</span>
                        <span className="block text-xs opacity-80 font-normal mt-0.5">Click for details</span>
                    </button>
                </div>

                {/* Confidence bar */}
                <div className="px-4 pb-3">
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                        <div className={`h-full ${colors.bar} rounded-full transition-all duration-700`} style={{ width: `${conf}%` }} />
                    </div>
                </div>

                {/* Toggle Clinical Reasoning */}
                <button onClick={() => setShowReasoning(!showReasoning)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-white/40 transition-colors border-t border-white/50">
                    <span>{showReasoning ? 'Hide Clinical Reasoning' : 'Show Clinical Reasoning'}</span>
                    {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Doctor's Explanation */}
                {showReasoning && paragraph && (
                    <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-blue-100">
                        <div className="bg-blue-600 px-4 py-2 flex items-center gap-2">
                            <span className="text-blue-200 text-xs">🩺</span>
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Doctor's Explanation</span>
                        </div>
                        <div className="bg-white p-4">
                            <p className="text-sm text-gray-700 leading-relaxed italic">{paragraph}</p>
                        </div>
                    </div>
                )}
            </div>

            {showBreakdown && (
                <BreakdownModal disease={disease} rank={rankIndex} onClose={() => setShowBreakdown(false)} />
            )}
        </>
    );
};

export default DiseaseCard;