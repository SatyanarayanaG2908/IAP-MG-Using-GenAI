// FILE PATH: frontend/src/components/Modals/SMSSetupModal.jsx

import React, { useState } from 'react';
import { Bell, X, Plus, Trash2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const SMSSetupModal = ({ isOpen, onClose, sessionId, topDisease, medicines = [] }) => {
    const { translate } = useLanguage();
    const [phone, setPhone] = useState('');
    const [medicineName, setMedicineName] = useState(medicines[0]?.name || '');
    const [reminderTimes, setReminderTimes] = useState(['09:00', '21:00']);
    const [enableMedicineReminder, setEnableMedicineReminder] = useState(true);
    const [enableFollowUp, setEnableFollowUp] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [testSMSLoading, setTestSMSLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAddTime = () => { if (reminderTimes.length < 6) setReminderTimes([...reminderTimes, '12:00']); };
    const handleRemoveTime = (i) => { if (reminderTimes.length > 1) setReminderTimes(reminderTimes.filter((_, idx) => idx !== i)); };
    const handleTimeChange = (i, val) => { const u = [...reminderTimes]; u[i] = val; setReminderTimes(u); };

    const handleSendTestSMS = async () => {
        if (!phone.trim()) { showNotification('error', 'Please enter phone number'); return; }
        setTestSMSLoading(true);
        try {
            const res = await api.post('/sms/test', { phone: phone.trim(), language: 'English' });
            if (res.data.success) showNotification('success', '✅ Test SMS sent successfully!');
            else showNotification('error', res.data.message || 'Test SMS failed');
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Test SMS failed. Check Twilio credentials.');
        } finally { setTestSMSLoading(false); }
    };

    const handleScheduleReminders = async () => {
        if (!phone.trim()) { showNotification('error', 'Please enter phone number'); return; }
        if (enableMedicineReminder && !medicineName.trim()) { showNotification('error', 'Please enter medicine name'); return; }
        if (enableFollowUp && !followUpDate) { showNotification('error', 'Please select follow-up date'); return; }
        if (!enableMedicineReminder && !enableFollowUp) { showNotification('error', 'Please select at least one reminder type'); return; }

        setLoading(true);
        try {
            const res = await api.post('/sms/setup-reminders', {
                sessionId, phone: phone.trim(),
                medicineName: enableMedicineReminder ? medicineName.trim() : 'General',
                reminderTimes: enableMedicineReminder ? reminderTimes : [],
                followUpDate: enableFollowUp ? followUpDate : null,
                language: 'English',
            });
            if (res.data.success) {
                showNotification('success', '✅ SMS Reminders scheduled successfully!');
                setTimeout(() => onClose(), 1500);
            } else {
                showNotification('error', res.data.message || 'Failed to schedule reminders');
            }
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to schedule. Check backend.');
            setTimeout(() => onClose(), 2000);
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        // Fixed full-screen overlay — works from ANY page
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">SMS Reminders</h2>
                            <p className="text-xs text-slate-400 font-medium">Schedule medicine & follow-up alerts</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`mx-6 mt-4 p-3 rounded-2xl flex items-center gap-2 text-sm font-bold ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {notification.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                        {notification.message}
                    </div>
                )}

                <div className="p-6 space-y-5">
                    {/* Top disease info */}
                    {topDisease && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">For Condition</p>
                            <p className="font-bold text-blue-800 text-sm">{topDisease}</p>
                        </div>
                    )}

                    {/* Phone input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-slate-700">Phone Number <span className="text-rose-500">*</span></label>
                            <button onClick={handleSendTestSMS} disabled={testSMSLoading || !phone.trim()}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl disabled:opacity-50 font-bold transition-all">
                                {testSMSLoading
                                    ? <><div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />Sending...</>
                                    : <><Send className="w-3 h-3" />Test SMS</>}
                            </button>
                        </div>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-50 outline-none text-sm font-medium" />
                        <p className="text-xs text-slate-400 mt-1 ml-1">Format: +919876543210</p>
                    </div>

                    {/* Medicine reminder */}
                    <div className="border-2 border-slate-100 rounded-2xl p-4">
                        <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <input type="checkbox" checked={enableMedicineReminder} onChange={e => setEnableMedicineReminder(e.target.checked)}
                                className="w-4 h-4 text-amber-600 rounded accent-amber-600" />
                            <span className="text-sm font-bold text-slate-700">💊 Medicine Reminders</span>
                        </label>
                        {enableMedicineReminder && (
                            <div className="space-y-3 ml-7">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-1 block">Medicine Name</label>
                                    <input type="text" value={medicineName} onChange={e => setMedicineName(e.target.value)}
                                        placeholder="e.g., Paracetamol 500mg"
                                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-amber-400 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 mb-2 block">Reminder Times</label>
                                    <div className="space-y-2">
                                        {reminderTimes.map((time, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="flex items-center gap-2 flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl bg-slate-50">
                                                    <span className="text-slate-400 text-xs">⏰</span>
                                                    <input type="time" value={time} onChange={e => handleTimeChange(i, e.target.value)}
                                                        className="flex-1 bg-transparent text-sm font-medium focus:outline-none" />
                                                </div>
                                                {reminderTimes.length > 1 && (
                                                    <button onClick={() => handleRemoveTime(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {reminderTimes.length < 6 && (
                                        <button onClick={handleAddTime} className="mt-2 flex items-center gap-1 text-xs text-amber-600 font-bold hover:text-amber-700">
                                            <Plus className="w-3 h-3" />Add Time
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Follow-up reminder */}
                    <div className="border-2 border-slate-100 rounded-2xl p-4">
                        <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <input type="checkbox" checked={enableFollowUp} onChange={e => setEnableFollowUp(e.target.checked)}
                                className="w-4 h-4 rounded accent-amber-600" />
                            <span className="text-sm font-bold text-slate-700">📅 Follow-up Reminder</span>
                        </label>
                        {enableFollowUp && (
                            <div className="ml-7">
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Follow-up Date</label>
                                <input type="date" value={followUpDate} min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setFollowUpDate(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-amber-400 outline-none" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                        <p className="text-xs text-amber-700 font-medium">💡 Reminders run 24/7 via backend scheduler. SMS will be sent even when the app is closed.</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 text-sm transition-all">
                            Cancel
                        </button>
                        <button onClick={handleScheduleReminders} disabled={loading}
                            className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95">
                            {loading
                                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Scheduling...</>
                                : <><Bell className="w-4 h-4" />Schedule Reminders</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SMSSetupModal;