// FILE PATH: frontend/src/components/Modals/SMSSetupModal.jsx

import React, { useState } from 'react';
import { X, Phone, Clock, Calendar, Plus, Trash2, Bell, Send } from 'lucide-react';
import api from '../../services/api';

const SMSSetupModal = ({ isOpen, onClose, sessionId, topDisease, medicines = [] }) => {
    const today = new Date().toISOString().split('T')[0];
    const oneWeekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [phone, setPhone] = useState('');
    const [medicineName, setMedicineName] = useState(medicines?.[0]?.name || '');
    const [reminderTimes, setReminderTimes] = useState(['09:00', '21:00']);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(oneWeekLater);
    const [enableMedicine, setEnableMedicine] = useState(true);
    const [enableFollowup, setEnableFollowup] = useState(false);
    const [followupDate, setFollowupDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!isOpen) return null;

    const addTime = () => {
        if (reminderTimes.length < 6) setReminderTimes([...reminderTimes, '12:00']);
    };

    const removeTime = (i) => {
        if (reminderTimes.length > 1) setReminderTimes(reminderTimes.filter((_, idx) => idx !== i));
    };

    const updateTime = (i, val) => {
        const updated = [...reminderTimes];
        updated[i] = val;
        setReminderTimes(updated);
    };

    const handleTestSMS = async () => {
        if (!phone) { setMessage({ type: 'error', text: 'Please enter phone number' }); return; }
        setTestLoading(true);
        try {
            const res = await api.post('/sms/test', { phone: `+91${phone}` });
            if (res.data?.success) setMessage({ type: 'success', text: '✅ Test SMS sent!' });
            else setMessage({ type: 'error', text: res.data?.message || 'Test SMS failed' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Test SMS failed' });
        } finally { setTestLoading(false); }
    };

    const handleSubmit = async () => {
        if (!phone) { setMessage({ type: 'error', text: 'Phone number required' }); return; }
        if (!startDate || !endDate) { setMessage({ type: 'error', text: 'Start and end dates required' }); return; }
        if (new Date(endDate) <= new Date(startDate)) { setMessage({ type: 'error', text: 'End date must be after start date' }); return; }

        setLoading(true);
        try {
            const payload = {
                sessionId,
                phone: `+91${phone}`,
                medicineName: enableMedicine ? medicineName : null,
                reminderTimes: enableMedicine ? reminderTimes : [],
                startDate,
                endDate,
                followUpDate: enableFollowup ? followupDate : null,
                language: 'English',
            };

            const res = await api.post('/sms/setup-reminders', payload);
            if (res.data?.success) {
                setMessage({ type: 'success', text: '✅ SMS reminders scheduled successfully!' });
                setTimeout(() => onClose(), 2000);
            } else {
                setMessage({ type: 'error', text: res.data?.message || 'Failed to setup reminders' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to setup reminders' });
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900">SMS Reminders</h3>
                            <p className="text-xs text-gray-400">Set up medicine alerts</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    {/* Condition badge */}
                    {topDisease && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">For Condition</p>
                            <p className="text-blue-700 font-bold mt-1">{topDisease}</p>
                        </div>
                    )}

                    {/* Phone */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />Phone Number *
                            </label>
                            <button onClick={handleTestSMS} disabled={testLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
                                <Send className="w-3 h-3" />
                                {testLoading ? 'Sending...' : 'Test SMS'}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
                                🇮🇳 +91
                            </div>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="9876543210" maxLength={10}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Format: +919876543210</p>
                    </div>

                    {/* Start & End Date */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mb-2">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />Start Date *
                            </label>
                            <input type="date" value={startDate} min={today}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mb-2">
                                <Calendar className="w-3.5 h-3.5 text-red-400" />End Date *
                            </label>
                            <input type="date" value={endDate} min={startDate || today}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all" />
                        </div>
                    </div>
                    {startDate && endDate && new Date(endDate) > new Date(startDate) && (
                        <p className="text-xs text-emerald-600 font-medium -mt-3">
                            ✓ {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days of reminders
                        </p>
                    )}

                    {/* Medicine Reminders */}
                    <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="medicine" checked={enableMedicine} onChange={e => setEnableMedicine(e.target.checked)}
                                className="w-4 h-4 accent-amber-500 rounded" />
                            <label htmlFor="medicine" className="text-sm font-bold text-gray-800 flex items-center gap-1.5 cursor-pointer">
                                💊 Medicine Reminders
                            </label>
                        </div>

                        {enableMedicine && (
                            <div className="space-y-4 pl-7">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Medicine Name</label>
                                    <input type="text" value={medicineName} onChange={e => setMedicineName(e.target.value)}
                                        placeholder="e.g., Paracetamol 500mg"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />Reminder Times
                                    </label>
                                    <div className="space-y-2">
                                        {reminderTimes.map((time, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-orange-50 border border-orange-200 rounded-xl">
                                                    <span className="text-orange-400 text-sm">⏰</span>
                                                    <input type="time" value={time} onChange={e => updateTime(i, e.target.value)}
                                                        className="flex-1 bg-transparent text-sm font-semibold text-gray-700 focus:outline-none" />
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                </div>
                                                {reminderTimes.length > 1 && (
                                                    <button onClick={() => removeTime(i)} className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {reminderTimes.length < 6 && (
                                            <button onClick={addTime} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                                                <Plus className="w-4 h-4" />Add Time
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Follow-up Reminder */}
                    <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="followup" checked={enableFollowup} onChange={e => setEnableFollowup(e.target.checked)}
                                className="w-4 h-4 accent-blue-500 rounded" />
                            <label htmlFor="followup" className="text-sm font-bold text-gray-800 flex items-center gap-1.5 cursor-pointer">
                                🗓️ Follow-up Reminder
                            </label>
                        </div>
                        {enableFollowup && (
                            <div className="pl-7">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Follow-up Date</label>
                                <input type="date" value={followupDate} min={today}
                                    onChange={e => setFollowupDate(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all" />
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Setting up...</>
                            ) : (
                                <><Bell className="w-4 h-4" />Schedule Reminders</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SMSSetupModal;