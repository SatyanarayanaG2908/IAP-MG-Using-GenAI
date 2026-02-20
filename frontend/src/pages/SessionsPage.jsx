import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import diagnosisService from '../services/diagnosisService';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/Shared/Card';
import Loader from '../components/Shared/Loader';
import Button from '../components/Shared/Button';
import { Activity, Calendar, ArrowLeft, Filter } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const SessionsPage = () => {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Get query params
    const searchParams = new URLSearchParams(location.search);
    const statusFilter = searchParams.get('status'); // 'completed' or undefined
    const languageFilter = searchParams.get('language'); // 'true' for preferred language or undefined

    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            const result = await diagnosisService.getDiagnosisSessions();

            if (result.success) {
                const allSessions = result.data || [];
                setSessions(allSessions);

                // Apply filters
                let filtered = allSessions;

                if (statusFilter === 'completed') {
                    filtered = filtered.filter(s => s.status === 'completed');
                }

                // For this demo, let's assume 'Preferred Language' means filtered by English as per user dashboard context
                // In a real app we'd filter by user.language, but here we just show all for "Language" card click unless specified
                if (languageFilter) {
                    // If specific logic needed, add here. currently just showing all or filtered by completed
                    filtered = filtered.filter(s => s.status === 'completed'); // Usually language card implies completed sessions in that language
                }

                setFilteredSessions(filtered);
            }
            setLoading(false);
        };

        fetchSessions();
    }, [statusFilter, languageFilter]);

    const getPageTitle = () => {
        if (statusFilter === 'completed') return 'Completed Sessions';
        if (languageFilter) return 'Sessions by Preferred Language';
        return 'All Diagnosis Sessions';
    };

    if (loading) {
        return (
            <MainLayout>
                <Loader text="Loading sessions..." />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        icon={<ArrowLeft className="w-4 h-4" />}
                    >
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
                </div>

                {/* Filters (Visual only for now, could be functional) */}
                <div className="flex gap-2 pb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${!statusFilter && !languageFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        All
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        Completed
                    </span>
                </div>

                <Card>
                    {filteredSessions.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-600">No sessions found</h3>
                            <p className="text-gray-500 text-sm">Try starting a new diagnosis.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSessions.map((session) => (
                                <div
                                    key={session._id}
                                    onClick={() => navigate(`/diagnosis/results/${session.sessionId}`)}
                                    className="block p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${session.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 group-hover:text-blue-700">
                                                    {session.finalDisease || 'Diagnosis Incomplete'}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {session.symptoms}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(session.createdAt)}
                                                    </span>
                                                    {session.status === 'completed' && (
                                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                            Completed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </MainLayout>
    );
};

export default SessionsPage;
