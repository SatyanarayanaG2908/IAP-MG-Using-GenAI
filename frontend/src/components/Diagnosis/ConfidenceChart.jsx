// FILE PATH: frontend/src/components/Diagnosis/ConfidenceChart.jsx

import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const ConfidenceChart = ({ diseases }) => {
    if (!diseases || diseases.length === 0) {
        return null;
    }

    // Take top 3 diseases
    const topDiseases = diseases.slice(0, 3);

    // ── 3 DISTINCT PROFESSIONAL COLORS ──
    const COLORS = [
        '#2563eb', // Blue - Most likely (#1)
        '#10b981', // Green - Second (#2)
        '#f59e0b', // Amber/Orange - Third (#3)
    ];

    // Prepare data for charts
    const pieData = topDiseases.map((disease, index) => ({
        name: disease.name,
        value: disease.confidence,
        color: COLORS[index],
    }));

    const barData = topDiseases.map((disease, index) => ({
        name: disease.name.length > 30
            ? disease.name.substring(0, 30) + '...'
            : disease.name,
        fullName: disease.name,
        confidence: disease.confidence,
        fill: COLORS[index],
    }));

    // Custom label for pie chart
    const renderLabel = (entry) => {
        return `${entry.value}%`;
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 text-sm">
                        {payload[0].payload.fullName || payload[0].name}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Confidence: <span className="font-bold">{payload[0].value}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Confidence Levels
            </h3>

            <div className="grid md:grid-cols-2 gap-8">

                {/* ── PIE CHART ── */}
                <div>
                    <h4 className="text-center text-sm font-semibold text-gray-600 mb-4">
                        Confidence Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderLabel}
                                outerRadius={80}
                                innerRadius={40}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend for Pie */}
                    <div className="flex flex-col gap-2 mt-4">
                        {topDiseases.map((disease, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: COLORS[index] }}
                                />
                                <span className="text-gray-700 truncate flex-1">
                                    {disease.name}
                                </span>
                                <span className="font-bold text-gray-800">
                                    {disease.confidence}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BAR CHART ── */}
                <div>
                    <h4 className="text-center text-sm font-semibold text-gray-600 mb-4">
                        Probability Analysis
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={150}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="confidence" radius={[0, 8, 8, 0]}>
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Color Guide */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded" />
                        <span>Most Likely</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span>Second Most Likely</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded" />
                        <span>Third Most Likely</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfidenceChart;