// FILE PATH: frontend/src/components/Diagnosis/ConfidenceChart.jsx

import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// #1 Green, #2 Blue, #3 Orange
const RANK_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
const RANK_LABELS = ['Most Likely', 'Second Most Likely', 'Third Most Likely'];

// Custom label outside the donut
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="600">
            {`${value}%`}
        </text>
    );
};

const ConfidenceChart = ({ diseases }) => {
    if (!diseases || diseases.length === 0) return null;

    const data = diseases.slice(0, 3).map((d, i) => ({
        name: d.name,
        value: d.confidence || 0,
        color: RANK_COLORS[i],
    }));

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-6">Confidence Levels</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Donut Chart — proper shape */}
                <div>
                    <p className="text-sm font-semibold text-gray-500 text-center mb-2">Confidence Distribution</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={95}
                                paddingAngle={2}
                                dataKey="value"
                                labelLine={false}
                                label={renderCustomLabel}
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [`${value}%`, name]}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div>
                    <p className="text-sm font-semibold text-gray-500 text-center mb-2">Probability Analysis</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={110}
                                tick={{ fontSize: 11 }}
                                tickFormatter={(v) => v.length > 16 ? v.substring(0, 16) + '...' : v}
                            />
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'Confidence']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                            />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Percentage list */}
            <div className="mt-2 space-y-2 px-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                            <span className="text-sm text-gray-700">{d.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{d.value}%</span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 flex-wrap mt-4">
                {RANK_LABELS.slice(0, data.length).map((label, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RANK_COLORS[i] }} />
                        <span className="text-xs text-gray-500">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConfidenceChart;