// FILE PATH: frontend/src/components/Diagnosis/SymptomInput.jsx
import React, { useState } from 'react';
import { useDiagnosis } from '../../context/DiagnosisContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, AlertCircle, Lightbulb, Loader2, Clock, Activity, ChevronDown } from 'lucide-react';

const SymptomInput = ({ onComplete }) => {
    const { translate } = useLanguage();
    const [symptoms, setSymptoms] = useState('');
    const [duration, setDuration] = useState('');
    const [severity, setSeverity] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { submitSymptoms } = useDiagnosis();

    const exampleSymptoms = ['ex_fever', 'ex_cough', 'ex_stomach', 'ex_chest'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!symptoms.trim()) { setError(translate('pleaseDescribeSymptoms')); return; }
        if (symptoms.trim().length < 10) { setError(translate('moreDetailsRequired')); return; }
        setIsLoading(true);
        try {
            const enrichedSymptoms = `${symptoms}. Duration: ${duration || 'Not specified'}. Severity: ${severity || 'Not specified'}.`;
            const result = await submitSymptoms(enrichedSymptoms);
            if (result.success) { if (!result.isEmergency) onComplete && onComplete(); }
            else setError(result.message || translate('somethingWentWrong'));
        } catch { setError(translate('somethingWentWrong')); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-200">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-black text-[#0f172a] tracking-tight pt-2">{translate('tellUsWhatYouFeel')}</h2>
                <p className="text-slate-500 font-semibold text-lg max-w-2xl mx-auto leading-relaxed">{translate('describeSymptomsDetail')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label htmlFor="symptoms" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                        <Activity className="w-4 h-4 text-blue-600" />{translate('describeSymptoms')}
                    </label>
                    <div className="relative">
                        <textarea id="symptoms" rows={6} value={symptoms} onChange={(e) => { setSymptoms(e.target.value); setError(''); }}
                            placeholder={translate('symptomsPlaceholder')}
                            className={`w-full px-8 py-7 bg-white border-2 rounded-3xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-semibold text-slate-700 placeholder:text-slate-300 resize-none shadow-sm ${error ? 'border-rose-300' : 'border-slate-200'}`}
                            disabled={isLoading} />
                        {error && (
                            <div className="flex items-center gap-2 text-rose-600 text-xs font-black mt-2 px-2">
                                <AlertCircle className="w-4 h-4" /><span>{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            label: 'howLongSymptoms', icon: <Clock className="w-4 h-4 text-blue-600" />, value: duration, setter: setDuration, key: 'dur', options: [
                                { val: 'Less than 24 hours', key: 'dur_less24h' }, { val: '1-3 days', key: 'dur_1_3d' },
                                { val: '3-7 days', key: 'dur_3_7d' }, { val: '1-2 weeks', key: 'dur_1_2w' }, { val: 'More than 2 weeks', key: 'dur_more2w' }
                            ], placeholder: 'selectDuration'
                        },
                        {
                            label: 'howSevere', icon: <Activity className="w-4 h-4 text-blue-600" />, value: severity, setter: setSeverity, key: 'sev', options: [
                                { val: 'Mild', key: 'sev_mild' }, { val: 'Moderate', key: 'sev_moderate' }, { val: 'Severe', key: 'sev_severe' }
                            ], placeholder: 'selectSeverity'
                        },
                    ].map((field) => (
                        <div key={field.key} className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                                {field.icon}{translate(field.label)}
                            </label>
                            <div className="relative">
                                <select value={field.value} onChange={(e) => field.setter(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer" disabled={isLoading}>
                                    <option value="">{translate(field.placeholder)}</option>
                                    {field.options.map(o => <option key={o.val} value={o.val}>{translate(o.key)}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tip box - changed from black to soft amber/yellow */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-7 flex items-center gap-5">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-amber-700 font-black uppercase tracking-widest text-[10px] mb-1">{translate('tipTitle')}</p>
                        <p className="text-amber-900 font-semibold text-sm leading-relaxed">{translate('symptomTip')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{translate('quickExamples')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exampleSymptoms.map((key) => (
                            <button key={key} type="button" onClick={() => { setSymptoms(translate(key)); setError(''); }}
                                className="group text-left px-6 py-4 bg-white border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 rounded-2xl transition-all shadow-sm active:scale-95" disabled={isLoading}>
                                <span className="text-slate-600 font-semibold group-hover:text-blue-700 transition-colors text-sm">{translate(key)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={isLoading || !symptoms.trim()}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-black text-xl rounded-3xl transition-all active:scale-95 shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 group">
                    {isLoading ? <><Loader2 className="w-7 h-7 animate-spin" /><span>{translate('analyzingSymptoms')}</span></> : <><Sparkles className="w-7 h-7 group-hover:scale-125 transition-transform" /><span>{translate('getAiDiagnosis')}</span></>}
                </button>
            </form>
        </div>
    );
};
export default SymptomInput;
