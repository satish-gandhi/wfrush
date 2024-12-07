import React from 'react';
import { getIntensityColor, getTextColor } from '../utils/colorUtils';

const DailyAnalysis = ({ analysis }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {analysis.map((day, index) => (
                <div key={index} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
                    <h3 className="font-bold mb-2">{day.day_info.day_text}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: "2px" }}>
                        {day.hour_analysis.map((hour, hourIndex) => (
                            <div
                                key={hourIndex}
                                style={{
                                    backgroundColor: getIntensityColor(hour.intensity_nr),
                                    color: getTextColor(hour.intensity_nr),
                                    padding: "0.5rem",
                                    height: "2rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    cursor: "default"
                                }}
                                title={`${hour.hour}:00 - ${hour.intensity_txt}`}
                            >
                                {hour.hour}
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                        <p>Busy Hours: {day.busy_hours.map(h => `${h}:00`).join(", ")}</p>
                        <p>Quiet Hours: {day.quiet_hours.map(h => `${h}:00`).join(", ")}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DailyAnalysis;
