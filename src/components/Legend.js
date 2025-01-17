import React from 'react';
import { getIntensityColor, getTextColor } from '../utils/colorUtils';

const Legend = () => {
    console.log("Legend component rendering");
    const legendItems = [
        { intensity: -2, label: "Very Quiet" },
        { intensity: -1, label: "Below Average" },
        { intensity: 0, label: "Average" },
        { intensity: 1, label: "Above Average" },
        { intensity: 2, label: "Very Busy" }
    ];

    return (
        <div className="daily-analysis-container mt-6" style={{ marginTop: "2rem" }}>
            <h4 className="font-bold mb-4 text-lg">Legend</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4" style={{ marginTop: "1rem" }}>
                {legendItems.map(({ intensity, label }) => (
                    <div key={intensity} className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <span
                            style={{
                                backgroundColor: getIntensityColor(intensity),
                                color: getTextColor(intensity),
                                border: "1px solid #e2e8f0"
                            }}
                            className="inline-block w-6 h-6 mr-3 rounded shadow-sm"
                        ></span>
                        <span className="text-gray-700">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Legend;
