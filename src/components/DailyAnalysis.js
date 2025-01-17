import React from 'react';
import { getIntensityColor, getTextColor } from '../utils/colorUtils';

const DailyAnalysis = ({ analysis }) => {
    return (
        <div className="flex flex-col gap-6">
            {analysis.map((day, index) => (
                <div key={index} className="daily-analysis-container">
                    <h3 className="font-bold mb-4 text-lg">{day.day_info.day_text}</h3>
                    <div style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        margin: "0 -1rem",
                        padding: "0 1rem",
                        position: "relative",
                        width: "auto"
                    }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(24, 44px)",
                            gap: "2px",
                            width: "fit-content"
                        }}>
                            {day.hour_analysis.map((hour, hourIndex) => (
                                <div
                                    key={hourIndex}
                                    className="hour-cell"
                                    style={{
                                        backgroundColor: getIntensityColor(hour.intensity_nr),
                                        color: getTextColor(hour.intensity_nr),
                                        padding: "0.5rem",
                                        height: "44px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        cursor: "help",
                                        boxSizing: "border-box",
                                        minWidth: "44px"
                                    }}
                                    title={`${hour.hour}:00 - ${hour.intensity_txt}`}
                                >
                                    {hour.hour}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hours-display" style={{ marginTop: "1rem" }}>
                        <p><strong>Busy Hours:</strong> {day.busy_hours.map(h => `${h}:00`).join(", ")}</p>
                        <p><strong>Quiet Hours:</strong> {day.quiet_hours.map(h => `${h}:00`).join(", ")}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DailyAnalysis;
